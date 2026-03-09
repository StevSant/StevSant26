# Dashboard Polish + Portfolio Skeletons Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve dashboard spacing, visual polish (filter bar, loading skeletons, empty states), and create page-specific portfolio skeletons.

**Architecture:** Create 5 new skeleton components (1 dashboard, 4 portfolio). Modify the dashboard-filter component to have a card container. Restructure portfolio-layout to always render router-outlet so child pages can show their own skeletons. Update all 8 dashboard list pages for spacing and skeleton loading.

**Tech Stack:** Angular 21 (standalone components, signals), Tailwind CSS 4, existing `app-skeleton` shimmer component.

---

### Task 1: Redesign Dashboard Filter Bar

**Files:**
- Modify: `frontend/src/app/shared/components/dashboard-filter/dashboard-filter.component.html`

**Step 1: Add card container to dashboard-filter**

Replace the entire file content with:

```html
<div class="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-xl p-4">
  <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
    <!-- Search input -->
    <div class="relative flex-1 min-w-0">
      <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[var(--color-text-muted)]">search</mat-icon>
      <input
        type="text"
        [ngModel]="searchText()"
        (ngModelChange)="onSearchInput($event)"
        [placeholder]="searchPlaceholder() | translate"
        class="w-full pl-10 pr-8 py-2.5 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors"
      />
      @if (searchText()) {
        <button
          type="button"
          (click)="clearSearch()"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <mat-icon class="text-[16px]">close</mat-icon>
        </button>
      }
    </div>

    <!-- Dropdown filter -->
    @if (filterOptions().length > 0) {
      <div class="relative sm:w-56">
        <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[var(--color-text-muted)] pointer-events-none">filter_list</mat-icon>
        <select
          [ngModel]="selectedFilter()"
          (ngModelChange)="onFilterSelect($event)"
          class="w-full pl-10 pr-8 py-2.5 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors appearance-none cursor-pointer"
        >
          @if (showAllOption()) {
            <option value="">
              {{ filterLabel() | translate }} — {{ 'dashboardFilter.all' | translate }}
            </option>
          }
          @for (option of filterOptions(); track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[var(--color-text-muted)] pointer-events-none">expand_more</mat-icon>
      </div>
    }
  </div>
</div>
```

Key changes: outer card container with `bg-secondary`, `border`, `rounded-xl`, `p-4`. Inner inputs use `bg-primary` to contrast. Gap bumped from `gap-3` to `gap-4`. Input padding bumped from `py-2` to `py-2.5`.

**Step 2: Commit**

```bash
git add frontend/src/app/shared/components/dashboard-filter/dashboard-filter.component.html
git commit -m "style(dashboard-filter): add card container and improve spacing"
```

---

### Task 2: Create Dashboard List Skeleton Component

**Files:**
- Create: `frontend/src/app/shared/components/dashboard-list-skeleton/dashboard-list-skeleton.component.ts`

**Step 1: Create the component**

```typescript
import { Component, input } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-dashboard-list-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="space-y-3">
      @for (_ of rows(); track $index) {
        <div class="card p-4 flex items-center gap-4">
          <!-- Drag handle placeholder -->
          <app-skeleton width="20px" height="20px" variant="text" />
          <!-- Pin/icon placeholder -->
          <app-skeleton width="24px" height="24px" variant="circle" />
          <!-- Content -->
          <div class="flex-1 min-w-0 flex flex-col gap-2">
            <app-skeleton width="40%" height="1rem" />
            <app-skeleton width="25%" height="0.75rem" />
          </div>
          <!-- Action buttons placeholder -->
          <div class="hidden sm:flex items-center gap-2">
            <app-skeleton width="28px" height="28px" variant="circle" />
            <app-skeleton width="28px" height="28px" variant="circle" />
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardListSkeletonComponent {
  count = input(5);
  rows = () => Array.from({ length: this.count() });
}
```

**Step 2: Commit**

