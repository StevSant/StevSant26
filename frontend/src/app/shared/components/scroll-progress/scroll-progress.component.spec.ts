import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ScrollProgressComponent } from './scroll-progress.component';

describe('ScrollProgressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollProgressComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ScrollProgressComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
