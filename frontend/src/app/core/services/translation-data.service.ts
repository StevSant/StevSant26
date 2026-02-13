import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { SourceType } from '../models';

/**
 * Translation data service — handles entity translations and polymorphic queries.
 */
@Injectable({ providedIn: 'root' })
export class TranslationDataService {
  private client = inject(SupabaseClientService);

  /**
   * Get language ID by code
   */
  async getLanguageIdByCode(code: string): Promise<number | null> {
    const { data } = await this.client.client
      .from('language')
      .select('id')
      .eq('code', code)
      .single();
    return data?.id ?? null;
  }

  /**
   * Get entity with translations (filtered by is_archived = false)
   */
  async getWithTranslations<T>(
    table: string,
    translationTable: string,
    foreignKey: string,
    orderBy: string = 'position',
    ascending: boolean = true
  ): Promise<{ data: T[] | null; error: Error | null }> {
    const result = await this.client.client
      .from(table)
      .select(`*, translations:${translationTable}(*, language:language(*))`)
      .eq('is_archived', false)
      .order(orderBy, { ascending });
    return { data: result.data as T[] | null, error: result.error };
  }

  /**
   * Get all entities with translations (including archived)
   */
  async getAllWithTranslations<T>(
    table: string,
    translationTable: string,
    orderBy: string = 'position',
    ascending: boolean = true
  ): Promise<{ data: T[] | null; error: Error | null }> {
    const result = await this.client.client
      .from(table)
      .select(`*, translations:${translationTable}(*, language:language(*))`)
      .order(orderBy, { ascending });
    return { data: result.data as T[] | null, error: result.error };
  }

  /**
   * Get a single entity by ID with translations
   */
  async getByIdWithTranslations<T>(
    table: string,
    translationTable: string,
    id: number
  ): Promise<{ data: T | null; error: Error | null }> {
    const result = await this.client.client
      .from(table)
      .select(`*, translations:${translationTable}(*, language:language(*))`)
      .eq('id', id)
      .single();
    return { data: result.data as T | null, error: result.error };
  }

  /**
   * Upsert a translation for an entity
   */
  async upsertTranslation(
    translationTable: string,
    foreignKey: string,
    entityId: number,
    translation: { language: string; [key: string]: string | null }
  ) {
    const { language, ...rest } = translation;
    const languageId = await this.getLanguageIdByCode(language);
    if (!languageId) {
      return { data: null, error: new Error(`Language '${language}' not found`) };
    }

    return this.client.client
      .from(translationTable)
      .upsert(
        { [foreignKey]: entityId, language_id: languageId, ...rest },
        { onConflict: `${foreignKey},language_id` }
      )
      .select()
      .single();
  }

  /**
   * Create entity with translations in a single operation
   */
  async createWithTranslations<T>(
    table: string,
    translationTable: string,
    foreignKey: string,
    entityData: Record<string, unknown>,
    translations: { language: string; [key: string]: string | null }[]
  ) {
    const { data: entity, error: entityError } = await this.client.client
      .from(table)
      .insert(entityData)
      .select()
      .single();

    if (entityError || !entity) {
      return { data: null, error: entityError };
    }

    const translationsWithFk = [];
    for (const t of translations) {
      const { language, ...rest } = t;
      const languageId = await this.getLanguageIdByCode(language);
      if (!languageId) {
        await this.client.client.from(table).delete().eq('id', (entity as { id: number }).id);
        return { data: null, error: new Error(`Language '${language}' not found`) };
      }
      translationsWithFk.push({
        ...rest,
        language_id: languageId,
        [foreignKey]: (entity as { id: number }).id,
      });
    }

    const { error: translationError } = await this.client.client
      .from(translationTable)
      .insert(translationsWithFk);

    if (translationError) {
      await this.client.client.from(table).delete().eq('id', (entity as { id: number }).id);
      return { data: null, error: translationError };
    }

    return this.getByIdWithTranslations(table, translationTable, (entity as { id: number }).id);
  }