```bash
git add frontend/src/app/shared/components/dashboard-list-skeleton/dashboard-list-skeleton.component.ts
git commit -m "feat(shared): add dashboard-list-skeleton component"
```

---

### Task 3: Update All Dashboard List Pages — Spacing, Skeleton, Empty States

This task updates all 8 dashboard list pages. Each follows the same pattern of changes:

1. Change outer container from `space-y-6` to `space-y-8`
2. Change item list spacing from `space-y-2` to `space-y-3`
3. Replace SVG spinner loading state with `<app-dashboard-list-skeleton />`
4. Improve empty state styling
5. Add `DashboardListSkeletonComponent` to imports

**Files to modify (same pattern applied to each):**

- `frontend/src/app/features/dashboard/experiences/experience-list/experience-list.component.html`
- `frontend/src/app/features/dashboard/experiences/experience-list/experience-list.component.ts`
- `frontend/src/app/features/dashboard/projects/project-list/project-list.component.html`
- `frontend/src/app/features/dashboard/projects/project-list/project-list.component.ts`
- `frontend/src/app/features/dashboard/skills/skill-list/skill-list.component.html`
- `frontend/src/app/features/dashboard/skills/skill-list/skill-list.component.ts`
- `frontend/src/app/features/dashboard/educations/education-list/education-list.component.html`
- `frontend/src/app/features/dashboard/educations/education-list/education-list.component.ts`
- `frontend/src/app/features/dashboard/events/event-list/event-list.component.html`
- `frontend/src/app/features/dashboard/events/event-list/event-list.component.ts`
- `frontend/src/app/features/dashboard/competitions/competition-list/competition-list.component.html`
- `frontend/src/app/features/dashboard/competitions/competition-list/competition-list.component.ts`
- `frontend/src/app/features/dashboard/skill-categories/skill-category-list/skill-category-list.component.html`
- `frontend/src/app/features/dashboard/skill-categories/skill-category-list/skill-category-list.component.ts`
- `frontend/src/app/features/dashboard/skill-usages/skill-usage-list/skill-usage-list.component.html`
- `frontend/src/app/features/dashboard/skill-usages/skill-usage-list/skill-usage-list.component.ts`

**Step 1: For each .ts file, add DashboardListSkeletonComponent to imports array**

Add to the imports array:
```typescript
import { DashboardListSkeletonComponent } from '@shared/components/dashboard-list-skeleton/dashboard-list-skeleton.component';
```

And add `DashboardListSkeletonComponent` to the `imports: [...]` array in `@Component`.

**Step 2: For each .html file, apply these changes**

a) Change the outer `<div class="space-y-6">` to `<div class="space-y-8">`

b) Replace the loading spinner block:
```html
@if (loading()) {
  <div class="flex items-center justify-center py-12">
    <svg class="spinner-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
}
```

With:
```html
@if (loading()) {
  <app-dashboard-list-skeleton />
}
```

c) Change item list `space-y-2` to `space-y-3`

d) Improve the empty state block — change:
```html
<div class="card p-12 text-center">
```
To:
```html
<div class="card p-16 text-center border-dashed">
```

And change the icon size from `text-[64px]` to `text-[56px]` and `opacity-40`.

**Step 3: Commit**

```bash
git add frontend/src/app/features/dashboard/*/
git commit -m "style(dashboard): improve spacing, add skeleton loading, refine empty states"
```

---

### Task 4: Create Portfolio Home Skeleton Component

**Files:**
- Create: `frontend/src/app/shared/components/portfolio-home-skeleton/portfolio-home-skeleton.component.ts`

**Step 1: Create the component**

This skeleton matches the home page layout: hero section (avatar + name + headline + buttons) + featured projects grid.

