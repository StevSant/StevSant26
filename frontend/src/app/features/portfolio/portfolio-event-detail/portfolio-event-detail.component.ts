import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioContentSectionsComponent } from '../components/portfolio-content-sections/portfolio-content-sections.component';
import { Event } from '@core/models';

@Component({
  selector: 'app-portfolio-event-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioContentSectionsComponent],
  templateUrl: './portfolio-event-detail.component.html',
})
export class PortfolioEventDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);

  event = signal<Event | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  selectedImageIndex = signal(0);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const evt = this.data.getEventById(id);
      if (evt) {
        this.event.set(evt);
        this.images.set(this.data.getAllImages('event', id));
      }
    }
  }
}
