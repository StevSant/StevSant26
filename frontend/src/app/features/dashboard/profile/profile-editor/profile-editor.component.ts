import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '@core/services/profile.service';
import { TranslationDataService } from '@core/services/translation-data.service';
import { CrudService } from '@core/services/crud.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { Profile, ProfileTranslation, Language } from '@core/models';
import { CvManagerComponent } from '@shared/components/cv-manager/cv-manager.component';
import { SUCCESS_MESSAGE_DURATION_MS } from '@shared/config/constants';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PersonalInfoCardComponent } from './personal-info-card/personal-info-card.component';
import { SocialLinksCardComponent } from './social-links-card/social-links-card.component';
import { ProfileTranslationsCardComponent } from './profile-translations-card/profile-translations-card.component';
import { LocationAvailabilityCardComponent, LocationAvailabilityData } from './location-availability-card/location-availability-card.component';
import { ProfileImageManager } from './profile-image-manager';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvManagerComponent,
    TranslatePipe,
    PersonalInfoCardComponent,
    SocialLinksCardComponent,
    ProfileTranslationsCardComponent,
    LocationAvailabilityCardComponent,
  ],
  templateUrl: './profile-editor.component.html',
})
export class ProfileEditorComponent implements OnInit {
  private profileService = inject(ProfileService);
  private translationData = inject(TranslationDataService);
  private crud = inject(CrudService);
  private languageService = inject(LanguageService);
  private t = inject(TranslateService);
  private logger = inject(LoggerService);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  profile: Profile | null = null;
  profileExists = false;

  currentEditLanguage = signal<string>('es');

  // Image managers for avatar and banner
  avatarManager = new ProfileImageManager(this.translationData, this.crud, this.t, 'profile', 'Avatar de perfil');
  bannerManager = new ProfileImageManager(this.translationData, this.crud, this.t, 'profile_banner', 'Banner de perfil');

  // Expose signals for template bindings
  get pendingAvatar() { return this.avatarManager.pending; }
  get pendingBanner() { return this.bannerManager.pending; }
  get existingAvatarUrl() { return this.avatarManager.existingUrl; }
  get existingAvatarId() { return this.avatarManager.existingId; }
  get existingBannerUrl() { return this.bannerManager.existingUrl; }
  get existingBannerId() { return this.bannerManager.existingId; }

  formData = this.getEmptyFormData();

  // Computed sub-data objects for child components
  get personalInfoData() {
    return {
      first_name: this.formData.first_name,
      last_name: this.formData.last_name,
      nickname: this.formData.nickname,
    };
  }

  get socialLinksData() {
    return {
      email: this.formData.email,
      phone: this.formData.phone,
      whatsapp: this.formData.whatsapp,
      linkedin_url: this.formData.linkedin_url,
      github_url: this.formData.github_url,
      instagram_url: this.formData.instagram_url,
    };
  }

  get locationAvailabilityData(): LocationAvailabilityData {
    return {
      city: this.formData.city,
      country_code: this.formData.country_code,
      timezone: this.formData.timezone,
      latitude: this.formData.latitude,
      longitude: this.formData.longitude,
      job_title: this.formData.job_title,
      is_available: this.formData.is_available,
    };
  }

  onPersonalInfoChange(data: { first_name: string; last_name: string; nickname: string }): void {
    Object.assign(this.formData, data);
  }

  onSocialLinksChange(data: { email: string; phone: string; whatsapp: string; linkedin_url: string; github_url: string; instagram_url: string }): void {
    Object.assign(this.formData, data);
  }

  onLocationAvailabilityChange(data: LocationAvailabilityData): void {
    Object.assign(this.formData, data);
  }

  translations: Map<string, { about: string }> = new Map();

  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  get currentTranslation(): { about: string } {
    return this.translations.get(this.currentEditLanguage()) || { about: '' };
  }

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.profileService.getProfile();

      if (error && !error.message.includes('PGRST116')) {
        throw error;
      }

