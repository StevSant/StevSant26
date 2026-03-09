import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { PortfolioMapCardComponent } from '../../components/portfolio-map-card/portfolio-map-card.component';

@Component({
  selector: 'app-portfolio-about',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    SafeHtmlPipe,
    ScrollRevealDirective,
    PortfolioMapCardComponent,
  ],
  templateUrl: './portfolio-about.component.html',
})
export class PortfolioAboutComponent {
  bio = input<string | null>(null);
  hasLocationData = input<boolean>(false);
  city = input<string>('');
  countryCode = input<string>('');
  timezone = input<string>('');
  jobTitle = input<string>('');
  latitude = input<number>(0);
  longitude = input<number>(0);
}
