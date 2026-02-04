import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Skill, SkillFormData, SkillCategory } from '../../../core/models';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './skill-form.component.html',
})
export class SkillFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  categories = signal<SkillCategory[]>([]);
  isNew = true;
  currentId: number | null = null;

  formData: SkillFormData = { name: '', description: '', skill_category_id: null };

  constructor(private supabase: SupabaseService, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') { this.isNew = false; this.currentId = parseInt(id, 10); }
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const { data: cats } = await this.supabase.getActive<SkillCategory>('skill_category');
      this.categories.set(cats || []);

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getById<Skill>('skill', this.currentId);
        if (error) throw error;
        if (data) {
          this.formData = {
            name: data.name,
            description: data.description || '',
            skill_category_id: data.skill_category_id,
          };
        }
      }
    } catch (err) { this.error.set('Error al cargar los datos'); console.error('Load error:', err); }
    finally { this.loading.set(false); }
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.name.trim()) { this.error.set('El nombre es requerido'); return; }
    this.saving.set(true);
    this.error.set(null);
    try {
      const payload = {
        name: this.formData.name,
        description: this.formData.description || null,
        skill_category_id: this.formData.skill_category_id,
      };
      let result;
      if (this.isNew) { result = await this.supabase.create('skill', payload); }
      else { result = await this.supabase.update('skill', this.currentId!, payload); }
      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/skills']);
    } catch (err) { this.error.set('Error al guardar la habilidad'); console.error('Save error:', err); }
    finally { this.saving.set(false); }
  }
}
