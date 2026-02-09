import { Component, inject, input, output, signal } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  private t = inject(TranslateService);

  // Signal inputs — callers can override; defaults come from i18n
  title = input<string>('');
  message = input<string>('');
  confirmText = input<string>('');
  cancelText = input<string>('');
  variant = input<'danger' | 'warning' | 'info'>('danger');

  // Signal outputs
  confirmed = output<void>();
  cancelled = output<void>();

  isOpen = signal(false);

  /** Resolve display value: use caller-provided text or fall back to i18n key */
  get displayTitle(): string { return this.title() || this.t.instant('confirmDialog.defaultTitle'); }
  get displayMessage(): string { return this.message() || this.t.instant('confirmDialog.defaultMessage'); }
  get displayConfirmText(): string { return this.confirmText() || this.t.instant('confirmDialog.confirm'); }
  get displayCancelText(): string { return this.cancelText() || this.t.instant('confirmDialog.cancel'); }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.close();
  }
}
