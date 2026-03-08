import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { PortfolioNotFoundComponent } from './portfolio-not-found.component';
import { TranslateService } from '@core/services/translate.service';

describe('PortfolioNotFoundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioNotFoundComponent],
      providers: [
        provideRouter([]),
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string) => key,
            version: () => 0,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PortfolioNotFoundComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 404 text', () => {
    const fixture = TestBed.createComponent(PortfolioNotFoundComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('404');
  });

  it('should have a routerLink to "/"', () => {
    const fixture = TestBed.createComponent(PortfolioNotFoundComponent);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[href="/"]');
    expect(link).toBeTruthy();
  });
});
