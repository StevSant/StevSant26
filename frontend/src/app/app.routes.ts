import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';
import { environment } from '../environments/environment';

const portfolioChildren: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/portfolio/portfolio-home/portfolio-home.component').then((m) => m.PortfolioHomeComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/portfolio/portfolio-projects/portfolio-projects.component').then((m) => m.PortfolioProjectsComponent),
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./features/portfolio/portfolio-project-detail/portfolio-project-detail.component').then((m) => m.PortfolioProjectDetailComponent),
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./features/portfolio/portfolio-experience/portfolio-experience.component').then((m) => m.PortfolioExperienceComponent),
  },
  {
    path: 'experience/:id',
    loadComponent: () =>
      import('./features/portfolio/portfolio-experience-detail/portfolio-experience-detail.component').then((m) => m.PortfolioExperienceDetailComponent),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./features/portfolio/portfolio-skills/portfolio-skills.component').then((m) => m.PortfolioSkillsComponent),
  },
  {
    path: 'competitions',
    loadComponent: () =>
      import('./features/portfolio/portfolio-competitions/portfolio-competitions.component').then((m) => m.PortfolioCompetitionsComponent),
  },
  {
    path: 'competitions/:id',
    loadComponent: () =>
      import('./features/portfolio/portfolio-competition-detail/portfolio-competition-detail.component').then((m) => m.PortfolioCompetitionDetailComponent),
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/portfolio/portfolio-events/portfolio-events.component').then((m) => m.PortfolioEventsComponent),
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./features/portfolio/portfolio-event-detail/portfolio-event-detail.component').then((m) => m.PortfolioEventDetailComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/portfolio/portfolio-contact/portfolio-contact.component').then((m) => m.PortfolioContactComponent),
  },
];

const portfolioRoute = {
  path: '',
  loadComponent: () =>
    import('./features/portfolio/portfolio-layout/portfolio-layout.component').then((m) => m.PortfolioLayoutComponent),
  children: portfolioChildren,
};

const devRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' as const,
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./features/portfolio/portfolio-layout/portfolio-layout.component').then((m) => m.PortfolioLayoutComponent),
    children: portfolioChildren,
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

const prodRoutes: Routes = [
  portfolioRoute,
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
    redirectTo: '',
  },
];

export const routes: Routes = environment.production ? prodRoutes : devRoutes;
