import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Competition, CompetitionFormData } from '../../core/models';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-competition-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <a routerLink="/dashboard/competitions" class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </a>
        <h1 class="text-2xl font-bold text-white">{{ isNew ? 'Nueva Competencia' : 'Editar Competencia' }}</h1>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else {
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="bg-gray-800 rounded-xl p-6 space-y-6">
            <h2 class="text-lg font-semibold text-white">Información de la Competencia</h2>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nombre <span class="text-red-500">*</span></label>
              <input type="text" id="name" name="name" [(ngModel)]="formData.name" required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nombre de la competencia"/>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="organizer" class="block text-sm font-medium text-gray-300 mb-2">Organizador</label>
                <input type="text" id="organizer" name="organizer" [(ngModel)]="formData.organizer"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Empresa u organización"/>
              </div>
              <div>
                <label for="date" class="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
                <input type="date" id="date" name="date" [(ngModel)]="formData.date"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"/>
              </div>
            </div>

            <div>
              <label for="result" class="block text-sm font-medium text-gray-300 mb-2">Resultado</label>
              <input type="text" id="result" name="result" [(ngModel)]="formData.result"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 1er lugar, Finalista, Mención honorífica"/>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
              <textarea id="description" name="description" [(ngModel)]="formData.description" rows="4"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe la competencia y tu participación..."></textarea>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 space-y-6">
            <h2 class="text-lg font-semibold text-white">Imágenes</h2>
            <app-image-upload folder="competitions" [multiple]="true" [sourceType]="'competition'" [sourceId]="currentId" (uploaded)="onImageUploaded($event)"/>
          </div>

          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p class="text-red-400 text-sm">{{ error() }}</p>
            </div>
          }

          <div class="flex justify-end gap-3">
            <a routerLink="/dashboard/competitions" class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">Cancelar</a>
            <button type="submit" [disabled]="saving()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              @if (saving()) {
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Guardando...</span>
              } @else {
                <span>{{ isNew ? 'Crear Competencia' : 'Guardar Cambios' }}</span>
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class CompetitionFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  isNew = true;
  currentId: number | null = null;

  formData: CompetitionFormData = { name: '', organizer: '', date: '', description: '', result: '' };

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
        const { data, error } = await this.supabase.getById<Competition>('competitions', this.currentId);
        if (error) throw error;
        if (data) {
          this.formData = {
            name: data.name,
            organizer: data.organizer || '',
            date: data.date?.split('T')[0] || '',
            description: data.description || '',
            result: data.result || '',
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
        organizer: this.formData.organizer || null,
        date: this.formData.date || null,
        description: this.formData.description || null,
        result: this.formData.result || null,
      };
      let result;
      if (this.isNew) { result = await this.supabase.create('competitions', payload); }
      else { result = await this.supabase.update('competitions', this.currentId!, payload); }
      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/competitions']);
    } catch (err) { this.error.set('Error al guardar la competencia'); console.error('Save error:', err); }
    finally { this.saving.set(false); }
  }

  onImageUploaded(data: { path: string; url: string }): void {
    if (this.currentId) { this.supabase.create('image', { url: data.url, source_type: 'competition', source_id: this.currentId, position: 0 }); }
  }
}
