import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { AuthService } from './auth.service';

/**
 * Profile service — handles profile CRUD and profile translations.
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private client = inject(SupabaseClientService);
  private auth = inject(AuthService);

  /**
   * Get the current user's profile with translations
   */
  async getProfile() {
    const userId = this.auth.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.client.client
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
    const userId = this.auth.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.client.client.from('profile').update(data).eq('id', userId).select().single();
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
    const userId = this.auth.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    return this.client.client
      .from('profile')
      .insert({ id: userId, ...data })
      .select()
      .single();
  }

  /**
   * Upsert a profile translation
   */
  async upsertProfileTranslation(data: { language: string; about: string }) {
    const userId = this.auth.user()?.id;
    if (!userId) return { data: null, error: new Error('Not authenticated') };

    const languageId = await this.getLanguageIdByCode(data.language);
    if (!languageId) return { data: null, error: new Error(`Language '${data.language}' not found`) };

    return this.client.client
      .from('profile_translation')
      .upsert(
        { profile_id: userId, language_id: languageId, about: data.about },
        { onConflict: 'profile_id,language_id' }
      )
      .select()
      .single();
  }

  /**
   * Get language ID by code (internal helper)
   */
  private async getLanguageIdByCode(code: string): Promise<number | null> {
    const { data } = await this.client.client
      .from('language')
      .select('id')
      .eq('code', code)
      .single();
    return data?.id ?? null;
  }
}
