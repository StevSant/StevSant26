import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import {
  Profile,
  Project,
  Experience,
  Competition,
  Event,
  Skill,
  SkillCategory,
  SkillCategoryTranslation,
  getTranslation,
} from '@core/models';

interface SkillWithLevel extends Skill {
  calculatedLevel: number;
  categoryName?: string;
}

interface SkillCategoryWithSkills extends SkillCategory {
  skills: SkillWithLevel[];
}

@Component({
  selector: 'app-profile-preview',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, TranslatePipe, SafeHtmlPipe],
  templateUrl: './profile-preview.component.html',
})
export class ProfilePreviewComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);

  loading = signal(true);
  profile = signal<Profile | null>(null);
  avatarUrl = signal<string | null>(null);
  bannerUrl = signal<string | null>(null);
  projects = signal<Project[]>([]);
  experiences = signal<Experience[]>([]);
  competitions = signal<Competition[]>([]);
  events = signal<Event[]>([]);
  skillCategories = signal<SkillCategoryWithSkills[]>([]);

  currentLang = computed(() => this.languageService.currentLanguageCode());

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadProfile(),
      this.loadProjects(),
      this.loadExperiences(),
      this.loadCompetitions(),
      this.loadEvents(),
      this.loadSkillsWithLevels(),
    ]);
    this.loading.set(false);
  }

  private async loadProfile(): Promise<void> {
    const { data } = await this.supabase
      .from('profiles')
      .select('*, translations:profile_translations(*)')
      .single();
    if (data) {
      this.profile.set(data as Profile);
    }

    // Load avatar from images table
    const { data: avatarImages } = await this.supabase.getImagesBySourceType('profile');
    if (avatarImages && avatarImages.length > 0) {
      this.avatarUrl.set(avatarImages[0].url);
    }

    // Load banner from images table
    const { data: bannerImages } = await this.supabase.getImagesBySourceType('profile_banner');
    if (bannerImages && bannerImages.length > 0) {
      this.bannerUrl.set(bannerImages[0].url);
    }
  }

  private async loadProjects(): Promise<void> {
    const { data } = await this.supabase
      .from('projects')
      .select('*, translations:project_translations(*)')
      .eq('is_archived', false)
      .order('is_pinned', { ascending: false })
      .order('position', { ascending: true })
      .limit(3);
    if (data) {
      this.projects.set(data as Project[]);
    }
  }

  private async loadExperiences(): Promise<void> {
    const { data } = await this.supabase
      .from('experiences')
      .select('*, translations:experience_translations(*)')
      .eq('is_archived', false)
      .order('start_date', { ascending: false });
    if (data) {
      this.experiences.set(data as Experience[]);
    }
  }

  private async loadCompetitions(): Promise<void> {
    const { data } = await this.supabase
      .from('competitions')
      .select('*, translations:competition_translations(*)')
      .eq('is_archived', false)
      .order('date', { ascending: false });
    if (data) {
      this.competitions.set(data as Competition[]);
    }
  }

  private async loadEvents(): Promise<void> {
    const { data } = await this.supabase
      .from('events')
      .select('*, translations:event_translations(*)')
      .eq('is_archived', false)
      .order('assisted_at', { ascending: false });
    if (data) {
      this.events.set(data as Event[]);
    }
  }

  private async loadSkillsWithLevels(): Promise<void> {
    // Load all skills with their categories
    const { data: skills } = await this.supabase
      .from('skills')
      .select(`
        *,
        translations:skill_translations(*),
        category:skill_categories(*, translations:skill_category_translations(*))
      `)
      .eq('is_archived', false);

    if (!skills || skills.length === 0) {
      this.skillCategories.set([]);
      return;
    }

    // Load skill usages to calculate levels (get most recent per skill)
    const { data: usages } = await this.supabase
      .from('skill_usages')
      .select('skill_id, level');

    // Build a map of skill_id -> most recent level
    const levelMap = new Map<number, number>();
    if (usages) {
      for (const usage of usages) {
        if (!levelMap.has(usage.skill_id) && usage.level) {
          levelMap.set(usage.skill_id, usage.level);
        }
      }
    }

    // Group skills by category
    const categoryMap = new Map<number | null, SkillCategoryWithSkills>();

    for (const skill of skills as any[]) {
      const categoryId = skill.skill_category_id || null;
      const calculatedLevel = levelMap.get(skill.id) || 0;

      const skillWithLevel: SkillWithLevel = {
        ...skill,
        calculatedLevel,
        categoryName: skill.category
          ? getTranslation<SkillCategoryTranslation>(skill.category.translations, this.currentLang())?.name
          : undefined,
      };

      if (!categoryMap.has(categoryId)) {
        const category = skill.category || {
          id: 0,
          name: 'Uncategorized',
          translations: [],
        };
        categoryMap.set(categoryId, {
          ...category,
          skills: [],
        });
      }

      categoryMap.get(categoryId)!.skills.push(skillWithLevel);
    }

    // Sort skills within each category by level descending
    for (const category of categoryMap.values()) {
      category.skills.sort((a, b) => b.calculatedLevel - a.calculatedLevel);
    }

    this.skillCategories.set(Array.from(categoryMap.values()));
  }

  getEntityTranslation(entity: any, field: string): string {
    const translation = getTranslation(entity.translations, this.currentLang());
    return (translation as any)?.[field] || '';
  }

  getProfileBio(): string {
    const p = this.profile();
    if (!p) return '';
    const translation = getTranslation(p.translations, this.currentLang());
    return translation?.about || '';
  }

  getProfileHeadline(): string {
    return '';
  }

  getCategoryName(category: SkillCategoryWithSkills): string {
    const translation = getTranslation(category.translations as any[], this.currentLang());
    return (translation as any)?.name || 'Other';
  }

  getStarArray(level: number): boolean[] {
    // Returns array of 5 booleans indicating filled stars
    return Array(5).fill(false).map((_, i) => i < level);
  }

  formatDateRange(startDate: string | null, endDate: string | null): string {
    if (!startDate) return '';
    const start = new Date(startDate).toLocaleDateString();
    if (!endDate) {
      return `${start} - Present`;
    }
    return `${start} - ${new Date(endDate).toLocaleDateString()}`;
  }
}