```typescript
import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-home-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <!-- Hero skeleton -->
    <div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-16">
          <app-skeleton variant="circle" width="10rem" height="10rem" />
          <div class="flex-1 flex flex-col items-center md:items-start gap-4 w-full">
            <app-skeleton width="70%" height="2.5rem" />
            <app-skeleton width="40%" height="1rem" />
            <app-skeleton width="30%" height="1.75rem" />
            <div class="flex gap-3 mt-2">
              <app-skeleton width="120px" height="2.5rem" />
              <app-skeleton width="120px" height="2.5rem" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured projects grid skeleton -->
    <div class="px-4 sm:px-6 lg:px-8 pb-16">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-center mb-10">
          <app-skeleton width="200px" height="0.75rem" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (_ of [1, 2, 3]; track $index) {
            <div class="bg-(--color-bg-secondary) rounded-xl border border-(--color-card-border) overflow-hidden">
              <app-skeleton variant="image" width="100%" height="10rem" />
              <div class="p-6 flex flex-col gap-3">
                <app-skeleton width="80%" height="1.25rem" />
                <app-skeleton width="100%" height="0.75rem" />
                <app-skeleton width="60%" height="0.75rem" />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PortfolioHomeSkeletonComponent {}
```

**Step 2: Commit**

```bash
git add frontend/src/app/shared/components/portfolio-home-skeleton/
git commit -m "feat(shared): add portfolio-home-skeleton component"
```

---

### Task 5: Create Portfolio Grid Skeleton Component

**Files:**
- Create: `frontend/src/app/shared/components/portfolio-grid-skeleton/portfolio-grid-skeleton.component.ts`

**Step 1: Create the component**

Used by Projects, Events, Competitions pages. Shows: section title + filter bar placeholder + 3-column card grid with images.

```typescript
import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-grid-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <section class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Section title -->
        <div class="flex flex-col items-center gap-3 mb-8 sm:mb-10 lg:mb-14">
          <app-skeleton width="120px" height="0.75rem" />
          <div class="w-12 h-px bg-(--color-accent) opacity-60"></div>
        </div>

        <!-- Filter bar placeholder -->
        <div class="mb-8 space-y-4">
          <div class="max-w-md mx-auto">
            <app-skeleton width="100%" height="2.5rem" />
          </div>
          <div class="flex justify-center gap-2">
            <app-skeleton width="80px" height="1.75rem" />
            <app-skeleton width="100px" height="1.75rem" />
            <app-skeleton width="90px" height="1.75rem" />
          </div>
        </div>

        <!-- Card grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          @for (_ of [1, 2, 3, 4, 5, 6]; track $index) {
            <div class="bg-(--color-bg-secondary) rounded-xl border border-(--color-card-border) overflow-hidden">
              <app-skeleton variant="image" width="100%" height="12rem" />
              <div class="p-5 flex flex-col gap-3">
                <app-skeleton width="75%" height="1.25rem" />
                <app-skeleton width="100%" height="0.75rem" />
                <app-skeleton width="50%" height="0.75rem" />
                <div class="flex gap-2 mt-2">
                  <app-skeleton width="60px" height="1.5rem" />
                  <app-skeleton width="70px" height="1.5rem" />
                  <app-skeleton width="50px" height="1.5rem" />
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PortfolioGridSkeletonComponent {}
```

**Step 2: Commit**

```bash
git add frontend/src/app/shared/components/portfolio-grid-skeleton/
git commit -m "feat(shared): add portfolio-grid-skeleton component"
```

---

### Task 6: Create Portfolio Timeline Skeleton Component

**Files:**
- Create: `frontend/src/app/shared/components/portfolio-timeline-skeleton/portfolio-timeline-skeleton.component.ts`

**Step 1: Create the component**

Used by Experience and Education pages. Shows: section title + vertical timeline with alternating cards.

