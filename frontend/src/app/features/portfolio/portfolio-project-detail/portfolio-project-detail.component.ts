import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioContentSectionsComponent } from '../components/portfolio-content-sections/portfolio-content-sections.component';
import { Project } from '@core/models';

@Component({
  selector: 'app-portfolio-project-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioContentSectionsComponent],
  templateUrl: './portfolio-project-detail.component.html',
})
export class PortfolioProjectDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);

  project = signal<Project | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  selectedImageIndex = signal(0);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const p = this.data.getProjectById(id);
      if (p) {
        this.project.set(p);
        this.images.set(this.data.getAllImages('project', id));
      }
    }
  }
}
