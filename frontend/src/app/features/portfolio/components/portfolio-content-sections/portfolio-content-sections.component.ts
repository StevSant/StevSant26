import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@core/services/translate.service';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import { ContentSection, SourceType, Image } from '@core/models';
import { ContentSectionKey } from '@core/models/entities/content-section.model';
import { SECTION_KEY_OPTIONS, isMaterialIcon } from '@shared/components/content-section-manager/section-key-options';
import { MarkdownPipe } from '@shared/pipes/markdown.pipe';
import { ImageLightboxComponent } from '@shared/components/image-lightbox/image-lightbox.component';
import { MatIcon } from '@angular/material/icon';

interface SectionGroup {
  key: ContentSectionKey;
  icon: string;
  isMaterialIcon: boolean;
  label: string;
  sections: ContentSection[];
}

@Component({
  selector: 'app-portfolio-content-sections',
  standalone: true,
  imports: [CommonModule, MarkdownPipe, ImageLightboxComponent, MatIcon],
  templateUrl: './portfolio-content-sections.component.html',
})
export class PortfolioContentSectionsComponent {
  protected data = inject(PortfolioDataService);
  private translate = inject(TranslateService);

  /** Expose to template for per-section icon rendering */
  protected isMaterialIcon = isMaterialIcon;

  sourceType = input.required<SourceType>();
  sourceId = input.required<number>();

  activeTabIndex = signal(0);

  /** Lightbox state */
  lightboxOpen = signal(false);
  lightboxImages = signal<Image[]>([]);
  lightboxStartIndex = signal(0);

  openLightbox(images: Image[], index: number): void {
    this.lightboxImages.set(images);
    this.lightboxStartIndex.set(index);
    this.lightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    document.body.style.overflow = '';
  }

  get sections(): ContentSection[] {
    return this.data.getContentSections(this.sourceType(), this.sourceId());
  }

  /** Group sections by section_key, preserving order */
  get sectionGroups(): SectionGroup[] {
    const sections = this.sections;
    if (sections.length === 0) return [];

    const groupMap = new Map<ContentSectionKey, ContentSection[]>();

    for (const section of sections) {
      const key = section.section_key || 'custom';
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)!.push(section);
    }

    const groups: SectionGroup[] = [];
    for (const [key, secs] of groupMap) {
      const option = SECTION_KEY_OPTIONS.find(o => o.value === key);
      const icon = secs[0]?.icon || option?.icon || 'article';

      // Label priority: i18n key from SECTION_KEY_OPTIONS → translated title of first section → raw key
      let label: string;
      if (option?.labelKey) {
        label = this.translate.instant(option.labelKey);
      } else {
        const firstTitle = this.data.getSectionTitle(secs[0]);
        label = firstTitle || key.replace(/_/g, ' ');
      }

      groups.push({ key, icon, isMaterialIcon: isMaterialIcon(icon), label, sections: secs });
    }

    return groups;
  }

  /** Whether to show tabs (more than one group) */
  get showTabs(): boolean {
    return this.sectionGroups.length > 1;
  }

  get activeGroup(): SectionGroup | null {
    const groups = this.sectionGroups;
    if (groups.length === 0) return null;
    const idx = this.activeTabIndex();
    return groups[idx < groups.length ? idx : 0];
  }

  selectTab(index: number): void {
    this.activeTabIndex.set(index);
  }

  getSectionImages(sectionId: number): Image[] {
    return this.data.getAllImages('content_section', sectionId);
  }
}
