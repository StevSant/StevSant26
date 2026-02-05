import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LanguageSelectorComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set('Por favor ingresa tu correo y contraseña');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const { error } = await this.supabase.signIn(this.email, this.password);

      if (error) {
        this.error.set(this.getErrorMessage(error.message));
        return;
      }

      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error.set('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  private getErrorMessage(message: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Credenciales inválidas. Verifica tu correo y contraseña.',
      'Email not confirmed': 'Tu correo no ha sido confirmado. Revisa tu bandeja de entrada.',
      'Too many requests': 'Demasiados intentos. Por favor espera un momento.',
    };
    return errorMessages[message] || message;
  }
}
