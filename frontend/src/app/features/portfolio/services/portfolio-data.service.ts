import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import {
  Profile,
  Project,
  Experience,
  Competition,
  Event,
  Skill,
  SkillCategory,
  SkillCategoryTranslation,
  SkillUsage,
  Image,
  CvDocument,
  SourceType,
  getTranslation,
} from '@core/models';

export interface SkillWithLevel extends Skill {
  calculatedLevel: number;
  categoryName?: string;
}

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: SkillWithLevel[];
}

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);

  private initialized = false;

  loading = signal(true);
  profile = signal<Profile | null>(null);
  avatarUrl = signal<string | null>(null);
  bannerUrl = signal<string | null>(null);
  projects = signal<Project[]>([]);
  experiences = signal<Experience[]>([]);
  competitions = signal<Competition[]>([]);
  events = signal<Event[]>([]);
  skillCategories = signal<SkillCategoryWithSkills[]>([]);
  cvDocuments = signal<CvDocument[]>([]);

  /** Map: "sourceType:sourceId" → first image */
  private imageMap = new Map<string, Image>();
  /** Map: "sourceType:sourceId" → ALL images for that entity */
  private allImagesMap = new Map<string, Image[]>();
  /** Map: "sourceType:sourceId" → skill usages with skill data */
  private skillUsageMap = new Map<string, SkillUsage[]>();

  currentLang = computed(() => this.languageService.currentLanguageCode());

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (!isPlatformBrowser(this.platformId)) {
      this.loading.set(false);
      return;
    }

    await Promise.all([
      this.loadProfile(),
      this.loadProjects(),
      this.loadExperiences(),
      this.loadCompetitions(),
      this.loadEvents(),
      this.loadSkillsWithLevels(),
      this.loadAllImages(),
      this.loadAllSkillUsages(),
    ]);
    this.loading.set(false);
    this.initialized = true;
  }

  private async loadProfile(): Promise<void> {
    const { data } = await this.supabase
      .from('profile')
      .select('*, translations:profile_translation(*)')
      .limit(1);
    if (data && data.length > 0) {
      this.profile.set(data[0] as Profile);
    }

    const { data: avatarImages } = await this.supabase.getImagesBySourceType('profile');
    if (avatarImages && avatarImages.length > 0) {
      this.avatarUrl.set(avatarImages[0].url);
    }

    const { data: bannerImages } = await this.supabase.getImagesBySourceType('profile_banner');
    if (bannerImages && bannerImages.length > 0) {
      this.bannerUrl.set(bannerImages[0].url);
    }

    const { data: cvData } = await this.supabase
      .from('cv_document')
      .select('*, language:language(*)')
      .order('position', { ascending: true });
    if (cvData) {
      this.cvDocuments.set(cvData as CvDocument[]);
    }
  }

  private async loadProjects(): Promise<void> {
    const { data } = await this.supabase
      .from('project')
      .select('*, translations:project_translation(*)')
      .eq('is_archived', false)
      .order('is_pinned', { ascending: false })
      .order('position', { ascending: true });
    if (data) {
      this.projects.set(data as Project[]);
    }
  }

  private async loadExperiences(): Promise<void> {
    const { data } = await this.supabase
      .from('experience')
      .select('*, translations:experience_translation(*)')
      .eq('is_archived', false)
      .order('start_date', { ascending: false });
    if (data) {
      this.experiences.set(data as Experience[]);
    }
  }

  private async loadCompetitions(): Promise<void> {
    const { data } = await this.supabase
      .from('competitions')
      .select('*, translations:competitions_translation(*)')
      .eq('is_archived', false)
      .order('date', { ascending: false });
    if (data) {
      this.competitions.set(data as Competition[]);
    }
  }

  private async loadEvents(): Promise<void> {
    const { data } = await this.supabase
      .from('event')
      .select('*, translations:event_translation(*)')
      .eq('is_archived', false)
      .order('assisted_at', { ascending: false });
    if (data) {
      this.events.set(data as Event[]);
    }
  }

  private async loadSkillsWithLevels(): Promise<void> {
    const { data: skills } = await this.supabase
      .from('skill')
      .select(`
        *,
        translations:skill_translation(*),
        category:skill_category(*, translations:skill_category_translation(*))
      `)
      .eq('is_archived', false);

    if (!skills || skills.length === 0) {
      this.skillCategories.set([]);
      return;
    }

    const { data: usages } = await this.supabase
      .from('skill_usages')
      .select('skill_id, level');

    const levelMap = new Map<number, number>();
    if (usages) {
      for (const usage of usages) {
        if (!levelMap.has(usage.skill_id) && usage.level) {
          levelMap.set(usage.skill_id, usage.level);
        }
      }
    }

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

    for (const category of categoryMap.values()) {
      category.skills.sort((a, b) => b.calculatedLevel - a.calculatedLevel);
    }

    this.skillCategories.set(Array.from(categoryMap.values()));
  }

  // Helper methods
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

  getCategoryName(category: SkillCategoryWithSkills): string {
    const translation = getTranslation(category.translations as any[], this.currentLang());
    return (translation as any)?.name || 'Other';
  }

  getStarArray(level: number): boolean[] {
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

  /** Bulk-load all non-archived images and index by source */
  private async loadAllImages(): Promise<void> {
    const { data } = await this.supabase
      .from('image')
      .select('*')
      .eq('is_archived', false)
      .order('position', { ascending: true });
    if (data) {
      for (const img of data as Image[]) {
        if (img.source_type && img.source_id != null) {
          const key = `${img.source_type}:${img.source_id}`;
          // Keep only the first (lowest position) image per source
          if (!this.imageMap.has(key)) {
            this.imageMap.set(key, img);
          }
          // Store all images per entity
          if (!this.allImagesMap.has(key)) {
            this.allImagesMap.set(key, []);
          }
          this.allImagesMap.get(key)!.push(img);
        }
      }
    }
  }

  /** Bulk-load all skill usages with skill details and index by source */
  private async loadAllSkillUsages(): Promise<void> {
    const { data } = await this.supabase
      .from('skill_usages')
      .select(`
        *,
        skill:skill(
          *,
          translations:skill_translation(*)
        )
      `)
      .eq('is_archived', false)
      .order('position', { ascending: true });
    if (data) {
      for (const usage of data as SkillUsage[]) {
        if (usage.source_type && usage.source_id != null) {
          const key = `${usage.source_type}:${usage.source_id}`;
          if (!this.skillUsageMap.has(key)) {
            this.skillUsageMap.set(key, []);
          }
          this.skillUsageMap.get(key)!.push(usage);
        }
      }
    }
  }

  /** Get the first image URL for an entity */
  getFirstImageUrl(sourceType: SourceType, sourceId: number): string | null {
    return this.imageMap.get(`${sourceType}:${sourceId}`)?.url ?? null;
  }

  /** Get ALL images for an entity */
  getAllImages(sourceType: SourceType, sourceId: number): Image[] {
    return this.allImagesMap.get(`${sourceType}:${sourceId}`) ?? [];
  }

  /** Find a project by ID */
  getProjectById(id: number): Project | undefined {
    return this.projects().find(p => p.id === id);
  }

  /** Find an experience by ID */
  getExperienceById(id: number): Experience | undefined {
    return this.experiences().find(e => e.id === id);
  }

  /** Find a competition by ID */
  getCompetitionById(id: number): Competition | undefined {
    return this.competitions().find(c => c.id === id);
  }

  /** Find an event by ID */
  getEventById(id: number): Event | undefined {
    return this.events().find(e => e.id === id);
  }

  /** Get skill usages for an entity */
  getSkillUsages(sourceType: SourceType, sourceId: number): SkillUsage[] {
    return this.skillUsageMap.get(`${sourceType}:${sourceId}`) ?? [];
  }

  /** Get translated skill name from a SkillUsage */
  getSkillName(usage: SkillUsage): string {
    if (!usage.skill) return '';
    const translation = getTranslation(usage.skill.translations as any[], this.currentLang());
    return (translation as any)?.name || '';
  }
}
