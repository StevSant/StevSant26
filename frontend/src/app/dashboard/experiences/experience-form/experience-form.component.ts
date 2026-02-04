import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Experience, ExperienceFormData } from '../../../core/models';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  templateUrl: './experience-form.component.html',
})
export class ExperienceFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  isNew = true;
  currentId: number | null = null;

  formData: ExperienceFormData = { company: '', role: '', start_date: '', end_date: '', description: '' };

  constructor(private supabase: SupabaseService, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') { this.isNew = false; this.currentId = parseInt(id, 10); }
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getById<Experience>('experience', this.currentId);
        if (error) throw error;
        if (data) {
          this.formData = {
            company: data.company,
            role: data.role,
            start_date: data.start_date?.split('T')[0] || '',
            end_date: data.end_date?.split('T')[0] || '',
            description: data.description || '',
          };
        }
      }
    } catch (err) { this.error.set('Error al cargar los datos'); console.error('Load error:', err); }
    finally { this.loading.set(false); }
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.company.trim() || !this.formData.role.trim()) { this.error.set('La empresa y el rol son requeridos'); return; }
    this.saving.set(true);
    this.error.set(null);
    try {
      const payload = {
        company: this.formData.company,
        role: this.formData.role,
        start_date: this.formData.start_date || null,
        end_date: this.formData.end_date || null,
        description: this.formData.description || null,
      };
      let result;
      if (this.isNew) { result = await this.supabase.create('experience', payload); }
      else { result = await this.supabase.update('experience', this.currentId!, payload); }
      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/experiences']);
    } catch (err) { this.error.set('Error al guardar la experiencia'); console.error('Save error:', err); }
    finally { this.saving.set(false); }
  }

  onImageUploaded(data: { path: string; url: string }): void {
    if (this.currentId) { this.supabase.create('image', { url: data.url, source_type: 'experience', source_id: this.currentId, position: 0 }); }
  }
}
