import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // Impure pipe - re-evaluates on every change detection cycle
})
export class TranslatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(key: string, params?: Record<string, string | number>): string {
    // Access version signal to ensure reactivity when translations change
    // This is needed because impure pipes re-run on every CD cycle
    // but we want to ensure the signal dependencies are tracked
    this.translateService.version();

    return this.translateService.instant(key, params);
  }
}
