import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private maxToasts = 3;
  private defaultDuration = 4000;

  toasts = signal<Toast[]>([]);

  success(message: string, duration = this.defaultDuration): void {
    this.add('success', message, duration);
  }

  error(message: string, duration = this.defaultDuration): void {
    this.add('error', message, duration);
  }

  info(message: string, duration = this.defaultDuration): void {
    this.add('info', message, duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private add(type: Toast['type'], message: string, duration: number): void {
    const id = this.nextId++;
    const toast: Toast = { id, type, message };

    this.toasts.update((list) => {
      const next = [...list, toast];
      return next.length > this.maxToasts ? next.slice(-this.maxToasts) : next;
    });

    setTimeout(() => this.dismiss(id), duration);
  }
}
