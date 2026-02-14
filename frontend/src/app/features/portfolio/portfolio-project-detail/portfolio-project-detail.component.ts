import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioContentSectionsComponent } from '../components/portfolio-content-sections/portfolio-content-sections.component';
import { ImageGalleryComponent } from '@shared/components/image-gallery/image-gallery.component';
import { Project } from '@core/models';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-portfolio-project-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioContentSectionsComponent, ImageGalleryComponent, MatIcon],
  templateUrl: './portfolio-project-detail.component.html',
})
export class PortfolioProjectDetailComponent implements OnInit, OnDestroy {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);
  private paramSub?: Subscription;

  project = signal<Project | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  subProjects = signal<Project[]>([]);
  parentProject = signal<Project | null>(null);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProject(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }

  private loadProject(id: number): void {
    const p = this.data.getProjectById(id);
    if (p) {
      this.project.set(p);
      this.images.set(this.data.getAllImages('project', id));
      this.subProjects.set(this.data.getSubProjects(id));
      this.parentProject.set(
        p.parent_project_id
          ? this.data.getProjectById(p.parent_project_id) ?? null
          : null
      );
      this.updateSeo(p);
    }
  }

  private updateSeo(p: Project): void {
    const title = this.data.getEntityTranslation(p, 'title');
    const description = this.data.getEntityTranslation(p, 'description');
    const siteUrl = this.seoService.getSiteUrl();
    const pageUrl = `${siteUrl}/projects/${p.id}`;
    const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';
    const imageUrl = this.data.getFirstImageUrl('project', p.id);
    const skillNames = this.data.getSkillUsages('project', p.id).map(u => this.data.getSkillName(u));
    const profile = this.data.profile();
    const author = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';

    this.seoService.updateMeta({
      title,
      description: description || undefined,
      image: imageUrl || undefined,
      url: pageUrl,
      type: 'article',
      locale,
      author,
      keywords: skillNames.length ? skillNames.join(', ') : undefined,
    });

    this.seoService.setJsonLd([
      this.seoService.buildProjectSchema({
        name: title,
        description: description || undefined,
        url: pageUrl,
        image: imageUrl,
        dateCreated: p.created_at,
        author,
        keywords: skillNames,
      }),
      this.seoService.buildBreadcrumbSchema([
        { name: this.translate.instant('seo.home.title'), url: siteUrl },
        { name: this.translate.instant('seo.projects.title'), url: `${siteUrl}/projects` },
        { name: title, url: pageUrl },
      ]),
    ]);
  }
}