      if (data) {
        this.profile = data;
        this.profileExists = true;
        this.formData = this.mapProfileToFormData(data);
        this.loadTranslationsFromProfile(data);
        await this.avatarManager.load();
        await this.bannerManager.load();
      } else {
        this.profileExists = false;
        this.initEmptyTranslations();
      }
    } catch (err) {
      this.error.set(this.t.instant('errors.profileLoadFailed'));
      this.logger.error('Load profile error:', err);
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
      const result = this.profileExists
        ? await this.profileService.updateProfile(this.formData)
        : await this.profileService.createProfile(this.formData);
      if (!this.profileExists) this.profileExists = true;
      if (result.error) throw result.error;

      // Save translations
      for (const [langCode, translation] of this.translations) {
        if (translation.about) {
          const { error: translationError } = await this.profileService.upsertProfileTranslation({
            language: langCode,
            about: translation.about,
          });
          if (translationError) {
            this.logger.error(`Error saving ${langCode} translation:`, translationError);
          }
        }
      }

      await this.avatarManager.savePending();
      await this.bannerManager.savePending();
      await this.loadProfile();
      this.showSuccess(this.t.instant('success.profileUpdated'));
    } catch (err) {
      this.error.set(this.t.instant('errors.profileSaveFailed'));
      this.logger.error('Save profile error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  resetForm(): void {
    this.formData = this.profile
      ? this.mapProfileToFormData(this.profile)
      : this.getEmptyFormData();

    this.translations.clear();
    if (this.profile?.translations) {
      for (const t of this.profile.translations as ProfileTranslation[]) {
        const langCode = t.language?.code;
        if (langCode) {
          this.translations.set(langCode, { about: t.about || '' });
        }
      }
    }
    this.initEmptyTranslations();
    this.error.set(null);
    this.success.set(null);
  }

  async onAvatarUploaded(data: { path: string; url: string }): Promise<void> {
    try {
      const result = await this.avatarManager.onUploaded(data, this.profileExists);
      if (result) this.showSuccess(result.success);
    } catch (err) {
      this.logger.error('Error saving avatar:', err);
      this.error.set(this.t.instant('errors.avatarSaveFailed'));
    }
  }

  async onAvatarRemoved(imageId: number): Promise<void> {
    try {
      const msg = await this.avatarManager.onRemoved(imageId);
      this.showSuccess(msg);
    } catch (err) {
      this.logger.error('Error removing avatar:', err);
      this.error.set(this.t.instant('errors.avatarDeleteFailed'));
    }
  }

  async onBannerUploaded(data: { path: string; url: string }): Promise<void> {
    try {
      const result = await this.bannerManager.onUploaded(data, this.profileExists);
      if (result) this.showSuccess(result.success);
    } catch (err) {
      this.logger.error('Error saving banner:', err);
      this.error.set(this.t.instant('errors.bannerSaveFailed'));
    }
  }

  async onBannerRemoved(imageId: number): Promise<void> {
    try {
      const msg = await this.bannerManager.onRemoved(imageId);
      this.showSuccess(msg);
    } catch (err) {
      this.logger.error('Error removing banner:', err);
      this.error.set(this.t.instant('errors.bannerDeleteFailed'));
    }
  }

  // --- Private helpers ---

  private getEmptyFormData() {
    return {
      first_name: '',
      last_name: '',
      nickname: '',
      email: '',
      phone: '',
      linkedin_url: '',
      github_url: '',
      instagram_url: '',
      whatsapp: '',
      city: '',
      country_code: '',
      timezone: '',
      latitude: null as number | null,
      longitude: null as number | null,
      job_title: '',
      is_available: true,
    };
  }

  private mapProfileToFormData(p: Profile) {
    return {
      first_name: p.first_name || '',
      last_name: p.last_name || '',
      nickname: p.nickname || '',
      email: p.email || '',
      phone: p.phone || '',
      linkedin_url: p.linkedin_url || '',
      github_url: p.github_url || '',
      instagram_url: p.instagram_url || '',
      whatsapp: p.whatsapp || '',
      city: p.city || '',
      country_code: p.country_code || '',
      timezone: p.timezone || '',
      latitude: p.latitude ?? null,
      longitude: p.longitude ?? null,
      job_title: p.job_title || '',
      is_available: p.is_available ?? true,
    };
  }

  private loadTranslationsFromProfile(data: Profile): void {
    this.translations.clear();
    if (data.translations) {
      for (const t of data.translations as ProfileTranslation[]) {
        const langCode = t.language?.code;
        if (langCode) {
          this.translations.set(langCode, { about: t.about || '' });
        }
      }
    }
    this.initEmptyTranslations();
  }

  private initEmptyTranslations(): void {
    for (const lang of this.supportedLanguages) {
      if (!this.translations.has(lang.code)) {
        this.translations.set(lang.code, { about: '' });
      }
    }
  }

  private showSuccess(msg: string): void {
    this.success.set(msg);
    setTimeout(() => this.success.set(null), SUCCESS_MESSAGE_DURATION_MS);
  }
}
