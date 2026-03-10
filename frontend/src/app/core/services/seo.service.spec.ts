import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SeoService } from './seo.service';
import { environment } from '../../../environments/environment';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    doc = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updateMeta() sets the page title with the app name appended', () => {
    service.updateMeta({ title: 'Projects' });
    expect(titleService.getTitle()).toContain('Projects');
    expect(titleService.getTitle()).toContain('StevSant');
  });

  it('updateMeta() uses the app name alone when no title is provided', () => {
    service.updateMeta({});
    expect(titleService.getTitle()).toBe('StevSant');
  });

  it('updateMeta() sets the description meta tag', () => {
    service.updateMeta({ description: 'A test description' });
    const tag = metaService.getTag('name="description"');
    expect(tag?.content).toBe('A test description');
  });

  it('updateMeta() falls back to the default description when none is provided', () => {
    service.updateMeta({});
    const tag = metaService.getTag('name="description"');
    expect(tag?.content).toBeTruthy();
    expect(tag?.content.length).toBeGreaterThan(0);
  });

  it('updateMeta() sets og:title tag', () => {
    service.updateMeta({ title: 'About' });
    const tag = metaService.getTag('property="og:title"');
    expect(tag?.content).toContain('About');
  });

  it('updateMeta() sets og:description tag', () => {
    service.updateMeta({ description: 'OG description' });
    const tag = metaService.getTag('property="og:description"');
    expect(tag?.content).toBe('OG description');
  });

  it('updateMeta() sets og:type tag', () => {
    service.updateMeta({ type: 'article' });
    const tag = metaService.getTag('property="og:type"');
    expect(tag?.content).toBe('article');
  });

  it('updateMeta() defaults og:type to "website"', () => {
    service.updateMeta({});
    const tag = metaService.getTag('property="og:type"');
    expect(tag?.content).toBe('website');
  });

  it('updateMeta() sets twitter:title tag', () => {
    service.updateMeta({ title: 'Contact' });
    const tag = metaService.getTag('name="twitter:title"');
    expect(tag?.content).toContain('Contact');
  });

  it('updateMeta() sets twitter:description tag', () => {
    service.updateMeta({ description: 'Twitter desc' });
    const tag = metaService.getTag('name="twitter:description"');
    expect(tag?.content).toBe('Twitter desc');
  });

  it('updateMeta() sets the canonical link element', () => {
    service.updateMeta({ url: 'https://stevsant.vercel.app/projects' });
    const canonical = doc.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute('href')).toBe('https://stevsant.vercel.app/projects');
  });

  it('setJsonLd() appends a script element of type application/ld+json to the head', () => {
    service.setJsonLd({ '@type': 'WebSite', name: 'Test' });
    const scripts = doc.querySelectorAll('script[type="application/ld+json"].seo-jsonld');
    expect(scripts.length).toBeGreaterThan(0);
  });

  it('setJsonLd() replaces previous JSON-LD scripts on subsequent calls', () => {
    service.setJsonLd({ '@type': 'WebSite', name: 'First' });
    service.setJsonLd({ '@type': 'WebSite', name: 'Second' });
    const scripts = doc.querySelectorAll('script[type="application/ld+json"].seo-jsonld');
    expect(scripts.length).toBe(1);
    expect(scripts[0].textContent).toContain('Second');
  });

  it('setJsonLd() accepts an array and appends one script per schema', () => {
    service.setJsonLd([{ '@type': 'WebSite' }, { '@type': 'Person', name: 'Bryan' }]);
    const scripts = doc.querySelectorAll('script[type="application/ld+json"].seo-jsonld');
    expect(scripts.length).toBe(2);
  });

  it('buildPersonSchema() returns a schema with @type Person', () => {
    const schema = service.buildPersonSchema({ name: 'Bryan Menoscal' });
    expect(schema['@type']).toBe('Person');
    expect(schema['name']).toBe('Bryan Menoscal');
  });

  it('buildPersonSchema() includes email with mailto: prefix when provided', () => {
    const schema = service.buildPersonSchema({ name: 'Bryan', email: 'test@example.com' });
    expect(schema['email']).toBe('mailto:test@example.com');
  });

  it('buildWebSiteSchema() returns a schema with @type WebSite', () => {
    const schema = service.buildWebSiteSchema('StevSant');
    expect(schema['@type']).toBe('WebSite');
    expect(schema['name']).toBe('StevSant');
    expect(schema['url']).toBe(environment.siteUrl);
  });

  it('buildBreadcrumbSchema() returns a schema with @type BreadcrumbList', () => {
    const schema = service.buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Projects', url: '/projects' },
    ]);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(Array.isArray(schema['itemListElement'])).toBe(true);
    const items = schema['itemListElement'] as Array<{ position: number; name: string }>;
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[1].name).toBe('Projects');
  });

  it('resetMeta() removes all JSON-LD scripts from the document', () => {
    service.setJsonLd({ '@type': 'WebSite', name: 'Test' });
    service.resetMeta();
    const scripts = doc.querySelectorAll('script[type="application/ld+json"].seo-jsonld');
    expect(scripts.length).toBe(0);
  });

  it('getSiteUrl() returns the configured site URL', () => {
    expect(service.getSiteUrl()).toBe(environment.siteUrl);
  });

  it('updateLang() sets document.documentElement.lang', () => {
    service.updateLang('en');
    expect(doc.documentElement.lang).toBe('en');
  });
});
