import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { APP_NAME } from '@shared/config/app_name';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private titleService = inject(Title);
  protected readonly title = signal(APP_NAME);

  ngOnInit(): void {
    this.titleService.setTitle(this.title());
  }
}
