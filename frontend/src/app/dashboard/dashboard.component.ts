import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../core/services/supabase.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-900 flex">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto"
        [class.-translate-x-full]="!sidebarOpen()"
        [class.translate-x-0]="sidebarOpen()"
      >
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <h1 class="text-xl font-bold text-white">Dashboard</h1>
            <button
              (click)="toggleSidebar()"
              class="lg:hidden text-gray-400 hover:text-white"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto py-4">
            <ul class="space-y-1 px-3">
              @for (item of navItems; track item.path) {
                <li>
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="bg-gray-700 text-white"
                    class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    (click)="closeSidebarOnMobile()"
                  >
                    <span [innerHTML]="item.icon" class="w-5 h-5"></span>
                    <span>{{ item.label }}</span>
                  </a>
                </li>
              }
            </ul>
          </nav>

          <!-- User Section -->
          <div class="border-t border-gray-700 p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-medium">{{ userInitial() }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ userEmail() }}</p>
                <p class="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
            <button
              (click)="signOut()"
              class="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 z-40 bg-black/50 lg:hidden"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Top Bar -->
        <header class="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-4 lg:px-6">
          <button
            (click)="toggleSidebar()"
            class="lg:hidden text-gray-400 hover:text-white mr-4"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h2 class="text-lg font-semibold text-white">{{ currentPageTitle() }}</h2>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-4 lg:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  sidebarOpen = signal(false);

  navItems: NavItem[] = [
    {
      path: 'profile',
      label: 'Perfil',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    },
    {
      path: 'projects',
      label: 'Proyectos',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>',
    },
    {
      path: 'events',
      label: 'Eventos',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    },
    {
      path: 'experiences',
      label: 'Experiencias',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    },
    {
      path: 'competitions',
      label: 'Competencias',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>',
    },
    {
      path: 'skills',
      label: 'Habilidades',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    },
    {
      path: 'skill-categories',
      label: 'Categorías de Habilidades',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>',
    },
    {
      path: 'skill-usages',
      label: 'Usos de Habilidades',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>',
    },
  ];

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }

  userEmail(): string {
    return this.supabase.user()?.email ?? '';
  }

  userInitial(): string {
    const email = this.userEmail();
    return email ? email.charAt(0).toUpperCase() : '?';
  }

  currentPageTitle(): string {
    const path = this.router.url.split('/').pop() || 'profile';
    const titles: Record<string, string> = {
      profile: 'Perfil',
      projects: 'Proyectos',
      events: 'Eventos',
      experiences: 'Experiencias',
      competitions: 'Competencias',
      skills: 'Habilidades',
      'skill-categories': 'Categorías de Habilidades',
      'skill-usages': 'Usos de Habilidades',
    };
    return titles[path] || 'Dashboard';
  }

  async signOut(): Promise<void> {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}
