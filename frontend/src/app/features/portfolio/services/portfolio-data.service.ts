import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LanguageService } from '@core/services/language.service';
import {
  Profile,
  Project,
  Experience,
  Education,
  Competition,
  Event,
  Skill,
  SkillCategory,
  SkillCategoryTranslation,
  SkillUsage,
  Image,
  Document,
  ContentSection,
  SourceType,
  getTranslation,
} from '@core/models';
import { CrudService, TranslationDataService } from '@core/services';

export interface SkillWithLevel extends Skill {
  calculatedLevel: number;
  categoryName?: string;
}

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: SkillWithLevel[];
}

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private crudService = inject(CrudService);
  private translationDataService = inject(TranslationDataService);
  private languageService = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);

  private initialized = false;

  loading = signal(true);
  profile = signal<Profile | null>(null);
  avatarUrl = signal<string | null>(null);
  bannerUrl = signal<string | null>(null);
  /** Only parent/standalone projects (parent_project_id === null) */
  projects = signal<Project[]>([]);
  /** All projects including sub-projects */
  private allProjects = signal<Project[]>([]);
  experiences = signal<Experience[]>([]);
  educations = signal<Education[]>([]);
  competitions = signal<Competition[]>([]);
  events = signal<Event[]>([]);
  skillCategories = signal<SkillCategoryWithSkills[]>([]);
  cvDocuments = signal<Document[]>([]);

  /** Map: "sourceType:sourceId" → first image */
  private imageMap = new Map<string, Image>();
  /** Map: "sourceType:sourceId" → ALL images for that entity */
  private allImagesMap = new Map<string, Image[]>();
  /** Map: "sourceType:sourceId" → skill usages with skill data */
  private skillUsageMap = new Map<string, SkillUsage[]>();
  /** Map: "sourceType:sourceId" → content sections */
  private contentSectionMap = new Map<string, ContentSection[]>();
  /** Map: "sourceType:sourceId" → documents */
  private documentMap = new Map<string, Document[]>();

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
      this.loadEducations(),
      this.loadCompetitions(),
      this.loadEvents(),
      this.loadSkillsWithLevels(),
      this.loadAllImages(),
      this.loadAllSkillUsages(),
      this.loadAllContentSections(),
      this.loadAllDocuments(),
    ]);
    this.loading.set(false);
    this.initialized = true;
  }

  private async loadProfile(): Promise<void> {
    const { data } = await this.crudService
      .from('profile')
      .select('*, translations:profile_translation(*, language:language(*))')
      .limit(1);
    if (data && data.length > 0) {
      this.profile.set(data[0] as Profile);
    }

    const { data: avatarImages } = await this.translationDataService.getImagesBySourceType('profile');
    if (avatarImages && avatarImages.length > 0) {
      this.avatarUrl.set(avatarImages[0].url);
    }

    const { data: bannerImages } = await this.translationDataService.getImagesBySourceType('profile_banner');
    if (bannerImages && bannerImages.length > 0) {
      this.bannerUrl.set(bannerImages[0].url);
    }

    const { data: cvData } = await this.crudService
      .from('document')
      .select('*, language:language(*)')
      .eq('source_type', 'profile')
      .eq('is_archived', false)
      .order('position', { ascending: true });
    if (cvData) {
      this.cvDocuments.set(cvData as Document[]);
    }
  }

  private async loadProjects(): Promise<void> {
    const { data } = await this.crudService
      .from('project')
      .select('*, translations:project_translation(*, language:language(*))')
      .eq('is_archived', false)
      .order('is_pinned', { ascending: false })
      .order('position', { ascending: true });
    if (data) {
      const all = data as Project[];
      this.allProjects.set(all);
      this.projects.set(all.filter(p => p.parent_project_id == null));
    }
  }

  private async loadExperiences(): Promise<void> {
    const { data } = await this.crudService
      .from('experience')
      .select('*, translations:experience_translation(*, language:language(*))')
      .eq('is_archived', false)
      .order('start_date', { ascending: false });
    if (data) {
      this.experiences.set(data as Experience[]);
    }
  }

  private async loadEducations(): Promise<void> {
    const { data } = await this.crudService
      .from('education')
      .select('*, translations:education_translation(*, language:language(*))')
      .eq('is_archived', false)
      .order('start_date', { ascending: false });
    if (data) {
      this.educations.set(data as Education[]);
    }
  }

  private async loadCompetitions(): Promise<void> {
    const { data } = await this.crudService
      .from('competitions')
      .select('*, translations:competitions_translation(*, language:language(*))')
      .eq('is_archived', false)
      .order('date', { ascending: false });
    if (data) {
      this.competitions.set(data as Competition[]);
    }
  }

  private async loadEvents(): Promise<void> {
    const { data } = await this.crudService
      .from('event')
      .select('*, translations:event_translation(*, language:language(*))')
      .eq('is_archived', false)
      .order('assisted_at', { ascending: false });
    if (data) {
      this.events.set(data as Event[]);
    }
  }

  private async loadSkillsWithLevels(): Promise<void> {
    const { data: skills } = await this.crudService
      .from('skill')
      .select(`
        *,
        translations:skill_translation(*, language:language(*)),
        category:skill_category(*, translations:skill_category_translation(*, language:language(*)))
      `)
      .eq('is_archived', false)
      .order('position', { ascending: true });

    if (!skills || skills.length === 0) {
      this.skillCategories.set([]);
      return;
    }

    const { data: usages } = await this.crudService
      .from('skill_usages')
      .select('skill_id, level');

    const levelMap = new Map<number, number>();
    if (usages) {
      for (const usage of usages) {
        if (usage.level) {
          const current = levelMap.get(usage.skill_id) ?? 0;
          levelMap.set(usage.skill_id, Math.max(current, usage.level));
        }
      }
    }

    const categoryMap = new Map<number | null, SkillCategoryWithSkills>();

    for (const skill of skills as any[]) {
      const categoryId = skill.skill_category_id || null;
      const usageLevel = levelMap.get(skill.id) ?? 0;
      const predefinedLevel = skill.predefined_level ?? 0;
      const calculatedLevel = Math.max(usageLevel, predefinedLevel);
      const hasUsages = usageLevel > 0;
      const isLanguage = skill.category?.code === 'languages';

      // Hide skills that have no usage in any project and no predefined level
      if (calculatedLevel === 0 && !isLanguage) continue;
      if (!hasUsages && !predefinedLevel && !isLanguage) continue;

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

    // Remove empty categories (all skills were filtered out)
    for (const [key, category] of categoryMap.entries()) {
      if (category.skills.length === 0) categoryMap.delete(key);
    }

    // Sort categories by position to maintain consistent display order
    const sortedCategories = Array.from(categoryMap.values())
      .sort((a, b) => (a.position ?? 999) - (b.position ?? 999));

    this.skillCategories.set(sortedCategories);
  }

  // Helper methods
  getEntityTranslation(entity: any, field: string): string {
    const translation = getTranslation(entity.translations, this.currentLang());
    return (translation as any)?.[field] || '';
  }

  /**
   * Get entity translation formatted as HTML (preserving line breaks)
   */
  getEntityTranslationHtml(entity: any, field: string): string {
    const text = this.getEntityTranslation(entity, field);
    return this.formatTextToHtml(text);
  }

  getProfileBio(): string {
    const p = this.profile();
    if (!p) return '';
    const translation = getTranslation(p.translations, this.currentLang());
    const about = translation?.about || '';
    // Convert double newlines to paragraph breaks and single newlines to <br>
    return this.formatTextToHtml(about);
  }

  /**
   * Converts plain text with newlines to HTML with proper paragraph/line break formatting
   */
  private formatTextToHtml(text: string): string {
    if (!text) return '';

    // Split by double newlines (paragraphs)
    const paragraphs = text.split(/\n\n+/);

    if (paragraphs.length > 1) {
      // Multiple paragraphs: wrap each in <p> tags with margin
      return paragraphs
        .map(
          (p, i) =>
            `<p style="margin-bottom: ${i < paragraphs.length - 1 ? '1.5rem' : '0'}">${p.replace(/\n/g, '<br>')}</p>`
        )
        .join('');
    } else {
      // Single paragraph: just convert newlines to <br>
      return text.replace(/\n/g, '<br>');
    }
  }

  getCategoryName(category: SkillCategoryWithSkills): string {
    const translation = getTranslation(category.translations as any[], this.currentLang());
    return (translation as any)?.name || 'Other';
  }

  getCategoryApproach(category: SkillCategoryWithSkills): string {
    const translation = getTranslation(category.translations as any[], this.currentLang());
    return (translation as any)?.approach || '';
  }

  getSkillDescription(skill: SkillWithLevel): string {
    const translation = getTranslation(skill.translations as any[], this.currentLang());
    return (translation as any)?.description || '';
  }

  getStarArray(level: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < level);
  }

  formatDateRange(startDate: string | null, endDate: string | null): string {
    if (!startDate) return '';
    const locale = this.currentLang() === 'es' ? 'es-ES' : 'en-US';
    const start = new Date(startDate).toLocaleDateString(locale, { month: 'short', year: 'numeric' });
    if (!endDate) {
      const present = this.currentLang() === 'es' ? 'Presente' : 'Present';
      return `${start} - ${present}`;
    }
    return `${start} - ${new Date(endDate).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}`;
  }

  /** Bulk-load all non-archived images and index by source */
  private async loadAllImages(): Promise<void> {
    const { data } = await this.crudService
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
    const { data } = await this.crudService
      .from('skill_usages')
      .select(`
        *,
        skill:skill(
          *,
          translations:skill_translation(*, language:language(*))
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

  /** Bulk-load all non-archived content sections and index by entity */
  private async loadAllContentSections(): Promise<void> {
    const { data } = await this.crudService
      .from('content_section')
      .select('*, translations:content_section_translation(*, language:language(*))')
      .eq('is_archived', false)
      .order('position', { ascending: true });
    if (data) {
      for (const section of data as ContentSection[]) {
        if (section.entity_type && section.entity_id != null) {
          const key = `${section.entity_type}:${section.entity_id}`;
          if (!this.contentSectionMap.has(key)) {
            this.contentSectionMap.set(key, []);
          }
          this.contentSectionMap.get(key)!.push(section);
        }
      }
    }
  }

  /** Bulk-load all non-archived documents and index by source */
  private async loadAllDocuments(): Promise<void> {
    const { data } = await this.crudService
      .from('document')
      .select('*, language:language(*), translations:document_translation(*, language:language(*))')
      .eq('is_archived', false)
      .order('position', { ascending: true });
    if (data) {
      for (const doc of data as Document[]) {
        if (doc.source_type && doc.source_id != null) {
          const key = `${doc.source_type}:${doc.source_id}`;
          if (!this.documentMap.has(key)) {
            this.documentMap.set(key, []);
          }
          this.documentMap.get(key)!.push(doc);
        }
      }
    }
  }

  /** Get ALL images for an entity */
  getAllImages(sourceType: SourceType, sourceId: number): Image[] {
    return this.allImagesMap.get(`${sourceType}:${sourceId}`) ?? [];
  }

  /** Find a project by ID (searches all projects including sub-projects) */
  getProjectById(id: number): Project | undefined {
    return this.allProjects().find(p => p.id === id);
  }

  /** Get sub-projects for a parent project */
  getSubProjects(parentId: number): Project[] {
    return this.allProjects().filter(p => p.parent_project_id === parentId);
  }

  /** Get projects linked to a source entity (e.g., competition, event, experience) */
  getProjectsBySource(sourceType: SourceType, sourceId: number): Project[] {
    // Handle DB inconsistency: competitions table uses plural 'competitions' as source_type
    const possibleTypes: string[] = [sourceType];
    if (sourceType === 'competition') possibleTypes.push('competitions');

    return this.allProjects().filter(
      p => possibleTypes.includes(p.source_type as string) && p.source_id === sourceId && !p.is_archived
    );
  }

  /** Find an experience by ID */
  getExperienceById(id: number): Experience | undefined {
    return this.experiences().find(e => e.id === id);
  }

  /** Find an education by ID */
  getEducationById(id: number): Education | undefined {
    return this.educations().find(e => e.id === id);
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

  /** Get content sections for an entity */
  getContentSections(sourceType: SourceType, sourceId: number): ContentSection[] {
    return this.contentSectionMap.get(`${sourceType}:${sourceId}`) ?? [];
  }

  /** Get documents for an entity */
  getDocuments(sourceType: SourceType, sourceId: number): Document[] {
    return this.documentMap.get(`${sourceType}:${sourceId}`) ?? [];
  }

  /** Get translated label for a document (falls back to doc.label or file_name) */
  getDocumentLabel(doc: Document): string {
    const translation = getTranslation(doc.translations ?? [], this.currentLang());
    return translation?.label || doc.label || doc.file_name || '';
  }

  /** Get translated description for a document */
  getDocumentDescription(doc: Document): string {
    const translation = getTranslation(doc.translations ?? [], this.currentLang());
    return translation?.description || '';
  }

  /** Get translated content section title */
  getSectionTitle(section: ContentSection): string {
    const translation = getTranslation(section.translations as any[], this.currentLang());
    return (translation as any)?.title || '';
  }

  /** Get translated content section body */
  getSectionBody(section: ContentSection): string {
    const translation = getTranslation(section.translations as any[], this.currentLang());
    return (translation as any)?.body || '';
  }

  /** Get translated skill name from a SkillUsage */
  getSkillName(usage: SkillUsage): string {
    if (!usage.skill) return '';
    const translation = getTranslation(usage.skill.translations as any[], this.currentLang());
    return (translation as any)?.name || '';
  }

  /** Get the icon_url from a SkillUsage's skill */
  getSkillIconUrl(usage: SkillUsage): string | null {
    return usage.skill?.icon_url ?? null;
  }

  /** Get the icon_url for a SkillWithLevel */
  getSkillIcon(skill: SkillWithLevel): string | null {
    return skill.icon_url ?? null;
  }

  /** Get all unique skill names across all usages (for filter pills) */
  getAllSkillNames(): string[] {
    const names = new Set<string>();
    for (const usages of this.skillUsageMap.values()) {
      for (const usage of usages) {
        const name = this.getSkillName(usage);
        if (name) names.add(name);
      }
    }
    return Array.from(names).sort();
  }

  /** Get skill names grouped by category (only skills that are actually used) */
  getGroupedSkillNames(): { category: string; names: string[] }[] {
    const usedNames = new Set(this.getAllSkillNames());
    const groups: { category: string; names: string[] }[] = [];

    for (const cat of this.skillCategories()) {
      const categoryName = this.getCategoryName(cat);
      const names: string[] = [];
      for (const skill of cat.skills) {
        const translation = getTranslation(skill.translations as any[], this.currentLang());
        const skillName = (translation as any)?.name;
        if (skillName && usedNames.has(skillName)) {
          names.push(skillName);
          usedNames.delete(skillName);
        }
      }
      if (names.length > 0) {
        groups.push({ category: categoryName, names: names.sort() });
      }
    }

    if (usedNames.size > 0) {
      groups.push({ category: 'Other', names: Array.from(usedNames).sort() });
    }

    return groups;
  }

  /** Get all unique skill names used by a specific source type */
  getAllSkillNamesBySourceType(sourceType: SourceType): string[] {
    const names = new Set<string>();
    for (const [key, usages] of this.skillUsageMap.entries()) {
      if (key.startsWith(`${sourceType}:`)) {
        for (const usage of usages) {
          const name = this.getSkillName(usage);
          if (name) names.add(name);
        }
      }
    }
    return Array.from(names).sort();
  }

  /** Get skill names grouped by category, filtered to only a specific source type */
  getGroupedSkillNamesBySourceType(sourceType: SourceType): { category: string; names: string[] }[] {
    const usedNames = new Set(this.getAllSkillNamesBySourceType(sourceType));
    if (usedNames.size === 0) return [];

    const groups: { category: string; names: string[] }[] = [];

    for (const cat of this.skillCategories()) {
      const categoryName = this.getCategoryName(cat);
      const names: string[] = [];
      for (const skill of cat.skills) {
        const translation = getTranslation(skill.translations as any[], this.currentLang());
        const skillName = (translation as any)?.name;
        if (skillName && usedNames.has(skillName)) {
          names.push(skillName);
          usedNames.delete(skillName);
        }
      }
      if (names.length > 0) {
        groups.push({ category: categoryName, names: names.sort() });
      }
    }

    if (usedNames.size > 0) {
      groups.push({ category: 'Other', names: Array.from(usedNames).sort() });
    }

    return groups;
  }

  /** Get all unique companies from experiences */
  getAllCompanies(): string[] {
    const companies = new Set<string>();
    for (const exp of this.experiences()) {
      if (exp.company) companies.add(exp.company);
    }
    return Array.from(companies).sort();
  }
}
