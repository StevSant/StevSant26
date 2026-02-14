import { Component, OnInit, signal, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslationDataService } from '@core/services/translation-data.service';
import { CrudService } from '@core/services/crud.service';
import { TranslateService } from '@core/services/translate.service';
import { Education, EducationTranslation, Image } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { DashboardFilterComponent, DashboardFilterOption } from '@shared/components/dashboard-filter/dashboard-filter.component';
import { EducationItemComponent } from './education-item/education-item.component';
import { LoggerService } from '@core/services/logger.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-education-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe, DashboardFilterComponent, EducationItemComponent, MatIcon],
  templateUrl: './education-list.component.html',
})
export class EducationListComponent implements OnInit {
  private translationData = inject(TranslationDataService);
  private crudService = inject(CrudService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  confirmDialog = viewChild.required<ConfirmDialogComponent>('confirmDialog');
  loading = signal(true);
  showArchived = signal(false);
  items = signal<Education[]>([]);
  itemToDelete: Education | null = null;
  imageMap = new Map<number, string>();

  // Filter state
  searchText = signal('');
  selectedInstitution = signal('');
  selectedType = signal('');
  institutionFilterOptions = signal<DashboardFilterOption[]>([]);
  typeFilterOptions = signal<DashboardFilterOption[]>([
    { label: 'educations.types.formal', value: 'formal' },
    { label: 'educations.types.course', value: 'course' },
    { label: 'educations.types.certification', value: 'certification' },
  ]);

  async ngOnInit(): Promise<void> { await this.loadItems(); }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.translationData.getAllWithTranslations<Education>(
        'education',
        'education_translation',
        'position',
        true
      );
      if (error) throw error;
      this.items.set(data || []);
      this.buildInstitutionOptions(data || []);
      await this.loadImages(data || []);
    } catch (err) { this.logger.error('Error loading educations:', err); }
    finally { this.loading.set(false); }
  }

  private buildInstitutionOptions(educations: Education[]): void {
    const institutions = new Set<string>();
    for (const edu of educations) {
      if (edu.institution) institutions.add(edu.institution);
    }
    this.institutionFilterOptions.set(
      Array.from(institutions).sort().map(i => ({ label: i, value: i }))
    );
  }

  private async loadImages(items: Education[]): Promise<void> {
    if (items.length === 0) return;
    const ids = items.map(i => i.id);
    const { data } = await this.crudService
      .from('image')
      .select('*')
      .eq('source_type', 'education')
      .in('source_id', ids)
      .eq('is_archived', false)
      .order('position', { ascending: true });
    if (data) {
      this.imageMap.clear();
      for (const img of data as Image[]) {
        if (img.source_id && !this.imageMap.has(img.source_id)) {
          this.imageMap.set(img.source_id, img.url);
        }
      }
    }
  }

  getItemDegree(item: Education): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.degree || item.translations?.[0]?.degree || `Education #${item.id}`;
  }

  filteredItems(): Education[] {
    const all = this.items();
    let filtered = this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
    const institution = this.selectedInstitution();
    if (institution) {
      filtered = filtered.filter(i => i.institution === institution);
    }
    const type = this.selectedType();
    if (type) {
      filtered = filtered.filter(i => i.education_type === type);
    }
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(i => {
        const degree = this.getItemDegree(i).toLowerCase();
        const inst = (i.institution || '').toLowerCase();
        return degree.includes(search) || inst.includes(search);
      });
    }
    return filtered;
  }

  onSearchChange(text: string): void { this.searchText.set(text); }
  onInstitutionFilterChange(value: string): void { this.selectedInstitution.set(value); }
  onTypeFilterChange(value: string): void { this.selectedType.set(value); }
  toggleShowArchived(): void { this.showArchived.update((v) => !v); }

  async drop(event: CdkDragDrop<Education[]>): Promise<void> {
    const allItems = [...this.items()];
    const filtered = this.filteredItems();
    const movedItem = filtered[event.previousIndex];
    const targetItem = filtered[event.currentIndex];
    const fromIndex = allItems.indexOf(movedItem);
    const toIndex = allItems.indexOf(targetItem);
    if (fromIndex < 0 || toIndex < 0) return;
    moveItemInArray(allItems, fromIndex, toIndex);
    allItems.forEach((item, i) => (item as any).position = i);
    this.items.set(allItems);
    const updates = allItems.map((item, i) => ({ id: item.id, position: i }));
    try { await this.crudService.updatePositions('education', updates); }
    catch (err) { this.logger.error('Error updating positions:', err); await this.loadItems(); }
  }

  async togglePin(item: Education): Promise<void> {
    try { await this.crudService.togglePin('education', item.id, !item.is_pinned); await this.loadItems(); }
    catch (err) { this.logger.error('Error toggling pin:', err); }
  }

  async toggleArchive(item: Education): Promise<void> {
    try {
      if (item.is_archived) { await this.crudService.unarchive('education', item.id); }
      else { await this.crudService.archive('education', item.id); }
      await this.loadItems();
    } catch (err) { this.logger.error('Error toggling archive:', err); }
  }

  confirmDelete(item: Education): void { this.itemToDelete = item; this.confirmDialog().open(); }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try { await this.crudService.delete('education', this.itemToDelete.id); await this.loadItems(); }
    catch (err) { this.logger.error('Error deleting item:', err); }
    finally { this.itemToDelete = null; }
  }
}
