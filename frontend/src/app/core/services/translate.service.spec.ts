import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, ApplicationRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TranslateService } from './translate.service';
import { LoggerService } from './logger.service';

const MOCK_EN_TRANSLATIONS = {
  common: { save: 'Save', cancel: 'Cancel' },
  greeting: 'Hello {{ name }}',
};

const MOCK_ES_TRANSLATIONS = {
  common: { save: 'Guardar', cancel: 'Cancelar' },
  greeting: 'Hola {{ name }}',
};

describe('TranslateService', () => {
  let service: TranslateService;
  let httpMock: HttpTestingController;
  let loggerWarnSpy: ReturnType<typeof vi.spyOn>;
  let appRefTickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // Use SSR platform so initializeLanguage() skips localStorage/navigator
        // and does NOT trigger an HTTP request in the constructor.
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TranslateService);

    // Spy on real instances after injection to avoid breaking Angular internals
    loggerWarnSpy = vi.spyOn(TestBed.inject(LoggerService), 'warn');
    appRefTickSpy = vi.spyOn(TestBed.inject(ApplicationRef), 'tick').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('instant() returns the key when no translations are loaded', () => {
    expect(service.instant('common.save')).toBe('common.save');
  });

  it('instant() returns the key for a missing nested path', () => {
    expect(service.instant('does.not.exist')).toBe('does.not.exist');
  });

  it('after loading translations, instant() returns the correct value for a top-level key', async () => {
    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    expect(service.instant('greeting')).toBe('Hello {{ name }}');
  });

  it('after loading translations, instant() returns the correct value for a nested key', async () => {
    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    expect(service.instant('common.save')).toBe('Save');
    expect(service.instant('common.cancel')).toBe('Cancel');
  });

  it('instant() with params interpolates {{ param }} syntax', async () => {
    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    expect(service.instant('greeting', { name: 'Bryan' })).toBe('Hello Bryan');
  });

  it('instant() returns the key when the resolved value is not a string (object node)', async () => {
    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    // 'common' resolves to an object, not a string
    expect(service.instant('common')).toBe('common');
  });

  it('setLanguage() updates the currentLang signal', async () => {
    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    expect(service.currentLang()).toBe('en');
  });

  it('setLanguage() with an unsupported language falls back to the default and warns', async () => {
    const promise = service.setLanguage('fr');
    // Fallback triggers a load of 'es' if not yet cached
    const pending = httpMock.match('/assets/i18n/es.json');
    if (pending.length) {
      pending[0].flush(MOCK_ES_TRANSLATIONS);
    }
    await promise;

    expect(loggerWarnSpy).toHaveBeenCalledWith(expect.stringContaining('"fr" is not supported'));
    expect(service.currentLang()).toBe('es');
  });

  it('setLanguage() does not reload already-cached translations', async () => {
    // Load 'en' once
    const first = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await first;

    // Load 'en' again — no new HTTP request should be made
    await service.setLanguage('en');
    httpMock.expectNone('/assets/i18n/en.json');
  });

  it('get() returns a computed signal that reflects the current translation', async () => {
    const computed = service.get('common.save');
    // No translations yet
    expect(computed()).toBe('common.save');

    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    expect(computed()).toBe('Save');
  });

  it('loading signal is false after translations are loaded', async () => {
    expect(service.loading()).toBe(false);

    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    expect(service.loading()).toBe(false);
  });

  it('version signal increments when new translations are loaded', async () => {
    const initialVersion = service.version();

    const promise = service.setLanguage('en');
    httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_EN_TRANSLATIONS);
    await promise;

    expect(service.version()).toBe(initialVersion + 1);
  });

  it('supportedLanguages contains "es" and "en"', () => {
    expect(service.supportedLanguages).toContain('es');
    expect(service.supportedLanguages).toContain('en');
  });

  it('defaultLanguage is "es"', () => {
    expect(service.defaultLanguage).toBe('es');
  });
});
