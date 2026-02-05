import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Event, EventTranslation, Language } from '../../../../core/models';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { LanguageTabsComponent } from '../../../../shared/components/language-tabs/language-tabs.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent, LanguageTabsComponent],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  isNew = true;
  currentId: number | null = null;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Base fields (non-translatable)
  formData = {
    assisted_at: '',
  };

  // Translations map by language code
  translations: Map<string, { name: string; description: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { name: string; description: string } {
    return this.translations.get(this.currentEditLanguage()) || { name: '', description: '' };
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
        this.translations.set(lang.code, { name: '', description: '' });
      }

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<Event>(
          'event',
          'event_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            assisted_at: data.assisted_at?.split('T')[0] || '',
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as EventTranslation[]) {
              this.translations.set(t.language, {
                name: t.name || '',
                description: t.description || '',
              });
            }
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

  updateTranslation(field: 'name' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { name: '', description: '' };
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
      const basePayload = {
        assisted_at: this.formData.assisted_at || null,
      };

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        name: t.name || null,
        description: t.description || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          'event',
          'event_translation',
          'event_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          'event',
          'event_translation',
          'event_id',
          this.currentId!,
          basePayload,
          translationsPayload
        );
      }

      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/events']);
    } catch (err) {
      this.error.set('Error al guardar el evento');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  onImageUploaded(data: { path: string; url: string }): void {
    if (this.currentId) {
      this.supabase.create('image', {
        url: data.url,
        source_type: 'event',
        source_id: this.currentId,
        position: 0,
      });
    }
  }
}
