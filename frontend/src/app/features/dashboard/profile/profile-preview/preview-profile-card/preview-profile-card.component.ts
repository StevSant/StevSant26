import { Component, input } from '@angular/core';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { Profile } from '@core/models';

@Component({
  selector: 'app-preview-profile-card',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './preview-profile-card.component.html',
})
export class PreviewProfileCardComponent {
  profile = input.required<Profile | null>();
  avatarUrl = input<string | null>(null);
  bannerUrl = input<string | null>(null);
  headline = input<string>('');
  bio = input<string>('');
}
