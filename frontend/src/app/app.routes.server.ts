import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Auth
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  // Dashboard — protected, no SSR needed
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client,
  },
  // Portfolio — static list pages (prerender for SEO)
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'projects',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'experience',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'skills',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'education',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'competitions',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'events',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender,
  },
  // Dynamic detail pages — client-side (data from Supabase)
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
