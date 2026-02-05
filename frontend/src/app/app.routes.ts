import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/layout/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/dashboard/profile/profile-editor/profile-editor.component').then((m) => m.ProfileEditorComponent),
      },
      {
        path: 'preview',
        loadComponent: () =>
          import('./features/dashboard/profile/profile-preview/profile-preview.component').then((m) => m.ProfilePreviewComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/dashboard/projects/project-list/project-list.component').then((m) => m.ProjectListComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/dashboard/projects/project-form/project-form.component').then((m) => m.ProjectFormComponent),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/dashboard/events/event-list/event-list.component').then((m) => m.EventListComponent),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./features/dashboard/events/event-form/event-form.component').then((m) => m.EventFormComponent),
      },
      {
        path: 'experiences',
        loadComponent: () =>
          import('./features/dashboard/experiences/experience-list/experience-list.component').then((m) => m.ExperienceListComponent),
      },
      {
        path: 'experiences/:id',
        loadComponent: () =>
          import('./features/dashboard/experiences/experience-form/experience-form.component').then((m) => m.ExperienceFormComponent),
      },
      {
        path: 'competitions',
        loadComponent: () =>
          import('./features/dashboard/competitions/competition-list/competition-list.component').then((m) => m.CompetitionListComponent),
      },
      {
        path: 'competitions/:id',
        loadComponent: () =>
          import('./features/dashboard/competitions/competition-form/competition-form.component').then((m) => m.CompetitionFormComponent),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/dashboard/skills/skill-list/skill-list.component').then((m) => m.SkillListComponent),
      },
      {
        path: 'skills/:id',
        loadComponent: () =>
          import('./features/dashboard/skills/skill-form/skill-form.component').then((m) => m.SkillFormComponent),
      },
      {
        path: 'skill-categories',
        loadComponent: () =>
          import('./features/dashboard/skill-categories/skill-category-list/skill-category-list.component').then((m) => m.SkillCategoryListComponent),
      },
      {
        path: 'skill-categories/:id',
        loadComponent: () =>
          import('./features/dashboard/skill-categories/skill-category-form/skill-category-form.component').then((m) => m.SkillCategoryFormComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
