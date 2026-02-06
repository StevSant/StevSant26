import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { Profile, ProfileTranslation, Language } from '@core/models';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent, TranslatePipe],
  templateUrl: './profile-editor.component.html',
})
export class ProfileEditorComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  profile: Profile | null = null;
  profileExists = false;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Pending avatar to save after profile creation
  pendingAvatar = signal<{ path: string; url: string } | null>(null);

  // Pending banner to save after profile creation
  pendingBanner = signal<{ path: string; url: string } | null>(null);

  // Existing avatar URL loaded from database
  existingAvatarUrl = signal<string | null>(null);

  // Existing banner URL loaded from database
  existingBannerUrl = signal<string | null>(null);

  // Base profile fields
  formData = {
    first_name: '',
    last_name: '',
    nickname: '',
    email: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    instagram_url: '',
    whatsapp: '',
    cv_url: '',
  };

  // Translations map by language code
  translations: Map<string, { about: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { about: string } {
    return this.translations.get(this.currentEditLanguage()) || { about: '' };
  }

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getProfile();

      if (error && !error.message.includes('PGRST116')) {
        throw error;
      }

      if (data) {
        this.profile = data;
        this.profileExists = true;
        this.formData = {
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          nickname: data.nickname || '',
          email: data.email || '',
          phone: data.phone || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          instagram_url: data.instagram_url || '',
          whatsapp: data.whatsapp || '',
          cv_url: data.cv_url || '',
        };

        // Load translations into the map
        this.translations.clear();
        if (data.translations) {
          for (const t of data.translations as ProfileTranslation[]) {
            const langCode = t.language?.code;
            if (langCode) {
              this.translations.set(langCode, { about: t.about || '' });
            }
          }
        }

        // Initialize empty translations for languages without data
        for (const lang of this.supportedLanguages) {
          if (!this.translations.has(lang.code)) {
            this.translations.set(lang.code, { about: '' });
          }
        }

        // Load existing avatar
        const { data: avatarImages, error: avatarError } = await this.supabase.getImagesBySourceType('profile');
        console.log('loadProfile avatar query result:', { avatarImages, avatarError });
        if (avatarImages && avatarImages.length > 0) {
          this.existingAvatarUrl.set(avatarImages[0].url);
        }

        // Load existing banner
        const { data: bannerImages } = await this.supabase.getImagesBySourceType('profile_banner');
        if (bannerImages && bannerImages.length > 0) {
          this.existingBannerUrl.set(bannerImages[0].url);
        }
      } else {
        this.profileExists = false;
        // Initialize empty translations
        for (const lang of this.supportedLanguages) {
          this.translations.set(lang.code, { about: '' });
        }
      }
    } catch (err) {
      this.error.set('Error al cargar el perfil');
      console.error('Load profile error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  setEditLanguage(langCode: string): void {
    this.currentEditLanguage.set(langCode);
  }

  updateTranslation(field: 'about', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { about: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      let result;

      // Save base profile fields
      if (this.profileExists) {
        result = await this.supabase.updateProfile(this.formData);
      } else {
        result = await this.supabase.createProfile(this.formData);
        this.profileExists = true;
      }

      if (result.error) {
        throw result.error;
      }

      // Save translations
      for (const [langCode, translation] of this.translations) {
        if (translation.about) {
          const { error: translationError } = await this.supabase.upsertProfileTranslation({
            language: langCode,
            about: translation.about,
          });
          if (translationError) {
            console.error(`Error saving ${langCode} translation:`, translationError);
          }
        }
      }

      // Save pending avatar if any
      await this.savePendingAvatar();

      // Save pending banner if any
      await this.savePendingBanner();

      // Reload profile to get updated data
      await this.loadProfile();
      this.success.set('Perfil actualizado correctamente');

      setTimeout(() => this.success.set(null), 3000);
    } catch (err) {
      this.error.set('Error al guardar el perfil');
      console.error('Save profile error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  resetForm(): void {
    if (this.profile) {
      this.formData = {
        first_name: this.profile.first_name || '',
        last_name: this.profile.last_name || '',
        nickname: this.profile.nickname || '',
        email: this.profile.email || '',
        phone: this.profile.phone || '',
        linkedin_url: this.profile.linkedin_url || '',
        github_url: this.profile.github_url || '',
        instagram_url: this.profile.instagram_url || '',
        whatsapp: this.profile.whatsapp || '',
        cv_url: this.profile.cv_url || '',
      };

      // Reset translations
      this.translations.clear();
      if (this.profile.translations) {
        for (const t of this.profile.translations as ProfileTranslation[]) {
          const langCode = t.language?.code;
          if (langCode) {
            this.translations.set(langCode, { about: t.about || '' });
          }
        }
      }
    } else {
      this.formData = {
        first_name: '',
        last_name: '',
        nickname: '',
        email: '',
        phone: '',
        linkedin_url: '',
        github_url: '',
        instagram_url: '',
        whatsapp: '',
        cv_url: '',
      };
      this.translations.clear();
    }

    // Initialize empty translations for languages without data
    for (const lang of this.supportedLanguages) {
      if (!this.translations.has(lang.code)) {
        this.translations.set(lang.code, { about: '' });
      }
    }

    this.error.set(null);
    this.success.set(null);
  }

  private async savePendingAvatar(): Promise<void> {
    const avatar = this.pendingAvatar();
    console.log('savePendingAvatar called, avatar:', avatar);
    if (!avatar) return;

    try {
      const result = await this.supabase.create('image', {
        url: avatar.url,
        source_type: 'profile',
        alt_text: 'Avatar de perfil',
        position: 0,
      });
      console.log('savePendingAvatar result:', result);

      if (result.error) throw result.error;

      this.existingAvatarUrl.set(avatar.url);
      this.pendingAvatar.set(null);
    } catch (err) {
      console.error('Error saving avatar:', err);
    }
  }

  private async savePendingBanner(): Promise<void> {
    const banner = this.pendingBanner();
    if (!banner) return;

    try {
      const result = await this.supabase.create('image', {
        url: banner.url,
        source_type: 'profile_banner',
        alt_text: 'Banner de perfil',
        position: 0,
      });

      if (result.error) throw result.error;

      this.existingBannerUrl.set(banner.url);
      this.pendingBanner.set(null);
    } catch (err) {
      console.error('Error saving banner:', err);
    }
  }

  async onAvatarUploaded(data: { path: string; url: string }): Promise<void> {
    console.log('Avatar uploaded, profileExists:', this.profileExists, 'data:', data);

    if (this.profileExists) {
      // If profile exists, save the avatar immediately
      try {
        const result = await this.supabase.create('image', {
          url: data.url,
          source_type: 'profile',
          alt_text: 'Avatar de perfil',
          position: 0,
        });
        console.log('Avatar save result:', result);

        if (result.error) throw result.error;

        // Update the existing avatar URL to show the new image
        this.existingAvatarUrl.set(data.url);
        this.success.set('Avatar actualizado correctamente');
        setTimeout(() => this.success.set(null), 3000);
      } catch (err) {
        console.error('Error saving avatar:', err);
        this.error.set('Error al guardar el avatar');
      }
    } else {
      // Queue for saving after profile creation and also update the preview
      console.log('Profile does not exist, queueing avatar');
      this.pendingAvatar.set(data);
      this.existingAvatarUrl.set(data.url);
    }
  }

  async onBannerUploaded(data: { path: string; url: string }): Promise<void> {
    if (this.profileExists) {
      try {
        const result = await this.supabase.create('image', {
          url: data.url,
          source_type: 'profile_banner',
          alt_text: 'Banner de perfil',
          position: 0,
        });

        if (result.error) throw result.error;

        this.existingBannerUrl.set(data.url);
        this.success.set('Banner actualizado correctamente');
        setTimeout(() => this.success.set(null), 3000);
      } catch (err) {
        console.error('Error saving banner:', err);
        this.error.set('Error al guardar el banner');
      }
    } else {
      this.pendingBanner.set(data);
      this.existingBannerUrl.set(data.url);
    }
  }
}
