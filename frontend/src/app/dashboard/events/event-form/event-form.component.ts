import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Event, EventFormData } from '../../../core/models';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  isNew = true;
  currentId: number | null = null;

  formData: EventFormData = {
    name: '',
    description: '',
    assisted_at: '',
  };

  constructor(private supabase: SupabaseService, private route: ActivatedRoute, private router: Router) {}

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
        const { data, error } = await this.supabase.getById<Event>('event', this.currentId);
        if (error) throw error;
        if (data) {
          this.formData = {
            name: data.name,
            description: data.description || '',
            assisted_at: data.assisted_at?.split('T')[0] || '',
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
    if (!this.formData.name.trim()) {
      this.error.set('El nombre es requerido');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const payload = {
        name: this.formData.name,
        description: this.formData.description || null,
        assisted_at: this.formData.assisted_at || null,
      };

      let result;
      if (this.isNew) {
        result = await this.supabase.create('event', payload);
      } else {
        result = await this.supabase.update('event', this.currentId!, payload);
      }

      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/events']);
    } catch (err) {
      this.error.set('Error al guardar el evento');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  onImageUploaded(data: { path: string; url: string }): void {
    if (this.currentId) {
      this.supabase.create('image', { url: data.url, source_type: 'event', source_id: this.currentId, position: 0 });
    }
  }
}
