import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Experience, ExperienceTranslation, Language } from '../../../../core/models';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { LanguageTabsComponent } from '../../../../shared/components/language-tabs/language-tabs.component';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent, LanguageTabsComponent],
  templateUrl: './experience-form.component.html',
})
export class ExperienceFormComponent implements OnInit {
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
    company: '',
    start_date: '',
    end_date: '',
  };

  // Translations map by language code
  translations: Map<string, { role: string; description: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { role: string; description: string } {
    return this.translations.get(this.currentEditLanguage()) || { role: '', description: '' };
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
        this.translations.set(lang.code, { role: '', description: '' });
      }

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<Experience>(
          'experience',
          'experience_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            company: data.company || '',
            start_date: data.start_date?.split('T')[0] || '',
            end_date: data.end_date?.split('T')[0] || '',
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as ExperienceTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  role: t.role || '',
                  description: t.description || '',
                });
              }
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

  updateTranslation(field: 'role' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { role: '', description: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    // Validate that company is provided and at least one language has a role
    if (!this.formData.company.trim()) {
      this.error.set('La empresa es requerida');
      return;
    }

    const hasRole = Array.from(this.translations.values()).some((t) => t.role.trim());
    if (!hasRole) {
      this.error.set('El rol es requerido en al menos un idioma');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {
        company: this.formData.company,
        start_date: this.formData.start_date || null,
        end_date: this.formData.end_date || null,
      };

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        role: t.role || null,
        description: t.description || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          'experience',
          'experience_translation',
          'experience_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          'experience',
          'experience_translation',
          'experience_id',
          this.currentId!,
          basePayload,
          translationsPayload
        );
      }

      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/experiences']);
    } catch (err) {
      this.error.set('Error al guardar la experiencia');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  onImageUploaded(data: { path: string; url: string }): void {
    if (this.currentId) {
      this.supabase.create('image', {
        url: data.url,
        source_type: 'experience',
        source_id: this.currentId,
        position: 0,
      });
    }
  }
}
