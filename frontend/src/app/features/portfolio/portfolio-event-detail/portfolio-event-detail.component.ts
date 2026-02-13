import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioContentSectionsComponent } from '../components/portfolio-content-sections/portfolio-content-sections.component';
import { ImageGalleryComponent } from '@shared/components/image-gallery/image-gallery.component';
import { Event, Project, Document } from '@core/models';

@Component({
  selector: 'app-portfolio-event-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioContentSectionsComponent, ImageGalleryComponent],
  templateUrl: './portfolio-event-detail.component.html',
})
export class PortfolioEventDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);

  event = signal<Event | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  relatedProjects = signal<Project[]>([]);
  documents = signal<Document[]>([]);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const evt = this.data.getEventById(id);
      if (evt) {
        this.event.set(evt);
        this.images.set(this.data.getAllImages('event', id));
        this.relatedProjects.set(this.data.getProjectsBySource('event', id));
        this.documents.set(this.data.getDocuments('event', id));
        this.updateSeo(evt);
      }
    }
  }

  private updateSeo(evt: Event): void {
    const name = this.data.getEntityTranslation(evt, 'name');
    const description = this.data.getEntityTranslation(evt, 'description');
    const siteUrl = this.seoService.getSiteUrl();
    const pageUrl = `${siteUrl}/events/${evt.id}`;
    const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';
    const imageUrl = this.data.getFirstImageUrl('event', evt.id);

    this.seoService.updateMeta({
      title: name,
      description: description || undefined,
      image: imageUrl || undefined,
      url: pageUrl,
      type: 'article',
      locale,
    });

    this.seoService.setJsonLd([
      this.seoService.buildEventSchema({
        name,
        description: description || undefined,
        startDate: evt.assisted_at,
        url: pageUrl,
        image: imageUrl,
      }),
      this.seoService.buildBreadcrumbSchema([
        { name: this.translate.instant('seo.home.title'), url: siteUrl },
        { name: this.translate.instant('seo.events.title'), url: `${siteUrl}/events` },
        { name, url: pageUrl },
      ]),
    ]);
  }
}
