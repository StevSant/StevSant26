import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { SkillUsage, SkillUsageFormData, Skill, SourceType } from '../../../core/models';

@Component({
  selector: 'app-skill-usage-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './skill-usage-form.component.html',
})
export class SkillUsageFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  skills = signal<Skill[]>([]);
  isNew = true;
  currentId: number | null = null;

  formData: SkillUsageFormData = {
    skill_id: 0,
    source_id: 0,
    source_type: 'project',
    level: null,
    description: '',
    started_at: '',
    ended_at: '',
  };

  constructor(private supabase: SupabaseService, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') { this.isNew = false; this.currentId = parseInt(id, 10); }
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const { data: skillsData } = await this.supabase.getActive<Skill>('skill');
      this.skills.set(skillsData || []);

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getById<SkillUsage>('skill_usages', this.currentId);
        if (error) throw error;
        if (data) {
          this.formData = {
            skill_id: data.skill_id,
            source_id: data.source_id || 0,
            source_type: data.source_type || 'project',
            level: data.level,
            description: data.description || '',
            started_at: data.started_at?.split('T')[0] || '',
            ended_at: data.ended_at?.split('T')[0] || '',
          };
        }
      }
    } catch (err) { this.error.set('Error al cargar los datos'); console.error('Load error:', err); }
    finally { this.loading.set(false); }
  }

  setLevel(level: number | null): void {
    this.formData.level = level;
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.skill_id || !this.formData.source_id) {
      this.error.set('La habilidad y el ID de fuente son requeridos');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      const payload = {
        skill_id: this.formData.skill_id,
        source_id: this.formData.source_id,
        source_type: this.formData.source_type,
        level: this.formData.level,
        description: this.formData.description || null,
        started_at: this.formData.started_at || null,
        ended_at: this.formData.ended_at || null,
      };
      let result;
      if (this.isNew) { result = await this.supabase.create('skill_usages', payload); }
      else { result = await this.supabase.update('skill_usages', this.currentId!, payload); }
      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/skill-usages']);
    } catch (err) { this.error.set('Error al guardar el vínculo'); console.error('Save error:', err); }
    finally { this.saving.set(false); }
  }
}
