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
   * Get the current user's profile
   */
  async getProfile() {
    const userId = this.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.supabase.from('profile').select('*').eq('id', userId).single();
  }

  /**
   * Update the current user's profile
   */
  async updateProfile(data: {
    first_name?: string;
    last_name?: string;
    nickname?: string;
    about?: string;
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
    about?: string;
  }) {
    const userId = this.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.supabase
      .from('profile')
      .insert({ id: userId, ...data })
      .select()
      .single();
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
   * Get skills with their categories
   */
  async getSkillsWithCategories() {
    return this.supabase
      .from('skill')
      .select('*, skill_category(*)')
      .eq('is_archived', false)
      .order('position', { ascending: true });
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

  // ==================== STORAGE OPERATIONS ====================

  /**
   * Upload an image to Supabase Storage
   * @param file The file to upload
   * @param folder The folder path (e.g., 'projects', 'events', 'experiences', 'competitions', 'profile')
   * @returns The file path in storage
   */
  async uploadImage(file: File, folder: string = ''): Promise<{ path: string | null; error: Error | null }> {
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
