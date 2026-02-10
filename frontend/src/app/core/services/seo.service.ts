import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { APP_NAME } from '@shared/config/app_name';
import { environment } from '../../../environments/environment';
import { SeoMetaOptions, JsonLdSchema } from './seo.types';
import {
  buildPersonSchema as _buildPersonSchema,
  buildWebSiteSchema as _buildWebSiteSchema,
  buildBreadcrumbSchema as _buildBreadcrumbSchema,
  buildProjectSchema as _buildProjectSchema,
  buildExperienceSchema as _buildExperienceSchema,
  buildEducationSchema as _buildEducationSchema,
  buildEventSchema as _buildEventSchema,
} from './json-ld.builder';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private defaultTitle = APP_NAME;
  private defaultDescription = 'Professional portfolio showcasing projects, skills, and experience.';
  private siteUrl = environment.siteUrl;

  /**
   * Update page title and meta tags for SEO / Open Graph / Twitter Cards
   */
  updateMeta(options: SeoMetaOptions): void {
    const title = options.title
      ? `${options.title} | ${this.defaultTitle}`
      : this.defaultTitle;
    const description = options.description || this.defaultDescription;
    const url = options.url || this.siteUrl;

    this.titleService.setTitle(title);

    // Standard meta
    this.meta.updateTag({ name: 'description', content: description });

    if (options.keywords) {
      this.meta.updateTag({ name: 'keywords', content: options.keywords });
    }

    if (options.author) {
      this.meta.updateTag({ name: 'author', content: options.author });
    }

    this.meta.updateTag({ name: 'robots', content: options.robots || 'index, follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: options.type || 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: this.defaultTitle });
    this.meta.updateTag({ property: 'og:locale', content: options.locale || 'en_US' });

    if (options.image) {
      this.meta.updateTag({ property: 'og:image', content: options.image });
      this.meta.updateTag({ property: 'og:image:alt', content: title });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: options.image ? 'summary_large_image' : 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:url', content: url });

    if (options.image) {
      this.meta.updateTag({ name: 'twitter:image', content: options.image });
      this.meta.updateTag({ name: 'twitter:image:alt', content: title });
    }

    // Canonical URL
    this.setCanonicalUrl(url);
  }

  /**
   * Set canonical URL link tag
   */
  private setCanonicalUrl(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * Update the HTML lang attribute
   */
  updateLang(lang: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.documentElement.lang = lang;
  }

  /**
   * Add JSON-LD structured data to the page
   */
  setJsonLd(schema: JsonLdSchema | JsonLdSchema[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing JSON-LD scripts
    const existing = this.document.querySelectorAll('script[type="application/ld+json"].seo-jsonld');
    existing.forEach((el) => el.remove());

    const schemas = Array.isArray(schema) ? schema : [schema];
    for (const s of schemas) {
      const script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.classList.add('seo-jsonld');
      script.textContent = JSON.stringify(s);
      this.document.head.appendChild(script);
    }
  }

  /**
   * Build a Person JSON-LD schema
   */
  buildPersonSchema(options: {
    name: string;
    email?: string | null;
    url?: string;
    image?: string | null;
    jobTitle?: string;
    sameAs?: string[];
  }): JsonLdSchema {
    return _buildPersonSchema(this.siteUrl, options);
  }

  /**
   * Build a WebSite JSON-LD schema
   */
  buildWebSiteSchema(name: string): JsonLdSchema {
    return _buildWebSiteSchema(this.siteUrl, name);
  }

  /**
   * Build a BreadcrumbList JSON-LD schema
   */
  buildBreadcrumbSchema(items: { name: string; url: string }[]): JsonLdSchema {
    return _buildBreadcrumbSchema(items);
  }

  /**
   * Build a CreativeWork (Project) JSON-LD schema
   */
  buildProjectSchema(options: {
    name: string;
    description?: string;
    url?: string;
    image?: string | null;
    dateCreated?: string | null;
    author?: string;
    keywords?: string[];
  }): JsonLdSchema {
    return _buildProjectSchema(options);
  }

  /**
   * Build an Organization/Experience JSON-LD schema
   */
  buildExperienceSchema(options: {
    personName: string;
    roleName: string;
    companyName: string;
    startDate?: string | null;
    endDate?: string | null;
    description?: string;
  }): JsonLdSchema {
    return _buildExperienceSchema(options);
  }

  /**
   * Build an EducationalOccupationalCredential JSON-LD
   */
  buildEducationSchema(options: {
    name: string;
    institution: string;
    startDate?: string | null;
    endDate?: string | null;
    description?: string;
  }): JsonLdSchema {
    return _buildEducationSchema(options);
  }

  /**
   * Build an Event JSON-LD schema
   */
  buildEventSchema(options: {
    name: string;
    description?: string;
    startDate?: string | null;
    url?: string;
    image?: string | null;
  }): JsonLdSchema {
    return _buildEventSchema(options);
  }

  /**
   * Get the base site URL
   */
  getSiteUrl(): string {
    return this.siteUrl;
  }

  /**
   * Reset to default meta tags
   */
  resetMeta(): void {
    this.updateMeta({});
    this.removeJsonLd();
  }

  /**
   * Remove all JSON-LD scripts
   */
  private removeJsonLd(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const existing = this.document.querySelectorAll('script[type="application/ld+json"].seo-jsonld');
    existing.forEach((el) => el.remove());
  }
}