  /**
   * Update entity with translations
   */
  async updateWithTranslations<T>(
    table: string,
    translationTable: string,
    foreignKey: string,
    entityId: number,
    entityData: Record<string, unknown>,
    translations: { language: string; [key: string]: string | null }[]
  ) {
    const { error: entityError } = await this.client.client
      .from(table)
      .update(entityData)
      .eq('id', entityId);

    if (entityError) {
      return { data: null, error: entityError };
    }

    for (const translation of translations) {
      const { language, ...rest } = translation;
      const languageId = await this.getLanguageIdByCode(language);
      if (!languageId) {
        return { data: null, error: new Error(`Language '${language}' not found`) };
      }

      const { error: translationError } = await this.client.client
        .from(translationTable)
        .upsert(
          { [foreignKey]: entityId, language_id: languageId, ...rest },
          { onConflict: `${foreignKey},language_id` }
        );

      if (translationError) {
        return { data: null, error: translationError };
      }
    }

    return this.getByIdWithTranslations(table, translationTable, entityId);
  }

  // ==================== POLYMORPHIC QUERIES ====================

  /**
   * Get images for a specific source (project, experience, competition, event)
   */
  async getImagesFor(sourceType: SourceType, sourceId: number) {
    return this.client.client
      .from('image')
      .select('*')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId)
      .eq('is_archived', false)
      .order('position', { ascending: true });
  }

  /**
   * Get skill usages for a specific source with skill details
   */
  async getSkillUsagesFor(sourceType: SourceType, sourceId: number) {
    return this.client.client
      .from('skill_usages')
      .select('*, skill(*)')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId)
      .eq('is_archived', false)
      .order('position', { ascending: true });
  }

  /**
   * Get projects for a specific source
   */
  async getProjectsFor(sourceType: SourceType, sourceId: number) {
    return this.client.client
      .from('project')
      .select('*')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId)
      .eq('is_archived', false)
      .order('position', { ascending: true });
  }

  /**
   * Get skills with their categories and translations
   */
  async getSkillsWithCategories<T>(): Promise<{ data: T[] | null; error: Error | null }> {
    const result = await this.client.client
      .from('skill')
      .select(`
        *,
        translations:skill_translation(*, language:language(*)),
        skill_category(
          *,
          translations:skill_category_translation(*, language:language(*))
        )
      `)
      .order('position', { ascending: true });
    return { data: result.data as T[] | null, error: result.error };
  }

  /**
   * Get child projects of a parent project
   */
  async getChildProjects(parentProjectId: number) {
    return this.client.client
      .from('project')
      .select('*')
      .eq('parent_project_id', parentProjectId)
      .eq('is_archived', false)
      .order('position', { ascending: true });
  }

  /**
   * Get all skill usages with related skill and translations
   */
  async getSkillUsagesWithSkills<T>(): Promise<{ data: T[] | null; error: Error | null }> {
    const result = await this.client.client
      .from('skill_usages')
      .select(`
        *,
        skill:skill(
          *,
          translations:skill_translation(*, language:language(*))
        ),
        translations:skill_usages_translation(*, language:language(*))
      `)
      .order('position', { ascending: true });
    return { data: result.data as T[] | null, error: result.error };
  }

  /**
   * Get images by source type and source id
   */
  async getImagesBySource(sourceType: string, sourceId: number) {
    return this.client.client
      .from('image')
      .select('*')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId)
      .eq('is_archived', false)
      .order('position', { ascending: true });
  }

  /**
   * Get images by source type only (for profile which doesn't have source_id)
   */
  async getImagesBySourceType(sourceType: string) {
    return this.client.client
      .from('image')
      .select('*')
      .eq('source_type', sourceType)
      .eq('is_archived', false)
      .order('position', { ascending: true })
      .limit(1);
  }

  /**
   * Get documents by source type and source id
   */
  async getDocumentsBySource(sourceType: string, sourceId: number) {
    return this.client.client
      .from('document')
      .select('*, translations:document_translation(*, language:language(*))')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId)
      .eq('is_archived', false)
      .order('position', { ascending: true });
  }
}
