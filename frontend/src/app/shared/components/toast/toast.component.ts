import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService, Toast } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium max-w-sm animate-slide-in-right"
          [class]="getToastClasses(toast)"
        >
          <span class="flex-1">{{ toast.message }}</span>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="opacity-60 hover:opacity-100 transition-opacity shrink-0 text-current"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slide-in-right {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
      }
    `,
  ],
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
