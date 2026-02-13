import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioContentSectionsComponent } from '../components/portfolio-content-sections/portfolio-content-sections.component';
import { ImageGalleryComponent } from '@shared/components/image-gallery/image-gallery.component';
import { Experience, Project, Document } from '@core/models';

@Component({
  selector: 'app-portfolio-experience-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, PortfolioContentSectionsComponent, ImageGalleryComponent],
  templateUrl: './portfolio-experience-detail.component.html',
})
export class PortfolioExperienceDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);

  experience = signal<Experience | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  relatedProjects = signal<Project[]>([]);
  documents = signal<Document[]>([]);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const exp = this.data.getExperienceById(id);
      if (exp) {
        this.experience.set(exp);
        this.images.set(this.data.getAllImages('experience', id));
        this.relatedProjects.set(this.data.getProjectsBySource('experience', id));
        this.documents.set(this.data.getDocuments('experience', id));
        this.updateSeo(exp);
      }
    }
  }

  private updateSeo(exp: Experience): void {
    const role = this.data.getEntityTranslation(exp, 'role');
    const description = this.data.getEntityTranslation(exp, 'description');
    const siteUrl = this.seoService.getSiteUrl();
    const pageUrl = `${siteUrl}/experience/${exp.id}`;
    const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';
    const imageUrl = this.data.getFirstImageUrl('experience', exp.id);
    const profile = this.data.profile();
    const author = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    const title = `${role} — ${exp.company}`;

    this.seoService.updateMeta({
      title,
      description: description || undefined,
      image: imageUrl || exp.company_image_url || undefined,
      url: pageUrl,
      type: 'article',
      locale,
      author,
    });

    this.seoService.setJsonLd([
      this.seoService.buildExperienceSchema({
        personName: author,
        roleName: role,
        companyName: exp.company,
        startDate: exp.start_date,
        endDate: exp.end_date,
        description: description || undefined,
      }),
      this.seoService.buildBreadcrumbSchema([
        { name: this.translate.instant('seo.home.title'), url: siteUrl },
        { name: this.translate.instant('seo.experience.title'), url: `${siteUrl}/experience` },
        { name: title, url: pageUrl },
      ]),
    ]);
  }
}
