import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { Title } from '@angular/platform-browser';
import { APP_NAME } from '@shared/config/app_name';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private titleService = inject(Title);
  // Inject ThemeService to ensure it initializes and applies saved theme
  private themeService = inject(ThemeService);
  protected readonly title = signal(APP_NAME);

  ngOnInit(): void {
    this.titleService.setTitle(this.title());
  }
}
