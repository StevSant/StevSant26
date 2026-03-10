import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ThemeService } from './theme.service';
import { AVAILABLE_THEMES } from './theme.constants';
import { ThemeId } from './theme.types';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSetItem: ReturnType<typeof vi.spyOn>;
  let localStorageGetItem: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorageSetItem = vi.spyOn(Storage.prototype, 'setItem');
    localStorageGetItem = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(ThemeService);
    // Flush the constructor effect so theme is applied immediately
    TestBed.flushEffects();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up theme classes added to documentElement during tests
    AVAILABLE_THEMES.forEach((t) => document.documentElement.classList.remove(`theme-${t.id}`));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('has 4 available themes', () => {
    expect(service.themes).toHaveLength(4);
  });

  it('AVAILABLE_THEMES includes all expected theme IDs', () => {
    const ids = service.themes.map((t) => t.id);
    expect(ids).toContain('dark-elegant');
    expect(ids).toContain('light-elegant');
    expect(ids).toContain('midnight-blue');
    expect(ids).toContain('warm-sepia');
  });

  it('default theme is "dark-elegant" when localStorage has no saved theme', () => {
    expect(service.currentTheme()).toBe('dark-elegant');
  });

  it('loads the saved theme from localStorage on creation', () => {
    vi.restoreAllMocks();
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('midnight-blue');
    vi.spyOn(Storage.prototype, 'setItem');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const freshService = TestBed.inject(ThemeService);
    TestBed.flushEffects();

    expect(freshService.currentTheme()).toBe('midnight-blue');
  });

  it('setTheme() updates currentTheme signal', () => {
    service.setTheme('warm-sepia');
    expect(service.currentTheme()).toBe('warm-sepia');
  });

  it('setTheme() applies the theme class to document.documentElement', () => {
    service.setTheme('midnight-blue');
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('theme-midnight-blue')).toBe(true);
  });

  it('setTheme() removes the previous theme class when switching', () => {
    service.setTheme('dark-elegant');
    TestBed.flushEffects();
    service.setTheme('light-elegant');
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('theme-dark-elegant')).toBe(false);
    expect(document.documentElement.classList.contains('theme-light-elegant')).toBe(true);
  });

  it('cycleTheme() moves to the next theme in order', () => {
    service.setTheme('dark-elegant');
    service.cycleTheme();
    expect(service.currentTheme()).toBe('light-elegant');
  });

  it('cycleTheme() wraps around from the last theme to the first', () => {
    const lastThemeId = AVAILABLE_THEMES[AVAILABLE_THEMES.length - 1].id;
    const firstThemeId = AVAILABLE_THEMES[0].id;

    service.setTheme(lastThemeId);
    service.cycleTheme();

    expect(service.currentTheme()).toBe(firstThemeId);
  });

  it('cycleTheme() cycles through all themes in sequence', () => {
    service.setTheme('dark-elegant');

    for (let i = 0; i < AVAILABLE_THEMES.length; i++) {
      expect(service.currentTheme()).toBe(AVAILABLE_THEMES[i].id);
      service.cycleTheme();
    }

    // After a full cycle we should be back to the first
    expect(service.currentTheme()).toBe(AVAILABLE_THEMES[0].id);
  });

  it('toggleDarkLight() switches from dark-elegant to light-elegant', () => {
    service.setTheme('dark-elegant');
    service.toggleDarkLight();
    expect(service.currentTheme()).toBe('light-elegant');
  });

  it('toggleDarkLight() switches from light-elegant to dark-elegant', () => {
    service.setTheme('light-elegant');
    service.toggleDarkLight();
    expect(service.currentTheme()).toBe('dark-elegant');
  });

  it('toggleDarkLight() switches to dark-elegant when a non-dark theme is active', () => {
    service.setTheme('midnight-blue');
    service.toggleDarkLight();
    expect(service.currentTheme()).toBe('dark-elegant');
  });

  it('theme is persisted to localStorage when changed', () => {
    service.setTheme('warm-sepia');
    TestBed.flushEffects();
    expect(localStorageSetItem).toHaveBeenCalledWith('portfolio-theme', 'warm-sepia');
  });

  it('theme is persisted to localStorage on initial load', () => {
    TestBed.flushEffects();
    expect(localStorageSetItem).toHaveBeenCalledWith('portfolio-theme', expect.any(String));
  });
});
