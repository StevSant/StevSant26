import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-portfolio-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, ScrollRevealDirective],
  templateUrl: './portfolio-contact.component.html',
})
export class PortfolioContactComponent implements OnInit {
  protected data = inject(PortfolioDataService);

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
    setTimeout(() => this.messageSent.set(false), 4000);
  }

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
