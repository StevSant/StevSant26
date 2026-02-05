import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client // Don't SSR protected routes
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
