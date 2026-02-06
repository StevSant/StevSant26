import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Experience } from '@core/models';

@Component({
  selector: 'app-portfolio-experience-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './portfolio-experience-detail.component.html',
})
export class PortfolioExperienceDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);

  experience = signal<Experience | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  selectedImageIndex = signal(0);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const exp = this.data.getExperienceById(id);
      if (exp) {
        this.experience.set(exp);
        this.images.set(this.data.getAllImages('experience', id));
      }
    }
  }
}
