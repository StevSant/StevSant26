import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-competitions',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe],
  templateUrl: './portfolio-competitions.component.html',
})
export class PortfolioCompetitionsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
