import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MESSAGE_SENT_DISPLAY_MS } from '@shared/config/constants';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-portfolio-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, ScrollRevealDirective],
  templateUrl: './portfolio-contact.component.html',
})
export class PortfolioContactComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private seoService = inject(SeoService);
  private translateService = inject(TranslateService);

  contactName = signal('');
  contactEmail = signal('');
  contactMessage = signal('');
  messageSent = signal(false);

  sendMessage(): void {
    const email = this.data.profile()?.email;
    if (!email) return;

    const subject = encodeURIComponent(`Contact from ${this.contactName()}`);
    const body = encodeURIComponent(
      `Name: ${this.contactName()}\nEmail: ${this.contactEmail()}\n\n${this.contactMessage()}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
    this.messageSent.set(true);
    setTimeout(() => this.messageSent.set(false), MESSAGE_SENT_DISPLAY_MS);
  }

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translateService.currentLang() === 'es' ? 'es_ES' : 'en_US';
    this.seoService.updateMeta({
      title: this.translateService.instant('seo.contact.title'),
      description: this.translateService.instant('seo.contact.description'),
      url: `${siteUrl}/contact`,
      locale,
      keywords: this.translateService.instant('seo.keywords.contact'),
    });
    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translateService.instant('seo.home.title'), url: siteUrl },
        { name: this.translateService.instant('seo.contact.title'), url: `${siteUrl}/contact` },
      ])
    );
  }
}
