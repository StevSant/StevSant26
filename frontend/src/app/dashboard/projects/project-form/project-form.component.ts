import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Project, ProjectFormData } from '../../../core/models';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  parentProjects = signal<Project[]>([]);

  isNew = true;
  currentId: number | null = null;

  formData: ProjectFormData = {
    title: '',
    description: '',
    url: '',
    created_at: new Date().toISOString().split('T')[0],
    parent_project_id: null,
    source_id: null,
    source_type: null,
  };

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
      // Load parent projects (exclude current if editing)
      const { data: projects } = await this.supabase.getActive<Project>('project');
      if (projects) {
        this.parentProjects.set(
          this.currentId ? projects.filter((p) => p.id !== this.currentId) : projects
        );
      }

      // Load current item if editing
      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getById<Project>('project', this.currentId);
        if (error) throw error;
        if (data) {
          this.formData = {
            title: data.title,
            description: data.description || '',
            url: data.url || '',
            created_at: data.created_at?.split('T')[0] || '',
            parent_project_id: data.parent_project_id,
            source_id: data.source_id,
            source_type: data.source_type,
          };
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
    if (!this.formData.title.trim()) {
      this.error.set('El título es requerido');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const payload = {
        title: this.formData.title,
        description: this.formData.description || null,
        url: this.formData.url || null,
        created_at: this.formData.created_at || null,
        parent_project_id: this.formData.parent_project_id,
        source_id: this.formData.source_id,
        source_type: this.formData.source_type,
      };

      let result;
      if (this.isNew) {
        result = await this.supabase.create('project', payload);
      } else {
        result = await this.supabase.update('project', this.currentId!, payload);
      }

      if (result.error) throw result.error;

      this.router.navigate(['/dashboard/projects']);
    } catch (err) {
      this.error.set('Error al guardar el proyecto');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  onImageUploaded(data: { path: string; url: string }): void {
    // If we have a current ID, create an image record
    if (this.currentId) {
      this.supabase.create('image', {
        url: data.url,
        source_type: 'project',
        source_id: this.currentId,
        position: 0,
      });
    }
  }
}
