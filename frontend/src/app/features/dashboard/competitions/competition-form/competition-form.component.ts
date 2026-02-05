import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Competition, CompetitionTranslation, Language } from '@core/models';
import { ImageUploadComponent, ExistingImage } from '@shared/components/image-upload/image-upload.component';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';

@Component({
  selector: 'app-competition-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UpperCasePipe, TranslatePipe, ImageUploadComponent, LanguageTabsComponent, SkillUsageManagerComponent],
  templateUrl: './competition-form.component.html',
})
export class CompetitionFormComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('skillUsageManager') skillUsageManager!: SkillUsageManagerComponent;

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  isNew = true;
  currentId: number | null = null;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Pending images to save after entity creation
  pendingImages = signal<{ path: string; url: string }[]>([]);

  // Existing images loaded from database
  existingImages = signal<ExistingImage[]>([]);

  // Base fields (non-translatable)
  formData = {
    organizer: '',
    date: '',
  };

  // Translations map by language code
  translations: Map<string, { name: string; description: string; result: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { name: string; description: string; result: string } {
    return this.translations.get(this.currentEditLanguage()) || { name: '', description: '', result: '' };
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.currentId = parseInt(id, 10);
    }
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      // Initialize empty translations for all languages
      for (const lang of this.supportedLanguages) {
        this.translations.set(lang.code, { name: '', description: '', result: '' });
      }

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<Competition>(
          'competitions',
          'competitions_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            organizer: data.organizer || '',
            date: data.date?.split('T')[0] || '',
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as CompetitionTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  name: t.name || '',
                  description: t.description || '',
                  result: t.result || '',
                });
              }
            }
          }

          // Load existing images
          const { data: images } = await this.supabase.getImagesBySource('competition', this.currentId!);
          if (images) {
            this.existingImages.set(images as ExistingImage[]);
          }
        }
      }
    } catch (err) {
      this.error.set('Error al cargar los datos');
      console.error('Load error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  setEditLanguage(langCode: string): void {
    this.currentEditLanguage.set(langCode);
  }

  updateTranslation(field: 'name' | 'description' | 'result', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { name: '', description: '', result: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    // Validate that at least one language has a name
    const hasName = Array.from(this.translations.values()).some((t) => t.name.trim());
    if (!hasName) {
      this.error.set('El nombre es requerido en al menos un idioma');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const entityPayload = {
        organizer: this.formData.organizer || null,
        date: this.formData.date || null,
      };

      // Prepare translations array
      const translationsArray = Array.from(this.translations.entries())
        .filter(([_, t]) => t.name.trim()) // Only include translations with a name
        .map(([lang, t]) => ({
          language: lang,
          name: t.name,
          description: t.description || null,
          result: t.result || null,
        }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          'competitions',
          'competitions_translation',
          'competitions_id',
          entityPayload,
          translationsArray
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          'competitions',
          'competitions_translation',
          'competitions_id',
          this.currentId!,
          entityPayload,
          translationsArray
        );
      }

      if (result.error) throw result.error;

      // Save pending images and skill usages after entity creation
      const entityId = this.isNew ? (result.data as { id: number })?.id : this.currentId!;
      if (entityId) {
        await this.savePendingImages(entityId);
        // Save pending skill usages
        if (this.skillUsageManager?.hasPendingUsages()) {
          await this.skillUsageManager.savePendingUsages(entityId);
        }
      }

      this.router.navigate(['/dashboard/competitions']);
    } catch (err) {
      this.error.set('Error al guardar la competencia');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  private async savePendingImages(entityId: number): Promise<void> {
    const images = this.pendingImages();
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        await this.supabase.create('image', {
          url: img.url,
          source_type: 'competition',
          source_id: entityId,
          position: i,
        });
      } catch (err) {
        console.error('Error saving image:', err);
      }
    }
    this.pendingImages.set([]);
  }

  async onImageUploaded(data: { path: string; url: string }): Promise<void> {
    if (this.currentId) {
      // If editing existing entity, save immediately
      try {
        await this.supabase.create('image', {
          url: data.url,
          source_type: 'competition',
          source_id: this.currentId,
          position: 0,
        });
      } catch (err) {
        console.error('Error saving image:', err);
        this.error.set('Error al guardar la imagen');
      }
    } else {
      // Queue for saving after entity creation
      this.pendingImages.update(images => [...images, data]);
    }
  }
}
