import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Project, ProjectFormData, SourceType } from '../../core/models';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  template: `
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <a
          routerLink="/dashboard/projects"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </a>
        <h1 class="text-2xl font-bold text-white">
          {{ isNew ? 'Nuevo Proyecto' : 'Editar Proyecto' }}
        </h1>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else {
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Main Info Card -->
          <div class="bg-gray-800 rounded-xl p-6 space-y-6">
            <h2 class="text-lg font-semibold text-white">Información del Proyecto</h2>

            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
                Título <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="formData.title"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nombre del proyecto"
              />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                [(ngModel)]="formData.description"
                rows="4"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe el proyecto..."
              ></textarea>
            </div>

            <!-- URL -->
            <div>
              <label for="url" class="block text-sm font-medium text-gray-300 mb-2">
                URL del Proyecto
              </label>
              <input
                type="url"
                id="url"
                name="url"
                [(ngModel)]="formData.url"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://..."
              />
            </div>

            <!-- Created At -->
            <div>
              <label for="created_at" class="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Creación
              </label>
              <input
                type="date"
                id="created_at"
                name="created_at"
                [(ngModel)]="formData.created_at"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Source Association -->
          <div class="bg-gray-800 rounded-xl p-6 space-y-6">
            <h2 class="text-lg font-semibold text-white">Asociación (Opcional)</h2>
            <p class="text-gray-400 text-sm">Vincula este proyecto a una experiencia, competencia o evento</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Source Type -->
              <div>
                <label for="source_type" class="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Fuente
                </label>
                <select
                  id="source_type"
                  name="source_type"
                  [(ngModel)]="formData.source_type"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option [ngValue]="null">Sin asociación</option>
                  <option value="experience">Experiencia</option>
                  <option value="competition">Competencia</option>
                  <option value="event">Evento</option>
                </select>
              </div>

              <!-- Source ID -->
              <div>
                <label for="source_id" class="block text-sm font-medium text-gray-300 mb-2">
                  ID de Fuente
                </label>
                <input
                  type="number"
                  id="source_id"
                  name="source_id"
                  [(ngModel)]="formData.source_id"
                  [disabled]="!formData.source_type"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="ID"
                />
              </div>
            </div>

            <!-- Parent Project -->
            <div>
              <label for="parent_project_id" class="block text-sm font-medium text-gray-300 mb-2">
                Proyecto Padre
              </label>
              <select
                id="parent_project_id"
                name="parent_project_id"
                [(ngModel)]="formData.parent_project_id"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option [ngValue]="null">Ninguno</option>
                @for (project of parentProjects(); track project.id) {
                  <option [ngValue]="project.id">{{ project.title }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Images -->
          <div class="bg-gray-800 rounded-xl p-6 space-y-6">
            <h2 class="text-lg font-semibold text-white">Imágenes del Proyecto</h2>
            <app-image-upload
              folder="projects"
              [multiple]="true"
              [sourceType]="'project'"
              [sourceId]="currentId"
              (uploaded)="onImageUploaded($event)"
            />
          </div>

          <!-- Messages -->
          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p class="text-red-400 text-sm">{{ error() }}</p>
            </div>
          }

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <a
              routerLink="/dashboard/projects"
              class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancelar
            </a>
            <button
              type="submit"
              [disabled]="saving()"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              @if (saving()) {
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Guardando...</span>
              } @else {
                <span>{{ isNew ? 'Crear Proyecto' : 'Guardar Cambios' }}</span>
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
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
