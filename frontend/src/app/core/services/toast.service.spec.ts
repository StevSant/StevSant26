import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a success toast', () => {
    service.success('Operation completed');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
    expect(service.toasts()[0].message).toBe('Operation completed');
  });

  it('should add an error toast', () => {
    service.error('Something failed');
    expect(service.toasts()[0].type).toBe('error');
  });

  it('should add an info toast', () => {
    service.info('FYI');
    expect(service.toasts()[0].type).toBe('info');
  });

  it('should dismiss a toast by id', () => {
    service.success('Test');
    const id = service.toasts()[0].id;
    service.dismiss(id);
    expect(service.toasts().length).toBe(0);
  });

  it('should limit to 3 toasts max', () => {
    service.success('One');
    service.success('Two');
    service.success('Three');
    service.success('Four');
    expect(service.toasts().length).toBe(3);
    expect(service.toasts()[0].message).toBe('Two');
  });

  it('should auto-dismiss after duration', () => {
    vi.useFakeTimers();
    service.success('Auto dismiss', 1000);
    expect(service.toasts().length).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(service.toasts().length).toBe(0);
    vi.useRealTimers();
  });
});
