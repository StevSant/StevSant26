import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { WebVitalsService } from './web-vitals.service';

describe('WebVitalsService', () => {
  let service: WebVitalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(WebVitalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => service.init()).not.toThrow();
  });

  it('should return empty metrics before init', () => {
    expect(service.getMetrics().size).toBe(0);
  });
});
