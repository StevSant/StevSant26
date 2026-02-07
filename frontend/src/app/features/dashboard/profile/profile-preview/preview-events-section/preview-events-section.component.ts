import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Event } from '@core/models';

@Component({
  selector: 'app-preview-events-section',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './preview-events-section.component.html',
})
export class PreviewEventsSectionComponent {
  events = input.required<Event[]>();
  getEntityTranslation = input.required<(entity: any, field: string) => string>();
}