```typescript
import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-timeline-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <section class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- Section title -->
        <div class="flex flex-col items-center gap-3 mb-8 sm:mb-10 lg:mb-14">
          <app-skeleton width="140px" height="0.75rem" />
          <div class="w-12 h-px bg-(--color-accent) opacity-60"></div>
        </div>

        <!-- Filter placeholder -->
        <div class="mb-10 flex flex-col items-center gap-3">
          <div class="max-w-md w-full">
            <app-skeleton width="100%" height="2.5rem" />
          </div>
        </div>

        <!-- Timeline -->
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-(--color-border-primary) opacity-40"></div>

          <div class="space-y-12">
            @for (_ of [1, 2, 3]; track $index) {
              <div class="relative flex flex-col md:flex-row items-start gap-6" [class.md:flex-row-reverse]="$index % 2 !== 0">
                <!-- Timeline dot -->
                <div class="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-(--color-border-primary) mt-6"></div>

                <!-- Card -->
                <div class="ml-12 md:ml-0 md:w-[calc(50%-2rem)] bg-(--color-bg-secondary) rounded-xl border border-(--color-card-border) p-6">
                  <div class="flex flex-col gap-3">
                    <app-skeleton width="70%" height="1.25rem" />
                    <app-skeleton width="50%" height="0.875rem" />
                    <app-skeleton width="35%" height="0.75rem" />
                    <div class="mt-2">
                      <app-skeleton width="100%" height="0.75rem" />
                      <div class="mt-1">
                        <app-skeleton width="80%" height="0.75rem" />
                      </div>
                    </div>
                    <div class="flex gap-2 mt-2">
                      <app-skeleton width="50px" height="1.25rem" />
                      <app-skeleton width="60px" height="1.25rem" />
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PortfolioTimelineSkeletonComponent {}
```

**Step 2: Commit**

```bash
git add frontend/src/app/shared/components/portfolio-timeline-skeleton/
git commit -m "feat(shared): add portfolio-timeline-skeleton component"
```

---

### Task 7: Create Portfolio Skills Skeleton Component

**Files:**
- Create: `frontend/src/app/shared/components/portfolio-skills-skeleton/portfolio-skills-skeleton.component.ts`

**Step 1: Create the component**

Used by Skills page. Shows: section title + 2-column category cards with skill bars.

```typescript
import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-skills-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <section class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Section title -->
        <div class="flex flex-col items-center gap-3 mb-8 sm:mb-10 lg:mb-14">
          <app-skeleton width="100px" height="0.75rem" />
          <div class="w-12 h-px bg-(--color-accent) opacity-60"></div>
        </div>

        <!-- View toggle placeholder -->
        <div class="flex justify-center mb-8">
          <app-skeleton width="200px" height="2rem" />
        </div>

        <!-- Category cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          @for (_ of [1, 2, 3, 4]; track $index) {
            <div class="bg-(--color-bg-secondary) rounded-xl border border-(--color-card-border) p-6">
              <!-- Category header -->
              <div class="flex items-center gap-3 mb-5">
                <app-skeleton width="36px" height="36px" variant="circle" />
                <app-skeleton width="60%" height="1.25rem" />
              </div>
              <!-- Skill bars -->
              @for (_ of [1, 2, 3, 4]; track $index) {
                <div class="flex items-center gap-3 mb-3">
                  <app-skeleton width="24px" height="24px" variant="circle" />
                  <div class="flex-1 flex flex-col gap-1.5">
                    <div class="flex justify-between">
                      <app-skeleton width="40%" height="0.75rem" />
                      <app-skeleton width="30px" height="0.75rem" />
                    </div>
                    <app-skeleton width="100%" height="6px" />
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PortfolioSkillsSkeletonComponent {}
```

**Step 2: Commit**

```bash
git add frontend/src/app/shared/components/portfolio-skills-skeleton/
git commit -m "feat(shared): add portfolio-skills-skeleton component"
```

---

### Task 8: Restructure Portfolio Layout and Integrate Page-Specific Skeletons

