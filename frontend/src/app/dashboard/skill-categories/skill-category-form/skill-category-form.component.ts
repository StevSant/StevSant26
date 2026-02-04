import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { SkillCategory, SkillCategoryFormData } from '../../../core/models';

@Component({
  selector: 'app-skill-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './skill-category-form.component.html',
})
export class SkillCategoryFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  isNew = true;
  currentId: number | null = null;

  formData: SkillCategoryFormData = { name: '', approach: '' };

  constructor(
    private supabase: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getById<SkillCategory>('skill_category', this.currentId);
        if (error) throw error;
        if (data) {
          this.formData = { name: data.name, approach: data.approach || '' };
        }
      }
    } catch (err) {
      this.error.set('Error al cargar los datos');
      console.error('Load error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.name.trim()) {
      this.error.set('El nombre es requerido');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      const payload = { name: this.formData.name, approach: this.formData.approach || null };
      let result;
      if (this.isNew) {
        result = await this.supabase.create('skill_category', payload);
      } else {
        result = await this.supabase.update('skill_category', this.currentId!, payload);
      }
      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/skill-categories']);
    } catch (err) {
      this.error.set('Error al guardar la categoría');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }
}
