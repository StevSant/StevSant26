import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal, PLATFORM_ID } from '@angular/core';
import { PortfolioSkillsComponent } from './portfolio-skills.component';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';

class MockPortfolioDataService {
  loading = signal(false);
  profile = signal<any>(null);
  avatarUrl = signal<string | null>(null);
  bannerUrl = signal<string | null>(null);
  projects = signal<any[]>([]);
  experiences = signal<any[]>([]);
  educations = signal<any[]>([]);
  competitions = signal<any[]>([]);
  events = signal<any[]>([]);
  skillCategories = signal<any[]>([]);
  cvDocuments = signal<any[]>([]);
  initialize = vi.fn().mockResolvedValue(undefined);
  getEntityTranslation = vi.fn().mockReturnValue('');
  getSkillUsages = vi.fn().mockReturnValue([]);
  getAllSkillNames = vi.fn().mockReturnValue([]);
  getGroupedSkillNamesBySourceType = vi.fn().mockReturnValue([]);
  getSkillName = vi.fn().mockReturnValue('');
  getSubProjects = vi.fn().mockReturnValue([]);
  getCategoryName = vi.fn().mockReturnValue('');
  getSkillDescription = vi.fn().mockReturnValue('');
}

class MockSeoService {
  updateMeta = vi.fn();
  setJsonLd = vi.fn();
  getSiteUrl = vi.fn().mockReturnValue('https://test.com');
  buildBreadcrumbSchema = vi.fn().mockReturnValue({});
}

class MockTranslateService {
  currentLang = vi.fn().mockReturnValue('es');
  instant = vi.fn().mockReturnValue('');
  version = vi.fn().mockReturnValue(0);
}

describe('PortfolioSkillsComponent', () => {
  let mockDataService: MockPortfolioDataService;

  beforeEach(async () => {
    mockDataService = new MockPortfolioDataService();

    await TestBed.configureTestingModule({
      imports: [PortfolioSkillsComponent],
      providers: [
        { provide: PortfolioDataService, useValue: mockDataService },
        { provide: SeoService, useClass: MockSeoService },
        { provide: TranslateService, useClass: MockTranslateService },
        // Use 'browser' platform so IntersectionObserver branch runs in test env
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('getLevelPercentage(3) returns 60', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    expect(fixture.componentInstance.getLevelPercentage(3)).toBe(60);
  });

  it('getLevelPercentage(5) returns 100', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    expect(fixture.componentInstance.getLevelPercentage(5)).toBe(100);
  });

  it('getLevelPercentage(0) returns 0', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    expect(fixture.componentInstance.getLevelPercentage(0)).toBe(0);
  });

  it('filteredCategories returns all categories when no filters are active', () => {
    mockDataService.skillCategories.set([
      { id: 1, translations: [], skills: [{ id: 10, translations: [] }] },
      { id: 2, translations: [], skills: [{ id: 20, translations: [] }] },
    ]);

    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    const component = fixture.componentInstance;

    expect(component.filteredCategories().length).toBe(2);
  });

  it('filteredCategories returns empty array when skillCategories is empty', () => {
    mockDataService.skillCategories.set([]);

    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    expect(fixture.componentInstance.filteredCategories()).toEqual([]);
  });

  it('onSearchChange updates the searchText signal', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    const component = fixture.componentInstance;

    expect(component.searchText()).toBe('');
    component.onSearchChange('typescript');
    expect(component.searchText()).toBe('typescript');
  });

  it('onCategoryFilterChange updates the selectedCategory signal', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    const component = fixture.componentInstance;

    expect(component.selectedCategory()).toBe('');
    component.onCategoryFilterChange('42');
    expect(component.selectedCategory()).toBe('42');
  });

  it('isSingleCategoryView is false when no category is selected', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    expect(fixture.componentInstance.isSingleCategoryView()).toBe(false);
  });

  it('isSingleCategoryView is true when a category is selected', () => {
    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    const component = fixture.componentInstance;

    component.onCategoryFilterChange('5');
    expect(component.isSingleCategoryView()).toBe(true);
  });

  it('filteredCategories filters to only the selected category by id', () => {
    mockDataService.skillCategories.set([
      { id: 1, translations: [], skills: [] },
      { id: 2, translations: [], skills: [] },
    ]);

    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    const component = fixture.componentInstance;

    component.onCategoryFilterChange('2');
    const filtered = component.filteredCategories();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe(2);
  });

  it('flatSkills returns a flat array of all skills in filtered categories', () => {
    mockDataService.skillCategories.set([
      { id: 1, translations: [], skills: [{ id: 10 }, { id: 11 }] },
      { id: 2, translations: [], skills: [{ id: 20 }] },
    ]);

    const fixture = TestBed.createComponent(PortfolioSkillsComponent);
    expect(fixture.componentInstance.flatSkills().length).toBe(3);
  });
});
