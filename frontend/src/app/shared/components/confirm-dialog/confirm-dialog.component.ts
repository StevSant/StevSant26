import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  // Signal inputs
  title = input<string>('¿Estás seguro?');
  message = input<string>('Esta acción no se puede deshacer.');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  variant = input<'danger' | 'warning' | 'info'>('danger');

  // Signal outputs
  confirmed = output<void>();
  cancelled = output<void>();

  isOpen = signal(false);

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
