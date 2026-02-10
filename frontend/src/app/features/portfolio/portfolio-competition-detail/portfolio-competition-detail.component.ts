import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioContentSectionsComponent } from '../components/portfolio-content-sections/portfolio-content-sections.component';
import { ImageGalleryComponent } from '@shared/components/image-gallery/image-gallery.component';
import { Competition } from '@core/models';

@Component({
  selector: 'app-portfolio-competition-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioContentSectionsComponent, ImageGalleryComponent],
  templateUrl: './portfolio-competition-detail.component.html',
})
export class PortfolioCompetitionDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);

  competition = signal<Competition | null>(null);
  images = signal<import('@core/models').Image[]>([]);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const comp = this.data.getCompetitionById(id);
      if (comp) {
        this.competition.set(comp);
        this.images.set(this.data.getAllImages('competition', id));
        this.updateSeo(comp);
      }
    }
  }

  private updateSeo(comp: Competition): void {
    const name = this.data.getEntityTranslation(comp, 'name');
    const description = this.data.getEntityTranslation(comp, 'description');
    const siteUrl = this.seoService.getSiteUrl();
    const pageUrl = `${siteUrl}/competitions/${comp.id}`;
    const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';
    const imageUrl = this.data.getFirstImageUrl('competition', comp.id);
    const skillNames = this.data.getSkillUsages('competition', comp.id).map(u => this.data.getSkillName(u));

    this.seoService.updateMeta({
      title: name,
      description: description || undefined,
      image: imageUrl || undefined,
      url: pageUrl,
      type: 'article',
      locale,
      keywords: skillNames.length ? skillNames.join(', ') : undefined,
    });

    this.seoService.setJsonLd([
      this.seoService.buildEventSchema({
        name,
        description: description || undefined,
        startDate: comp.date,
        url: pageUrl,
        image: imageUrl,
      }),
      this.seoService.buildBreadcrumbSchema([
        { name: this.translate.instant('seo.home.title'), url: siteUrl },
        { name: this.translate.instant('seo.competitions.title'), url: `${siteUrl}/competitions` },
        { name, url: pageUrl },
      ]),
    ]);
  }
}