This is the most complex task. We need to:
1. Change `portfolio-layout` to always render the router-outlet (so child pages can show their own skeletons), showing only a navbar skeleton while loading
2. Add skeleton loading states to each of the 6 portfolio pages

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-projects/portfolio-projects.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-projects/portfolio-projects.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-experience/portfolio-experience.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-experience/portfolio-experience.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-education/portfolio-education.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-education/portfolio-education.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-skills/portfolio-skills.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-skills/portfolio-skills.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-events/portfolio-events.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-events/portfolio-events.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-competitions/portfolio-competitions.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-competitions/portfolio-competitions.component.ts`

**Step 1: Update portfolio-layout to always render router-outlet**

In `portfolio-layout.component.html`, restructure so that:
- When loading: show skeleton navbar + router-outlet (child pages handle their own content skeletons)
- When loaded: show real navbar + router-outlet

Replace the entire file:

```html
<a href="#main-content" class="skip-link">
  {{ 'portfolio.a11y.skipToContent' | translate }}
</a>
<app-scroll-progress />
<div class="min-h-screen bg-(--color-bg-primary) flex flex-col">
  <!-- Navigation -->
  @if (data.loading()) {
    <!-- Skeleton navbar -->
    <div class="h-16 border-b border-(--color-divider) px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto flex items-center justify-between h-full">
        <app-skeleton width="140px" height="1.25rem" />
        <div class="hidden lg:flex items-center gap-6">
          <app-skeleton width="60px" height="0.75rem" />
          <app-skeleton width="60px" height="0.75rem" />
          <app-skeleton width="60px" height="0.75rem" />
          <app-skeleton width="60px" height="0.75rem" />
        </div>
      </div>
    </div>
  } @else {
    <nav
      aria-label="Main navigation"
      class="fixed top-0 left-0 right-0 z-50 bg-(--color-bg-primary)/90 backdrop-blur-md border-b border-(--color-divider)"
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a
            routerLink="./"
            class="text-lg font-semibold tracking-tight text-(--color-text-primary) cursor-pointer hover:text-(--color-accent) transition-colors"
          >
            {{ data.profile()?.first_name }} {{ data.profile()?.last_name }}
          </a>

          <app-portfolio-navbar
            [moreMenuOpen]="moreMenuOpen()"
            [cvMenuOpen]="cvMenuOpen()"
            (toggleMoreMenu)="toggleMoreMenu()"
            (toggleCvMenu)="toggleCvMenu()"
            (closeAllMenus)="closeAllMenus()"
          />

          <div class="lg:hidden flex items-center gap-1 sm:gap-2">
            <app-theme-toggle />
            <app-language-selector />
            <button
              (click)="toggleMobileMenu()"
              [attr.aria-label]="mobileMenuOpen() ? ('portfolio.a11y.closeMenu' | translate) : ('portfolio.a11y.openMenu' | translate)"
              [attr.aria-expanded]="mobileMenuOpen()"
              class="text-(--color-text-muted) hover:text-(--color-text-primary) p-1"
            >
              @if (mobileMenuOpen()) {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              }
            </button>
          </div>
        </div>

        @if (mobileMenuOpen()) {
          <app-portfolio-mobile-menu (closeMobileMenu)="closeMobileMenu()" />
        }
      </div>
    </nav>

    <!-- Backdrop for dropdowns -->
    @if (moreMenuOpen() || cvMenuOpen()) {
      <div class="fixed inset-0 z-40" (click)="closeAllMenus()"></div>
    }
  }

  <!-- Main content (always rendered — child pages handle their own loading skeletons) -->
  <main id="main-content" class="flex-1" [class.pt-16]="!data.loading()" role="main">
    <router-outlet></router-outlet>
  </main>

  <!-- Footer -->
  @if (!data.loading()) {
    <app-portfolio-footer
      [profileName]="(data.profile()?.first_name || '') + ' ' + (data.profile()?.last_name || '')"
      [currentYear]="currentYear"
    />
  }
