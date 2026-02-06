import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

export interface SocialLinksData {
  email: string;
  phone: string;
  whatsapp: string;
  linkedin_url: string;
  github_url: string;
  instagram_url: string;
}

@Component({
  selector: 'app-social-links-card',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './social-links-card.component.html',
})
export class SocialLinksCardComponent {
  /** Current social links form data */
  formData = input.required<SocialLinksData>();

  /** Emitted when any social link field changes */
  formDataChange = output<SocialLinksData>();

  onFieldChange(): void {
    this.formDataChange.emit({ ...this.formData() });
  }
}
