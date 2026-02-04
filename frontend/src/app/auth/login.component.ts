import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
      <div class="max-w-md w-full mx-4">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white">Dashboard</h1>
          <p class="text-gray-400 mt-2">Inicia sesión para administrar tu portafolio</p>
        </div>

        <!-- Login Card -->
        <div class="bg-gray-800 rounded-xl shadow-2xl p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                [disabled]="loading()"
              />
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                [disabled]="loading()"
              />
            </div>

            <!-- Error Message -->
            @if (error()) {
              <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p class="text-red-400 text-sm">{{ error() }}</p>
              </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              @if (loading()) {
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Iniciando sesión...</span>
              } @else {
                <span>Iniciar sesión</span>
              }
            </button>
          </form>
        </div>

        <!-- Footer -->
        <p class="text-center text-gray-500 text-sm mt-8">
          Panel de administración del portafolio
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

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

      // Navigate to dashboard on successful login
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
