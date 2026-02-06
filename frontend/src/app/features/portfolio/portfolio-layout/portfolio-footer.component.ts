import { Component, input } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './portfolio-footer.component.html',
})
export class PortfolioFooterComponent {
  profileName = input<string>('');
  currentYear = input<number>(new Date().getFullYear());
}
