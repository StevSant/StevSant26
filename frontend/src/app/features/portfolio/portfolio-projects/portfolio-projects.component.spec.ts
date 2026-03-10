import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { PortfolioProjectsComponent } from './portfolio-projects.component';
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

describe('PortfolioProjectsComponent', () => {
  let mockDataService: MockPortfolioDataService;

  beforeEach(async () => {
    mockDataService = new MockPortfolioDataService();

    await TestBed.configureTestingModule({
      imports: [PortfolioProjectsComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioDataService, useValue: mockDataService },
        { provide: SeoService, useClass: MockSeoService },
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PortfolioProjectsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('filteredProjects returns all projects when no filters are set', () => {
    mockDataService.projects.set([
      { id: 1, translations: [] },
      { id: 2, translations: [] },
      { id: 3, translations: [] },
    ]);

    const fixture = TestBed.createComponent(PortfolioProjectsComponent);
    const component = fixture.componentInstance;

    expect(component.filteredProjects().length).toBe(3);
  });

  it('filteredProjects returns empty array when projects signal is empty', () => {
    mockDataService.projects.set([]);

    const fixture = TestBed.createComponent(PortfolioProjectsComponent);
    expect(fixture.componentInstance.filteredProjects()).toEqual([]);
  });

  it('onSearchChange updates the searchText signal', () => {
    const fixture = TestBed.createComponent(PortfolioProjectsComponent);
    const component = fixture.componentInstance;

    expect(component.searchText()).toBe('');
    component.onSearchChange('angular');
    expect(component.searchText()).toBe('angular');
  });

  it('onSkillFilterChange updates the selectedSkill signal', () => {
    const fixture = TestBed.createComponent(PortfolioProjectsComponent);
    const component = fixture.componentInstance;

    expect(component.selectedSkill()).toBe('');
    component.onSkillFilterChange('TypeScript');
    expect(component.selectedSkill()).toBe('TypeScript');
  });

  it('filteredProjects filters by search text using getEntityTranslation', () => {
    mockDataService.projects.set([
      { id: 1, translations: [] },
      { id: 2, translations: [] },
    ]);

    // First project title matches, second does not
    mockDataService.getEntityTranslation.mockImplementation((_entity: any, field: string) => {
      if (_entity.id === 1 && field === 'title') return 'Angular Portfolio';
      if (_entity.id === 1 && field === 'description') return '';
      if (_entity.id === 2 && field === 'title') return 'React Dashboard';
      if (_entity.id === 2 && field === 'description') return '';
      return '';
    });

    const fixture = TestBed.createComponent(PortfolioProjectsComponent);
    const component = fixture.componentInstance;

    component.onSearchChange('angular');
    const results = component.filteredProjects();
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(1);
  });

  it('onSearchChange then onSkillFilterChange can be cleared independently', () => {
    const fixture = TestBed.createComponent(PortfolioProjectsComponent);
    const component = fixture.componentInstance;

    component.onSearchChange('test');
    component.onSkillFilterChange('CSS');
    expect(component.searchText()).toBe('test');
    expect(component.selectedSkill()).toBe('CSS');

    component.onSearchChange('');
    expect(component.searchText()).toBe('');
    expect(component.selectedSkill()).toBe('CSS');
  });
});
