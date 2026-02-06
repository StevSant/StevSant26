import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { SourceType } from '../models';

/**
 * Supabase service for authentication, database CRUD operations, and storage
 * Following Clean Architecture principles as an infrastructure adapter
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase!: SupabaseClient;
  private platformId = inject(PLATFORM_ID);

  // Auth state signals
  session = signal<Session | null>(null);
  user = signal<User | null>(null);
  loading = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
      this.initializeAuth();
    } else {
      // Server-side: immediately mark as not loading since auth won't initialize
      this.loading.set(false);
    }
  }

  private async initializeAuth(): Promise<void> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      this.session.set(session);
      this.user.set(session?.user ?? null);

      this.supabase.auth.onAuthStateChange((_event, session) => {
        this.session.set(session);
        this.user.set(session?.user ?? null);
      });
    } finally {
      this.loading.set(false);
    }
  }

  // ==================== AUTHENTICATION ====================

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (!error) {
      this.session.set(null);
      this.user.set(null);
    }
    return { error };
  }

  /**
   * Get current session
   */
  async getSession() {
    return this.supabase.auth.getSession();
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Access to Supabase client's from() method for custom queries
   * Use this for complex queries not covered by generic CRUD methods
   */
  from(table: string) {
    return this.supabase.from(table);
  }

  // ==================== GENERIC CRUD OPERATIONS ====================

  /**
   * Get all records from a table
   */
  async getAll<T>(table: string, orderBy: string = 'position', ascending: boolean = true) {
    return this.supabase.from(table).select('*').order(orderBy, { ascending });
  }

  /**
   * Get all non-archived records from a table
   */
  async getActive<T>(table: string, orderBy: string = 'position', ascending: boolean = true) {
    return this.supabase
      .from(table)
      .select('*')
      .eq('is_archived', false)
      .order(orderBy, { ascending });
  }

  /**
   * Get a single record by ID
   */
  async getById<T>(table: string, id: number | string) {
    return this.supabase.from(table).select('*').eq('id', id).single();
  }

  /**
   * Create a new record
   */
  async create<T>(table: string, data: Partial<T>) {
    return this.supabase.from(table).insert(data).select().single();
  }

  /**
   * Update a record by ID
   */
  async update<T>(table: string, id: number | string, data: Partial<T>) {
    return this.supabase.from(table).update(data).eq('id', id).select().single();
  }

  /**
   * Delete a record by ID (hard delete)
   */
  async delete(table: string, id: number | string) {
    return this.supabase.from(table).delete().eq('id', id);
  }

  /**
   * Archive a record (soft delete)
   */
  async archive(table: string, id: number | string) {
    return this.update(table, id, { is_archived: true });
  }

  /**
   * Unarchive a record
   */
  async unarchive(table: string, id: number | string) {
    return this.update(table, id, { is_archived: false });
  }

  /**
   * Toggle pin status
   */
  async togglePin(table: string, id: number | string, isPinned: boolean) {
    return this.update(table, id, { is_pinned: isPinned });
  }

  /**
   * Update positions for multiple records (batch update for reordering)
   */
  async updatePositions(table: string, updates: { id: number; position: number }[]) {
    const promises = updates.map(({ id, position }) =>
      this.supabase.from(table).update({ position }).eq('id', id)
    );
    return Promise.all(promises);
  }

  // ==================== PROFILE OPERATIONS ====================

  /**
   * Get the current user's profile with translations
   */
  async getProfile() {
    const userId = this.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.supabase
      .from('profile')
      .select('*, translations:profile_translation(*, language:language(*))')
      .eq('id', userId)
      .single();
  }

  /**
   * Update the current user's profile (base fields only)
   */
  async updateProfile(data: {
    first_name?: string;
    last_name?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    github_url?: string;
    instagram_url?: string;
    whatsapp?: string;
  }) {
    const userId = this.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.supabase.from('profile').update(data).eq('id', userId).select().single();
  }

  /**
   * Create profile for current user (called after first sign-in)
   */
  async createProfile(data: {
    first_name?: string;
    last_name?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    github_url?: string;
    instagram_url?: string;
    whatsapp?: string;
  }) {
    const userId = this.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.supabase
      .from('profile')
      .insert({ id: userId, ...data })
      .select()
      .single();
  }

  /**
   * Get language ID by code
   */
  async getLanguageIdByCode(code: string): Promise<number | null> {
    const { data } = await this.supabase
      .from('language')
      .select('id')
      .eq('code', code)
      .single();
    return data?.id ?? null;
  }

  /**
   * Upsert a profile translation
   */
  async upsertProfileTranslation(data: { language: string; about: string }) {
    const userId = this.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };

    const languageId = await this.getLanguageIdByCode(data.language);
    if (!languageId) return { data: null, error: new Error(`Language '${data.language}' not found`) };

    return this.supabase
      .from('profile_translation')
      .upsert(
        { profile_id: userId, language_id: languageId, about: data.about },
        { onConflict: 'profile_id,language_id' }
      )
      .select()
      .single();
  }

  // ==================== TRANSLATION HELPERS ====================

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
    const result = await this.supabase
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
    const result = await this.supabase
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
    const result = await this.supabase
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

    return this.supabase
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
    // First, create the entity
    const { data: entity, error: entityError } = await this.supabase
      .from(table)
      .insert(entityData)
      .select()
      .single();

    if (entityError || !entity) {
      return { data: null, error: entityError };
    }

    // Then, create translations with language_id
    const translationsWithFk = [];
    for (const t of translations) {
      const { language, ...rest } = t;
      const languageId = await this.getLanguageIdByCode(language);
      if (!languageId) {
        // Rollback: delete the entity
        await this.supabase.from(table).delete().eq('id', (entity as { id: number }).id);
        return { data: null, error: new Error(`Language '${language}' not found`) };
      }
      translationsWithFk.push({
        ...rest,
        language_id: languageId,
        [foreignKey]: (entity as { id: number }).id,
      });
    }

    const { error: translationError } = await this.supabase
      .from(translationTable)
      .insert(translationsWithFk);

    if (translationError) {
      // Rollback: delete the entity
      await this.supabase.from(table).delete().eq('id', (entity as { id: number }).id);
      return { data: null, error: translationError };
    }

    // Fetch complete entity with translations
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
    // Update the entity
    const { error: entityError } = await this.supabase
      .from(table)
      .update(entityData)
      .eq('id', entityId);

    if (entityError) {
      return { data: null, error: entityError };
    }

    // Upsert translations with language_id
    for (const translation of translations) {
      const { language, ...rest } = translation;
      const languageId = await this.getLanguageIdByCode(language);
      if (!languageId) {
        return { data: null, error: new Error(`Language '${language}' not found`) };
      }

      const { error: translationError } = await this.supabase
        .from(translationTable)
        .upsert(
          { [foreignKey]: entityId, language_id: languageId, ...rest },
          { onConflict: `${foreignKey},language_id` }
        );

      if (translationError) {
        return { data: null, error: translationError };
      }
    }

    // Fetch complete entity with translations
    return this.getByIdWithTranslations(table, translationTable, entityId);
  }

  // ==================== POLYMORPHIC QUERIES ====================

  /**
   * Get images for a specific source (project, experience, competition, event)
   */
  async getImagesFor(sourceType: SourceType, sourceId: number) {
    return this.supabase
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
    return this.supabase
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
    return this.supabase
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
    const result = await this.supabase
      .from('skill')
      .select(`
        *,
        translations:skill_translation(*),
        skill_category(
          *,
          translations:skill_category_translation(*)
        )
      `)
      .order('position', { ascending: true });
    return { data: result.data as T[] | null, error: result.error };
  }

  /**
   * Get child projects of a parent project
   */
  async getChildProjects(parentProjectId: number) {
    return this.supabase
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
    const result = await this.supabase
      .from('skill_usages')
      .select(`
        *,
        skill:skill(
          *,
          translations:skill_translation(*)
        ),
        translations:skill_usages_translation(*)
      `)
      .order('position', { ascending: true });
    return { data: result.data as T[] | null, error: result.error };
  }

  // ==================== STORAGE OPERATIONS ====================

  /**
   * Get images by source type and source id
   */
  async getImagesBySource(sourceType: string, sourceId: number) {
    return this.supabase
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
    return this.supabase
      .from('image')
      .select('*')
      .eq('source_type', sourceType)
      .eq('is_archived', false)
      .order('position', { ascending: true })
      .limit(1);
  }

  /**
   * Upload a file to Supabase Storage
   * @param file The file to upload
   * @param folder The folder path (e.g., 'projects', 'events', 'experiences', 'competitions', 'profile', 'cv')
   * @returns The file path in storage
   */
  async uploadFile(file: File, folder: string = ''): Promise<{ path: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await this.supabase.storage
        .from(environment.storageBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
      return { path: data.path, error: null };
    } catch (error) {
      return { path: null, error: error as Error };
    }
  }

  /**
   * Get the public URL for a file in storage
   */
  getPublicUrl(path: string): string {
    const { data } = this.supabase.storage.from(environment.storageBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Delete a file from storage
   */
  async deleteFromStorage(path: string) {
    return this.supabase.storage.from(environment.storageBucket).remove([path]);
  }

  /**
   * Download a file from storage
   */
  async downloadImage(path: string): Promise<string | null> {
    const { data, error } = await this.supabase.storage.from(environment.storageBucket).download(path);
    if (error || !data) return null;
    return URL.createObjectURL(data);
  }

  /**
   * List files in a folder
   */
  async listFiles(folder: string) {
    return this.supabase.storage.from(environment.storageBucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });
  }
}
