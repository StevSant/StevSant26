import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LanguageSelectorComponent, ThemeToggleComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private t = inject(TranslateService);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set(this.t.instant('errors.loginRequiredFields'));
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const { error } = await this.authService.signIn(this.email, this.password);

      if (error) {
        this.error.set(this.getErrorMessage(error.message));
        return;
      }

      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error.set(this.t.instant('errors.unexpectedError'));
    } finally {
      this.loading.set(false);
    }
  }

  private getErrorMessage(message: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'errors.invalidCredentials',
      'Email not confirmed': 'errors.emailNotConfirmed',
      'Too many requests': 'errors.tooManyRequests',
    };
    const key = errorMap[message];
    return key ? this.t.instant(key) : message;
  }
}
