import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService, Toast } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  protected toastService = inject(ToastService);

  getToastClasses(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'bg-(--color-success-bg) text-(--color-success) border-(--color-success-border)';
      case 'error':
        return 'bg-red-900/90 text-red-200 border-red-700';
      case 'info':
        return 'bg-(--color-bg-secondary) text-(--color-text-primary) border-(--color-border-primary)';
    }
  }
}
