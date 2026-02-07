import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_NAME } from '@shared/config/app_name';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private titleService = inject(Title);

  private defaultTitle = APP_NAME;
  private defaultDescription = 'Professional portfolio showcasing projects, skills, and experience.';

  /**
   * Update page title and meta tags for SEO / Open Graph / Twitter Cards
   */
  updateMeta(options: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    const title = options.title
      ? `${options.title} | ${this.defaultTitle}`
      : this.defaultTitle;
    const description = options.description || this.defaultDescription;

    this.titleService.setTitle(title);

    // Standard meta
    this.meta.updateTag({ name: 'description', content: description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: options.type || 'website' });

    if (options.url) {
      this.meta.updateTag({ property: 'og:url', content: options.url });
    }
    if (options.image) {
      this.meta.updateTag({ property: 'og:image', content: options.image });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (options.image) {
      this.meta.updateTag({ name: 'twitter:image', content: options.image });
    }
  }

  /**
   * Reset to default meta tags
   */
  resetMeta(): void {
    this.updateMeta({});
  }
}
