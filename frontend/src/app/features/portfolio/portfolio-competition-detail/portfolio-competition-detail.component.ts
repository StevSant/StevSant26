import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioContentSectionsComponent } from '../components/portfolio-content-sections/portfolio-content-sections.component';
import { Competition } from '@core/models';

@Component({
  selector: 'app-portfolio-competition-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioContentSectionsComponent],
  templateUrl: './portfolio-competition-detail.component.html',
})
export class PortfolioCompetitionDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);

  competition = signal<Competition | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  selectedImageIndex = signal(0);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const comp = this.data.getCompetitionById(id);
      if (comp) {
        this.competition.set(comp);
        this.images.set(this.data.getAllImages('competition', id));
      }
    }
  }
}
