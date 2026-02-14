import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageTabsComponent } from '../../language-tabs/language-tabs.component';
import { Skill } from '@core/models';
import { SkillUsageItem } from '../skill-usage-manager.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-skill-usage-item',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, LanguageTabsComponent, MatIcon],
  templateUrl: './skill-usage-item.component.html',
})
export class SkillUsageItemComponent {
  usage = input.required<SkillUsageItem>();
  displayName = input.required<string>();
  skills = input<Skill[]>([]);
  getSkillName = input<(skill: Skill) => string>(() => '');

  remove = output<SkillUsageItem>();
  edit = output<SkillUsageItem>();

  isEditing = signal(false);
  editData: {
    skill_id: number;
    level: number | null;
    started_at: string | null;
    ended_at: string | null;
    translations: Map<string, { notes: string }>;
  } | null = null;
  editLanguage = signal<string>('es');

  getLevelStars(level: number | null): string {
    if (level === null) return '-';
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  }

  startEdit(): void {
    const u = this.usage();
    this.editData = {
      skill_id: u.skill_id,
      level: u.level,
      started_at: u.started_at,
      ended_at: u.ended_at,
      translations: new Map(
        Array.from(u.translations.entries()).map(([k, v]) => [k, { notes: v.notes }])
      ),
    };
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editData = null;
  }

  saveEdit(): void {
    if (!this.editData) return;
    const u = this.usage();
    const updated: SkillUsageItem = {
      ...u,
      skill_id: this.editData.skill_id,
      level: this.editData.level,
      started_at: this.editData.started_at,
      ended_at: this.editData.ended_at,
      translations: this.editData.translations,
    };
    this.edit.emit(updated);
    this.isEditing.set(false);
    this.editData = null;
  }

  setEditLevel(level: number | null): void {
    if (this.editData) this.editData.level = level;
  }

  get currentEditTranslation(): { notes: string } {
    return this.editData?.translations.get(this.editLanguage()) || { notes: '' };
  }

  updateEditTranslation(value: string): void {
    if (!this.editData) return;
    const current = this.editData.translations.get(this.editLanguage()) || { notes: '' };
    current.notes = value;
    this.editData.translations.set(this.editLanguage(), current);
  }
}