</div>
```

**Step 2: Add skeleton imports to each portfolio page .ts file**

For each portfolio page, add the appropriate skeleton import and component to the `imports` array:

- **portfolio-home**: `import { PortfolioHomeSkeletonComponent } from '@shared/components/portfolio-home-skeleton/portfolio-home-skeleton.component';` → add `PortfolioHomeSkeletonComponent` to imports
- **portfolio-projects**: `import { PortfolioGridSkeletonComponent } from '@shared/components/portfolio-grid-skeleton/portfolio-grid-skeleton.component';` → add `PortfolioGridSkeletonComponent`
- **portfolio-experience**: `import { PortfolioTimelineSkeletonComponent } from '@shared/components/portfolio-timeline-skeleton/portfolio-timeline-skeleton.component';` → add `PortfolioTimelineSkeletonComponent`
- **portfolio-education**: `import { PortfolioTimelineSkeletonComponent } from '@shared/components/portfolio-timeline-skeleton/portfolio-timeline-skeleton.component';` → add `PortfolioTimelineSkeletonComponent`
- **portfolio-skills**: `import { PortfolioSkillsSkeletonComponent } from '@shared/components/portfolio-skills-skeleton/portfolio-skills-skeleton.component';` → add `PortfolioSkillsSkeletonComponent`
- **portfolio-events**: `import { PortfolioGridSkeletonComponent } from '@shared/components/portfolio-grid-skeleton/portfolio-grid-skeleton.component';` → add `PortfolioGridSkeletonComponent`
- **portfolio-competitions**: `import { PortfolioGridSkeletonComponent } from '@shared/components/portfolio-grid-skeleton/portfolio-grid-skeleton.component';` → add `PortfolioGridSkeletonComponent`

**Step 3: Wrap each portfolio page HTML with loading check**

For each portfolio page `.html` file, wrap the existing content:

**portfolio-home.component.html:**
```html
@if (data.loading()) {
  <app-portfolio-home-skeleton />
} @else {
  <!-- existing template content -->
}
```

**portfolio-projects.component.html:**
```html
@if (data.loading()) {
  <app-portfolio-grid-skeleton />
} @else {
  <!-- existing template content -->
}
```

**portfolio-experience.component.html:**
```html
@if (data.loading()) {
  <app-portfolio-timeline-skeleton />
} @else {
  <!-- existing template content -->
}
```

**portfolio-education.component.html:**
```html
@if (data.loading()) {
  <app-portfolio-timeline-skeleton />
} @else {
  <!-- existing template content -->
}
```

**portfolio-skills.component.html:**
```html
@if (data.loading()) {
  <app-portfolio-skills-skeleton />
} @else {
  <!-- existing template content -->
}
```

**portfolio-events.component.html:**
```html
@if (data.loading()) {
  <app-portfolio-grid-skeleton />
} @else {
  <!-- existing template content -->
}
```

**portfolio-competitions.component.html:**
```html
@if (data.loading()) {
  <app-portfolio-grid-skeleton />
} @else {
  <!-- existing template content -->
}
```

**Step 4: Commit**

```bash
git add frontend/src/app/features/portfolio/ frontend/src/app/shared/components/portfolio-*/
git commit -m "feat(portfolio): add page-specific loading skeletons and restructure layout"
```

---

### Task 9: Visual Verification with Playwright

**Step 1: Start the dev server**

```bash
cd frontend && npm start
```

**Step 2: Use Playwright MCP to navigate to dashboard pages and verify**

- Navigate to the dashboard experiences, projects, skills, education, events, competitions pages
- Verify the filter bar has the card container
- Verify spacing between sections looks right
- Check the skeleton loading appears correctly (may need to throttle network)

**Step 3: Navigate to portfolio pages and verify skeletons**

- Navigate to each portfolio page
- Verify page-specific skeletons match the page layouts
- Check that the navbar skeleton shows correctly while loading

**Step 4: Fix any visual issues found during verification**

**Step 5: Final commit with any fixes**

```bash
git add -A
git commit -m "fix(ui): visual adjustments from Playwright verification"
```
