import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PortfolioDataService } from './portfolio-data.service';
import { CrudService } from '@core/services/crud.service';
import { TranslationDataService } from '@core/services/translation-data.service';
import { LanguageService } from '@core/services/language.service';

class MockQuery {
  private result = { data: [] as any[] };

  select = vi.fn().mockReturnThis();
  eq = vi.fn().mockReturnThis();
  order = vi.fn().mockReturnThis();
  limit = vi.fn().mockReturnThis();
  single = vi.fn().mockReturnThis();

  then<TResult1 = { data: any[] }, TResult2 = never>(
    onfulfilled?: ((value: { data: any[] }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.result).then(onfulfilled, onrejected);
  }
}

class MockCrudService {
  private calls = new Map<string, number>();
  from = vi.fn((table: string) => {
    this.calls.set(table, (this.calls.get(table) ?? 0) + 1);
    return new MockQuery();
  });

  getCallCount(table: string): number {
    return this.calls.get(table) ?? 0;
  }
}

class MockTranslationDataService {
  getImagesBySourceType = vi.fn().mockResolvedValue({ data: [] });
}

class MockLanguageService {
  currentLanguageCode = signal('es');
}

describe('PortfolioDataService', () => {
  let service: PortfolioDataService;
  let mockCrudService: MockCrudService;

  beforeEach(() => {
    mockCrudService = new MockCrudService();

    TestBed.configureTestingModule({
      providers: [
        PortfolioDataService,
        { provide: CrudService, useValue: mockCrudService },
        { provide: TranslationDataService, useClass: MockTranslationDataService },
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(PortfolioDataService);
  });

  it('runs initialization only once for concurrent callers', async () => {
    const first = service.initialize();
    const second = service.initialize();

    await Promise.all([first, second]);

    expect(mockCrudService.getCallCount('content_section')).toBe(1);
  });
});
