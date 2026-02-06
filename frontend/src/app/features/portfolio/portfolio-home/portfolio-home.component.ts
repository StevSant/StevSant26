import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-portfolio-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, SafeHtmlPipe],
  templateUrl: './portfolio-home.component.html',
})
export class PortfolioHomeComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
