import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-skills',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './portfolio-skills.component.html',
})
export class PortfolioSkillsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
