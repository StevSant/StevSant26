import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { PortfolioHomeComponent } from './portfolio-home.component';
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

describe('PortfolioHomeComponent', () => {
  let mockDataService: MockPortfolioDataService;

  beforeEach(async () => {
    mockDataService = new MockPortfolioDataService();

    await TestBed.configureTestingModule({
      imports: [PortfolioHomeComponent],
      providers: [
        { provide: PortfolioDataService, useValue: mockDataService },
        { provide: SeoService, useClass: MockSeoService },
        { provide: TranslateService, useClass: MockTranslateService },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('pinnedProjects filters to only pinned, non-archived projects (max 3)', () => {
    mockDataService.projects.set([
      { id: 1, is_pinned: true, is_archived: false },
      { id: 2, is_pinned: false, is_archived: false },
      { id: 3, is_pinned: true, is_archived: true },
      { id: 4, is_pinned: true, is_archived: false },
      { id: 5, is_pinned: true, is_archived: false },
      { id: 6, is_pinned: true, is_archived: false },
    ]);

    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    const component = fixture.componentInstance;

    const pinned = component.pinnedProjects();
    // Should exclude non-pinned (id 2), archived (id 3), and cap at 3
    expect(pinned.length).toBe(3);
    expect(pinned.every((p: any) => p.is_pinned && !p.is_archived)).toBe(true);
  });

  it('pinnedProjects returns empty array when no projects match', () => {
    mockDataService.projects.set([
      { id: 1, is_pinned: false, is_archived: false },
      { id: 2, is_pinned: true, is_archived: true },
    ]);

    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    expect(fixture.componentInstance.pinnedProjects()).toEqual([]);
  });

  it('openImageModal sets modal state correctly', () => {
    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    const component = fixture.componentInstance;

    component.openImageModal({ url: 'https://example.com/img.png', alt: 'Test image' });

    expect(component.showImageModal()).toBe(true);
    expect(component.modalImageUrl()).toBe('https://example.com/img.png');
    expect(component.modalImageAlt()).toBe('Test image');
  });

  it('closeImageModal resets modal state', () => {
    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    const component = fixture.componentInstance;

    component.openImageModal({ url: 'https://example.com/img.png', alt: 'Test' });
    component.closeImageModal();

    expect(component.showImageModal()).toBe(false);
    expect(component.modalImageUrl()).toBeNull();
  });

  it('yearsOfExperience returns 0 when experiences array is empty', () => {
    mockDataService.experiences.set([]);

    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    expect(fixture.componentInstance.yearsOfExperience()).toBe(0);
  });

  it('yearsOfExperience returns 0 when all experiences have no start_date', () => {
    mockDataService.experiences.set([
      { id: 1, start_date: null },
      { id: 2, start_date: null },
    ]);

    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    expect(fixture.componentInstance.yearsOfExperience()).toBe(0);
  });
});
