import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ProgressiveImageComponent } from './progressive-image.component';

@Component({
  standalone: true,
  imports: [ProgressiveImageComponent],
  template: `<app-progressive-image src="https://example.com/img.jpg" alt="Test" />`,
})
class TestHostComponent {}

describe('ProgressiveImageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const progressiveImage = fixture.nativeElement.querySelector('app-progressive-image');
    expect(progressiveImage).toBeTruthy();
  });

  it('should have loaded signal start as false', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0].componentInstance as ProgressiveImageComponent;
    expect(component.loaded()).toBe(false);
  });

  it('should set loaded to true when onImageLoad is called', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0].componentInstance as ProgressiveImageComponent;
    component.onImageLoad();
    expect(component.loaded()).toBe(true);
  });
});
