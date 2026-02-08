import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-portfolio-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, SafeHtmlPipe, ScrollRevealDirective],
  templateUrl: './portfolio-home.component.html',
})
export class PortfolioHomeComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  // Image modal state
  showImageModal = signal(false);
  modalImageUrl = signal<string | null>(null);
  modalImageAlt = signal<string>('');

  pinnedProjects = computed(() =>
    this.data.projects().filter(p => p.is_pinned && !p.is_archived).slice(0, 3)
  );

  topSkillCategories = computed(() =>
    this.data.skillCategories().slice(0, 4)
  );

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }

  openImageModal(url: string, alt: string): void {
    this.modalImageUrl.set(url);
    this.modalImageAlt.set(alt);
    this.showImageModal.set(true);
  }

  closeImageModal(): void {
    this.showImageModal.set(false);
    this.modalImageUrl.set(null);
  }

  onModalBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeImageModal();
    }
  }
}
