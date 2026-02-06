import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-experience',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './portfolio-experience.component.html',
})
export class PortfolioExperienceComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
