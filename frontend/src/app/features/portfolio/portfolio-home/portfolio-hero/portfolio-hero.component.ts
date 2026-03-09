import {
  Component,
  inject,
  input,
  computed,
  signal,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  PLATFORM_ID,
  output,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { MatIcon } from '@angular/material/icon';
import { Document } from '@core/models';

@Component({
  selector: 'app-portfolio-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, ScrollRevealDirective, MatIcon],
  templateUrl: './portfolio-hero.component.html',
})
export class PortfolioHeroComponent implements OnInit, OnDestroy {
  private elRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  // Inputs from parent
  firstName = input<string>('');
  lastName = input<string>('');
  nickname = input<string | null>(null);
  isAvailable = input<boolean | undefined>(undefined);
  avatarUrl = input<string | null>(null);
  bannerUrl = input<string | null>(null);
  profileJobTitle = input<string>('');
  yearsOfExperience = input<number>(0);
  cvDocuments = input<Document[]>([]);

  // Output events
  imageModalOpen = output<{ url: string; alt: string }>();

  /** Typing animation state */
  typingText = signal('');
  showTypingCursor = signal(false);
  private typingInterval?: ReturnType<typeof setInterval>;
  private cursorTimeout?: ReturnType<typeof setTimeout>;

  // CV dropdown state
  cvMenuOpen = signal(false);

  ngOnInit(): void {
    this.startTypingAnimation();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) clearInterval(this.typingInterval);
    if (this.cursorTimeout) clearTimeout(this.cursorTimeout);
  }

  private startTypingAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.typingText.set(this.profileJobTitle());
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typingText.set(this.profileJobTitle());
      return;
    }

    const text = this.profileJobTitle();
    if (!text) return;

    this.showTypingCursor.set(true);
    let i = 0;

    this.typingInterval = setInterval(() => {
      i++;
      this.typingText.set(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(this.typingInterval);
        this.cursorTimeout = setTimeout(() => this.showTypingCursor.set(false), 2000);
      }
    }, 60);
  }

  openImageModal(url: string, alt: string): void {
    this.imageModalOpen.emit({ url, alt });
  }

  toggleCvMenu(): void {
    this.cvMenuOpen.update((v) => !v);
  }

  closeCvMenu(): void {
    this.cvMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.cvMenuOpen() &&
      !this.elRef.nativeElement.querySelector('.relative')?.contains(event.target)
    ) {
      this.closeCvMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.cvMenuOpen()) {
      this.closeCvMenu();
    }
  }
}
