import { Component, input, signal, inject, effect, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslateService } from '@core/services/translate.service';
import { LanguageService } from '@core/services/language.service';
import { ContentSectionService } from '@core/services/content-section.service';
import { CrudService } from '@core/services/crud.service';
import { ContentSection, ContentSectionKey, SourceType, Language, getTranslation, Image } from '@core/models';
import { ContentSectionFormData } from '@core/models';
import { ContentSectionItem } from './content-section-item.model';
import { ContentSectionAddFormComponent } from './content-section-add-form/content-section-add-form.component';
import { ContentSectionItemComponent } from './content-section-item/content-section-item.component';
import { ImageUploadComponent, ExistingImage } from '@shared/components/image-upload/image-upload.component';
import { SECTION_KEY_OPTIONS } from './section-key-options';
import { LoggerService } from '@core/services/logger.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-content-section-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TranslatePipe,
    ContentSectionAddFormComponent,
    ContentSectionItemComponent,
    ImageUploadComponent,
    MatIcon,
  ],
  templateUrl: './content-section-manager.component.html',
})
export class ContentSectionManagerComponent implements OnInit {
  private contentSectionService = inject(ContentSectionService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private crud = inject(CrudService);
  private logger = inject(LoggerService);

  /** The entity type this manager is attached to */
  sourceType = input.required<SourceType>();

  /** The entity ID (null when creating a new entity) */
  sourceId = input<number | null>(null);

  // Internal state
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  sections = signal<ContentSectionItem[]>([]);
  showAddForm = signal(false);
  editingId = signal<number | null>(null);
  currentEditLanguage = signal<string>('es');

  /** Image state per section (keyed by section id) */
  sectionImages = signal<Map<number, ExistingImage[]>>(new Map());

  /** Pending images for sections that haven't been saved yet */
  pendingImagesBySection = signal<Map<number, { path: string; url: string }[]>>(new Map());

  /** Active section-key filter (null = show all) */
  activeFilter = signal<ContentSectionKey | null>(null);

  /** Available filter keys based on existing sections */
  availableFilters = computed(() => {
    const keys = new Set(this.sections().map(s => s.section_key));
    return SECTION_KEY_OPTIONS.filter(opt => keys.has(opt.value));
  });

  /** Filtered sections list */
  filteredSections = computed(() => {
    const filter = this.activeFilter();
    const all = this.sections();
    if (!filter) return all;
    return all.filter(s => s.section_key === filter);
  });

  /** Form data for add/edit */
  formData: ContentSectionItem = this.createEmptyItem();

  /** Pending sections to save after entity creation */
  pendingItems = signal<ContentSectionItem[]>([]);

  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  constructor() {
    effect(() => {
      const id = this.sourceId();
      if (id) {
        this.loadSections(id);
      } else {
        this.sections.set([...this.pendingItems()]);
        this.loading.set(false);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // Loading happens via the effect
  }

  // ─── Load ───────────────────────────────────────────

  private async loadSections(entityId: number): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.contentSectionService.getByEntity(this.sourceType(), entityId);
      const items = data.map(s => this.mapToItem(s));
      this.sections.set(items);
      await this.loadSectionImages(items);
    } catch (err) {
      this.error.set(this.translateService.instant('contentSections.errors.loadError'));
      this.logger.error('Load content sections error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  // ─── Map helpers ────────────────────────────────────

  private mapToItem(section: ContentSection): ContentSectionItem {
    const translations = new Map<string, { title: string; body: string }>();
    for (const lang of this.supportedLanguages) {
      const trans = section.translations?.find(t => t.language?.code === lang.code);
      translations.set(lang.code, {
        title: trans?.title || '',
        body: trans?.body || '',
      });
    }
    return {
      id: section.id,
      section_key: section.section_key,
      icon: section.icon || '',
      position: section.position ?? 0,
      translations,
      isNew: false,
      isEditing: false,
    };
  }

  private createEmptyItem(): ContentSectionItem {
    const translations = new Map<string, { title: string; body: string }>();
    for (const lang of this.languageService.supportedLanguages()) {
      translations.set(lang.code, { title: '', body: '' });
    }
    return {
      section_key: 'custom',
      icon: '',
      position: this.sections().length,
      translations,
      isNew: true,
      isEditing: true,
    };
  }

  private buildFormData(item: ContentSectionItem, entityId: number): ContentSectionFormData {
    return {
      entity_type: this.sourceType(),
      entity_id: entityId,
      section_key: item.section_key,
      icon: item.icon,
      position: item.position,
      is_archived: false,
      is_pinned: false,
      translations: Array.from(item.translations.entries()).map(([lang, t]) => ({
        language: lang,
        title: t.title,
        body: t.body,
      })),
    };
  }

  // ─── Display helper ─────────────────────────────────

  /** Current translation being edited – resolves the map entry for the active language */
  get currentTranslation(): { title: string; body: string } {
    return (
      this.formData.translations.get(this.currentEditLanguage()) || {
        title: '',
        body: '',
      }
    );
  }

  getItemTitle(item: ContentSectionItem): string {
    const lang = this.translateService.currentLang();
    const trans = item.translations.get(lang) || item.translations.values().next().value;
    return trans?.title || '';
  }

  // ─── Form interactions ──────────────────────────────

  setFilter(key: ContentSectionKey | null): void {
    this.activeFilter.set(this.activeFilter() === key ? null : key);
  }

  openAddForm(): void {
    this.formData = this.createEmptyItem();
    this.editingId.set(null);
    this.currentEditLanguage.set('es');
    this.showAddForm.set(true);
    this.error.set(null);
  }

  openEditForm(item: ContentSectionItem): void {
    // Deep-clone translations
    const clonedTranslations = new Map<string, { title: string; body: string }>();
    for (const [k, v] of item.translations) {
      clonedTranslations.set(k, { ...v });
    }
    this.formData = {
      ...item,
      translations: clonedTranslations,
      isEditing: true,
    };
    this.editingId.set(item.id ?? null);
    this.currentEditLanguage.set('es');
    this.showAddForm.set(true);
    this.error.set(null);
  }

  cancelForm(): void {
    this.showAddForm.set(false);
    this.editingId.set(null);
    this.formData = this.createEmptyItem();
  }

  onSectionKeyChange(key: ContentSectionKey): void {
    this.formData.section_key = key;
  }

  onIconChange(icon: string): void {
    this.formData.icon = icon;
  }

  onLanguageChange(langCode: string): void {
    this.currentEditLanguage.set(langCode);
  }

  onTranslationChange(event: { field: 'title' | 'body'; value: string }): void {
    const current = this.formData.translations.get(this.currentEditLanguage()) || { title: '', body: '' };
    current[event.field] = event.value;
    this.formData.translations.set(this.currentEditLanguage(), current);
  }

  // ─── Save (add or update) ──────────────────────────

  async saveSection(): Promise<void> {
    // Validate: at least one translation must have a title
    const hasSomeTitle = Array.from(this.formData.translations.values()).some(t => t.title.trim());
    if (!hasSomeTitle) {
      this.error.set(this.translateService.instant('contentSections.errors.titleRequired'));
      return;
    }

    const sourceId = this.sourceId();
    const editingId = this.editingId();

    if (sourceId) {
      this.saving.set(true);
      this.error.set(null);
      try {
        if (editingId) {
          await this.contentSectionService.update(editingId, this.buildFormData(this.formData, sourceId));
        } else {
          this.formData.position = this.sections().length;
          await this.contentSectionService.create(this.buildFormData(this.formData, sourceId));
        }
        await this.loadSections(sourceId);
      } catch (err) {
        this.error.set(this.translateService.instant('contentSections.errors.saveError'));
        this.logger.error('Save content section error:', err);
      } finally {
        this.saving.set(false);
      }
    } else {
      // Entity not yet saved — store in pending
      if (editingId === null) {
        this.pendingItems.update(items => [...items, { ...this.formData, isNew: true }]);
        this.sections.update(items => [...items, { ...this.formData, isNew: true }]);
      }
    }

    this.showAddForm.set(false);
    this.editingId.set(null);
    this.formData = this.createEmptyItem();
  }

  // ─── Remove ─────────────────────────────────────────

  async removeSection(item: ContentSectionItem): Promise<void> {
    if (item.id) {
      try {
        await this.contentSectionService.archive(item.id);
        this.sections.update(items => items.filter(s => s.id !== item.id));
      } catch (err) {
        this.error.set(this.translateService.instant('contentSections.errors.deleteError'));
        this.logger.error('Delete content section error:', err);
      }
    } else {
      this.pendingItems.update(items => items.filter(s => s !== item));
      this.sections.update(items => items.filter(s => s !== item));
    }
  }

  // ─── Public API for parent forms ────────────────────

  /** Called by parent component after entity creation to save pending items */
  async savePendingItems(entityId: number): Promise<void> {
    const pending = this.pendingItems();
    for (let i = 0; i < pending.length; i++) {
      pending[i].position = i;
      await this.contentSectionService.create(this.buildFormData(pending[i], entityId));
    }
    this.pendingItems.set([]);
  }

  /** Check if there are pending items to save */
  hasPendingItems(): boolean {
    return this.pendingItems().length > 0;
  }

  // ─── Drag & Drop ────────────────────────────────────

  async drop(event: CdkDragDrop<ContentSectionItem[]>): Promise<void> {
    const items = [...this.sections()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    // Update positions locally
    items.forEach((item, index) => (item.position = index));
    this.sections.set(items);

    // Persist if items have IDs
    const savedIds = items.filter(i => i.id).map(i => i.id!);
    if (savedIds.length > 0) {
      try {
        await this.contentSectionService.reorder(savedIds);
      } catch (err) {
        this.logger.error('Error reordering sections:', err);
        this.error.set(this.translateService.instant('contentSections.errors.saveError'));
      }
    }
  }

  // ─── Image helpers ──────────────────────────────────

  /** Load images for all sections */
  private async loadSectionImages(sectionItems: ContentSectionItem[]): Promise<void> {
    const ids = sectionItems.filter(i => i.id).map(i => i.id!);
    if (ids.length === 0) return;

    const { data } = await this.crud
      .from('image')
      .select('*')
      .eq('source_type', 'content_section')
      .in('source_id', ids)
      .eq('is_archived', false)
      .order('position', { ascending: true });

    const imageMap = new Map<number, ExistingImage[]>();
    if (data) {
      for (const img of data as any[]) {
        const sectionId = img.source_id as number;
        if (!imageMap.has(sectionId)) {
          imageMap.set(sectionId, []);
        }
        imageMap.get(sectionId)!.push({
          id: img.id,
          url: img.url,
          alt_text: img.alt_text,
        });
      }
    }
    this.sectionImages.set(imageMap);
  }

  /** Get existing images for a section */
  getExistingImages(sectionId: number | undefined): ExistingImage[] {
    if (!sectionId) return [];
    return this.sectionImages().get(sectionId) || [];
  }

  /** Handle image upload for a saved section */
  async onSectionImageUploaded(sectionId: number, data: { path: string; url: string }): Promise<void> {
    try {
      const existingImages = this.getExistingImages(sectionId);
      await this.crud.create('image', {
        url: data.url,
        source_type: 'content_section',
        source_id: sectionId,
        position: existingImages.length,
      });
      // Reload images
      await this.loadSectionImages(this.sections());
    } catch (err) {
      this.logger.error('Error saving section image:', err);
    }
  }

  /** Handle image reorder for a saved section */
  async onSectionImagesReordered(sectionId: number, updates: { id: number; position: number }[]): Promise<void> {
    if (updates.length === 0) return;
    try {
      await this.crud.updatePositions('image', updates);
      // Reload images to reflect the new order
      await this.loadSectionImages(this.sections());
    } catch (err) {
      this.logger.error('Error reordering section images:', err);
    }
  }
}
