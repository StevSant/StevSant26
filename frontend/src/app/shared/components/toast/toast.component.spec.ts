import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ToastComponent } from './toast.component';
import { ToastService } from '@core/services/toast.service';

describe('ToastComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should inject ToastService', () => {
    const service = TestBed.inject(ToastService);
    expect(service).toBeTruthy();
  });
});
