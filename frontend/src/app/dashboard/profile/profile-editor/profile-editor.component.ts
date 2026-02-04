import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Profile } from '../../../core/models';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './profile-editor.component.html',
})
export class ProfileEditorComponent implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  profile: Profile | null = null;
  profileExists = false;

  formData = {
    first_name: '',
    last_name: '',
    nickname: '',
    about: '',
  };

  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getProfile();

      if (error && !error.message.includes('PGRST116')) {
        throw error;
      }

      if (data) {
        this.profile = data;
        this.profileExists = true;
        this.formData = {
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          nickname: data.nickname || '',
          about: data.about || '',
        };
      } else {
        this.profileExists = false;
      }
    } catch (err) {
      this.error.set('Error al cargar el perfil');
      console.error('Load profile error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      let result;

      if (this.profileExists) {
        result = await this.supabase.updateProfile(this.formData);
      } else {
        result = await this.supabase.createProfile(this.formData);
        this.profileExists = true;
      }

      if (result.error) {
        throw result.error;
      }

      this.profile = result.data;
      this.success.set('Perfil actualizado correctamente');

      setTimeout(() => this.success.set(null), 3000);
    } catch (err) {
      this.error.set('Error al guardar el perfil');
      console.error('Save profile error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  resetForm(): void {
    if (this.profile) {
      this.formData = {
        first_name: this.profile.first_name || '',
        last_name: this.profile.last_name || '',
        nickname: this.profile.nickname || '',
        about: this.profile.about || '',
      };
    } else {
      this.formData = {
        first_name: '',
        last_name: '',
        nickname: '',
        about: '',
      };
    }
    this.error.set(null);
    this.success.set(null);
  }

  onAvatarUploaded(data: { path: string; url: string }): void {
    console.log('Avatar uploaded:', data);
  }
}
