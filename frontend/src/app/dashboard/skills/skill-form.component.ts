import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Skill, SkillFormData, SkillCategory } from '../../core/models';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <a routerLink="/dashboard/skills" class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </a>
        <h1 class="text-2xl font-bold text-white">{{ isNew ? 'Nueva Habilidad' : 'Editar Habilidad' }}</h1>
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
            <h2 class="text-lg font-semibold text-white">Información de la Habilidad</h2>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nombre <span class="text-red-500">*</span></label>
              <input type="text" id="name" name="name" [(ngModel)]="formData.name" required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: TypeScript, Angular, Python..."/>
            </div>

            <div>
              <label for="skill_category_id" class="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
              <select id="skill_category_id" name="skill_category_id" [(ngModel)]="formData.skill_category_id"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option [ngValue]="null">Sin categoría</option>
                @for (cat of categories(); track cat.id) {
                  <option [ngValue]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
              <textarea id="description" name="description" [(ngModel)]="formData.description" rows="4"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe tu experiencia con esta habilidad..."></textarea>
            </div>
          </div>

          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p class="text-red-400 text-sm">{{ error() }}</p>
            </div>
          }

          <div class="flex justify-end gap-3">
            <a routerLink="/dashboard/skills" class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">Cancelar</a>
            <button type="submit" [disabled]="saving()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              @if (saving()) {
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Guardando...</span>
              } @else {
                <span>{{ isNew ? 'Crear Habilidad' : 'Guardar Cambios' }}</span>
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
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
