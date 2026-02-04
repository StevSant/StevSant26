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
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./dashboard/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./dashboard/projects/projects.component').then((m) => m.ProjectsComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./dashboard/projects/project-form.component').then((m) => m.ProjectFormComponent),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./dashboard/events/events.component').then((m) => m.EventsComponent),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./dashboard/events/event-form.component').then((m) => m.EventFormComponent),
      },
      {
        path: 'experiences',
        loadComponent: () =>
          import('./dashboard/experiences/experiences.component').then((m) => m.ExperiencesComponent),
      },
      {
        path: 'experiences/:id',
        loadComponent: () =>
          import('./dashboard/experiences/experience-form.component').then((m) => m.ExperienceFormComponent),
      },
      {
        path: 'competitions',
        loadComponent: () =>
          import('./dashboard/competitions/competitions.component').then((m) => m.CompetitionsComponent),
      },
      {
        path: 'competitions/:id',
        loadComponent: () =>
          import('./dashboard/competitions/competition-form.component').then((m) => m.CompetitionFormComponent),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./dashboard/skills/skills.component').then((m) => m.SkillsComponent),
      },
      {
        path: 'skills/:id',
        loadComponent: () =>
          import('./dashboard/skills/skill-form.component').then((m) => m.SkillFormComponent),
      },
      {
        path: 'skill-categories',
        loadComponent: () =>
          import('./dashboard/skill-categories/skill-categories.component').then((m) => m.SkillCategoriesComponent),
      },
      {
        path: 'skill-categories/:id',
        loadComponent: () =>
          import('./dashboard/skill-categories/skill-category-form.component').then((m) => m.SkillCategoryFormComponent),
      },
      {
        path: 'skill-usages',
        loadComponent: () =>
          import('./dashboard/skill-usages/skill-usages.component').then((m) => m.SkillUsagesComponent),
      },
      {
        path: 'skill-usages/:id',
        loadComponent: () =>
          import('./dashboard/skill-usages/skill-usage-form.component').then((m) => m.SkillUsageFormComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
