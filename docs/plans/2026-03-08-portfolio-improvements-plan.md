# Portfolio Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate the StevSant26 portfolio with scroll animations, performance optimization, accessibility, SEO, PWA, testing, and DX improvements — optimized for recruiter experience.

**Architecture:** 4-phase incremental approach. Each phase ships independently. Phase 1 focuses on visual wow-factor (scroll animations, micro-interactions, page transitions). Phase 2 optimizes performance (images, bundle, caching). Phase 3 adds a11y, SEO, and PWA. Phase 4 adds testing, error handling, and DX tooling.

**Tech Stack:** Angular 21, Tailwind CSS 4, Vitest, Playwright, @angular/service-worker, web-vitals, ESLint, Husky

**Verification:** Use Playwright MCP to visually verify changes in the browser throughout.

---

## PHASE 1: Visual Polish & Scroll Animations

### Task 1: Enhance scroll-reveal directive with new animation variants

**Files:**
- Modify: `frontend/src/app/shared/directives/scroll-reveal.directive.ts`
- Modify: `frontend/src/styles.css`

**Step 1: Add new CSS animation variants to global styles**

Add after the existing `.scroll-reveal--scale` block in `frontend/src/styles.css` (after line 725):

```css
/* Blur-to-sharp reveal */
.scroll-reveal--blur {
  opacity: 0;
  filter: blur(8px);
  transform: translateY(16px);
  transition: opacity 0.7s ease-out, filter 0.7s ease-out, transform 0.7s ease-out;
}

.scroll-reveal--blur.scroll-reveal--visible {
  opacity: 1;
  filter: blur(0);
  transform: none;
}

/* Fade-only (no transform) */
.scroll-reveal--fade {
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.scroll-reveal--fade.scroll-reveal--visible {
  opacity: 1;
}

/* Reduced motion: disable all scroll animations */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .scroll-reveal--slide-left,
  .scroll-reveal--slide-right,
  .scroll-reveal--scale,
  .scroll-reveal--blur,
  .scroll-reveal--fade {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }

  .skills-ticker {
    animation: none !important;
  }
}
```

**Step 2: Update the directive to support new variants**

In `frontend/src/app/shared/directives/scroll-reveal.directive.ts`, update the `revealVariant` input type and the `ngOnInit` variant logic to include `'blur'` and `'fade'` cases. Add the corresponding CSS class (`scroll-reveal--blur`, `scroll-reveal--fade`).

**Step 3: Run `npm start` and verify in browser**

Visit portfolio pages and confirm new variants work. Use Playwright MCP to verify.

**Step 4: Commit**

```bash
git add frontend/src/app/shared/directives/scroll-reveal.directive.ts frontend/src/styles.css
git commit -m "feat(animations): add blur and fade scroll-reveal variants with reduced-motion support"
```

---

### Task 2: Add scroll-progress indicator component

**Files:**
- Create: `frontend/src/app/shared/components/scroll-progress/scroll-progress.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.html`

**Step 1: Create the scroll-progress component**

A standalone Angular component that renders a thin fixed progress bar at the top of the viewport. Uses `window.scrollY / (document.body.scrollHeight - window.innerHeight)` to compute scroll percentage. Uses `requestAnimationFrame` for smooth updates. Renders a `<div>` with `position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;` using `--color-accent` as background. Width is the scroll percentage. Respects `prefers-reduced-motion` by hiding.

**Step 2: Add to portfolio layout template**

Import `ScrollProgressComponent` in the portfolio layout and add `<app-scroll-progress />` at the top of the template (before the navbar).

**Step 3: Verify in browser with Playwright MCP**

Scroll through a portfolio page and confirm the progress bar animates.

**Step 4: Commit**

```bash
git add frontend/src/app/shared/components/scroll-progress/
git add frontend/src/app/features/portfolio/portfolio-layout/
git commit -m "feat(ui): add scroll-progress indicator to portfolio layout"
```

---

### Task 3: Add animated number counter directive

**Files:**
- Create: `frontend/src/app/shared/directives/count-up.directive.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html`

**Step 1: Create the count-up directive**

A standalone directive `[appCountUp]` that takes a target number as input. Uses IntersectionObserver to detect when the element enters the viewport, then animates the textContent from 0 to the target value over ~1.5s using `requestAnimationFrame` and an easing function (`easeOutExpo`). Only triggers once. Respects `prefers-reduced-motion` by showing the final value immediately.

**Step 2: Add stats section to home page**

Add a stats bar between the hero and the about section in `portfolio-home.component.html`. Show counts for: years of experience, total projects, total skills. Compute these values as signals in the component class from `PortfolioDataService` data.

**Step 3: Add translation keys for stat labels**

Add keys to both `frontend/src/assets/i18n/es.json` and `en.json`:
- `portfolio.home.stats.yearsExperience`
- `portfolio.home.stats.projects`
- `portfolio.home.stats.skills`

**Step 4: Verify in browser with Playwright MCP**

Scroll to the stats section and confirm numbers animate.

**Step 5: Commit**

```bash
git add frontend/src/app/shared/directives/count-up.directive.ts
git add frontend/src/app/features/portfolio/portfolio-home/
git add frontend/src/assets/i18n/
git commit -m "feat(home): add animated stat counters with count-up directive"
```

---

### Task 4: Add page route transitions

**Files:**
- Modify: `frontend/src/app/app.ts` (root component)
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.html`

**Step 1: Implement View Transitions API**

Use the modern View Transitions API (`document.startViewTransition()`) for route changes. In the portfolio layout component, listen to router events (`NavigationEnd`) and trigger a view transition. Add CSS for `::view-transition-old(root)` and `::view-transition-new(root)` with a subtle fade + slight slide animation.

Add the CSS transitions in `frontend/src/styles.css`:

```css
/* View Transitions for route changes */
::view-transition-old(root) {
  animation: fade-out 0.2s ease-in;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Step 2: Add withViewTransitions() to router config**

In `frontend/src/app/app.config.ts`, add `withViewTransitions()` to the `provideRouter()` call. This is Angular's built-in View Transitions support.

**Step 3: Verify page transitions in browser**

Navigate between portfolio pages and confirm smooth fade transitions.

**Step 4: Commit**

```bash
git add frontend/src/app/app.config.ts frontend/src/styles.css
git commit -m "feat(routing): add view transitions for smooth page navigation"
```

---

### Task 5: Add skeleton loader components

**Files:**
- Create: `frontend/src/app/shared/components/skeleton/skeleton.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-projects/portfolio-projects.component.html`

**Step 1: Create skeleton component**

A standalone component with inputs for `variant` (`'text' | 'circle' | 'card' | 'image'`), `width`, `height`, and `count` (for repeating). Renders shimmer-animated placeholder shapes using CSS `@keyframes shimmer` with a gradient sweep animation. Uses theme colors (`--color-bg-tertiary` and `--color-bg-secondary`).

Add shimmer keyframes to `frontend/src/styles.css`:

```css
/* Skeleton loader shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 25%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}
```

**Step 2: Replace loading states in home and projects pages**

In `portfolio-home.component.html`, show skeleton cards while `data.loading()` is true instead of empty space. In `portfolio-projects.component.html`, show skeleton card grid while loading.

**Step 3: Verify loading states in browser**

Throttle network in DevTools and verify skeletons appear before content.

**Step 4: Commit**

```bash
git add frontend/src/app/shared/components/skeleton/
git add frontend/src/styles.css
git add frontend/src/app/features/portfolio/portfolio-home/
git add frontend/src/app/features/portfolio/portfolio-projects/
git commit -m "feat(ui): add skeleton loader components for loading states"
```

---

### Task 6: Enhance card hover effects and micro-interactions

**Files:**
- Modify: `frontend/src/styles.css`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html`

**Step 1: Enhance card-hover class with lift effect**

Update `.card-hover:hover` in `frontend/src/styles.css` to include `transform: translateY(-4px)` and a stronger shadow. Add `will-change: transform` for GPU acceleration.

**Step 2: Add skill chip hover effect**

Add a `.skill-chip` class with subtle scale on hover:

```css
.skill-chip {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.skill-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px -2px var(--color-card-glow);
}
```

**Step 3: Add smooth theme transition enhancement**

The existing `html *` transition already handles theme switching. Verify it's smooth across all 4 themes. If any elements flash, add them to the global transition rule.

**Step 4: Commit**

```bash
git add frontend/src/styles.css frontend/src/app/features/portfolio/portfolio-home/
git commit -m "feat(ui): enhance card hover effects and micro-interactions"
```

---

### Task 7: Add hero typing animation and gradient text

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html`
- Modify: `frontend/src/styles.css`

**Step 1: Add typing animation for role/title**

Create a `typingText` signal in the home component. On init (browser only), animate typing out the profile's job title character by character with a blinking cursor. Use `setInterval` with ~60ms per character. After typing completes, keep a blinking cursor for 2s then remove it.

**Step 2: Add animated gradient to the name heading**

Add CSS for animated gradient text:

```css
.gradient-text-animated {
  background: linear-gradient(
    135deg,
    var(--color-text-primary) 0%,
    var(--color-accent) 50%,
    var(--color-text-primary) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

/* Typing cursor */
.typing-cursor::after {
  content: '|';
  animation: blink 0.8s step-end infinite;
  color: var(--color-accent);
}

@keyframes blink {
  50% { opacity: 0; }
}
```

**Step 3: Apply gradient class to the h1 name and typing to the subtitle**

In the home template, add `gradient-text-animated` class to the name `<h1>`. Replace the static job title text with the `typingText()` signal value.

**Step 4: Verify in browser**

Check that the gradient animates smoothly and the typing effect works on page load.

**Step 5: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-home/
git add frontend/src/styles.css
git commit -m "feat(home): add gradient text animation and typing effect for hero section"
```

---

### Task 8: Add animated skill proficiency bars

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-skills/portfolio-skills.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-skills/portfolio-skills.component.html`
- Modify: `frontend/src/styles.css`

**Step 1: Add animated progress bar CSS**

```css
.skill-bar-track {
  height: 6px;
  border-radius: 3px;
  background-color: var(--color-bg-tertiary);
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  border-radius: 3px;
  background-color: var(--color-accent);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.skill-bar-fill.animate {
  transform: scaleX(var(--bar-width));
}
```

**Step 2: Update skills page to show proficiency bars**

In the skills component, add proficiency bars next to each skill. Use the skill's `proficiency_level` field (0-100). Use IntersectionObserver to trigger the animation when the skill category card scrolls into view. Set `--bar-width` as inline style to `proficiency_level / 100`.

**Step 3: Verify in browser**

Navigate to /skills and scroll — bars should animate from 0 to their target width.

**Step 4: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-skills/
git add frontend/src/styles.css
git commit -m "feat(skills): add animated proficiency bars with scroll-triggered animation"
```

---

### Task 9: Apply staggered scroll-reveal to list pages

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-projects/portfolio-projects.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-experience/portfolio-experience.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-education/portfolio-education.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-competitions/portfolio-competitions.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-events/portfolio-events.component.html`

**Step 1: Add staggered reveal to all list items**

For each `@for` loop in the list pages, add `appScrollReveal` with `[revealDelay]="i * 100"` (where `i` is the `$index`). Use `revealVariant="default"` for vertical lists and alternating `slide-left`/`slide-right` for timeline-style layouts (experience).

**Step 2: Verify all list pages in browser**

Navigate through projects, experience, education, competitions, events — items should stagger in on scroll.

**Step 3: Commit**

```bash
git add frontend/src/app/features/portfolio/
git commit -m "feat(portfolio): add staggered scroll-reveal animations to all list pages"
```

---

## PHASE 2: Performance & Image Optimization

### Task 10: Add preconnect hints and font optimization

**Files:**
- Modify: `frontend/src/index.html`

**Step 1: Add preconnect for Supabase**

Add before the Material Symbols font link:

```html
<link rel="preconnect" href="https://veelrxhltxgdbhytjpcu.supabase.co" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Step 2: Add `font-display: swap` to the font link**

Update the Google Fonts link to include `&display=swap` parameter if not already present.

**Step 3: Commit**

```bash
git add frontend/src/index.html
git commit -m "perf: add preconnect hints and font-display swap for faster loading"
```

---

### Task 11: Optimize hero/above-the-fold images

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html`
- Modify: `frontend/src/index.html`

**Step 1: Remove lazy loading from hero images**

The hero banner and avatar images are above the fold. Ensure they do NOT have `loading="lazy"`. Add `fetchpriority="high"` to the banner image.

**Step 2: Add preload hint for banner**

In `index.html`, add a preload for the Supabase storage domain pattern (can't preload dynamic URLs directly, but the preconnect from Task 10 helps).

**Step 3: Add `loading="lazy"` to all below-fold images**

Ensure all project thumbnails, skill icons, and gallery images have `loading="lazy"` and `decoding="async"` attributes.

**Step 4: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-home/
git add frontend/src/index.html
git commit -m "perf: optimize above-fold image loading priority"
```

---

### Task 12: Add image blur placeholder (LQIP) component

**Files:**
- Create: `frontend/src/app/shared/components/progressive-image/progressive-image.component.ts`
- Modify: `frontend/src/styles.css`

**Step 1: Create progressive image component**

A standalone component with inputs: `src`, `alt`, `class`, `width`, `height`. Renders an `<img>` that starts with a CSS blur filter and fades to sharp when loaded. Uses the `load` event on the image to remove the blur.

```css
.progressive-image {
  filter: blur(10px);
  transition: filter 0.5s ease-out;
}

.progressive-image.loaded {
  filter: blur(0);
}
```

**Step 2: Replace key images with progressive-image component**

Update hero banner, project thumbnails, and gallery images to use `<app-progressive-image>` instead of raw `<img>`.

**Step 3: Verify blur-to-sharp effect in browser**

Throttle network and confirm images blur-load gracefully.

**Step 4: Commit**

```bash
git add frontend/src/app/shared/components/progressive-image/
git add frontend/src/styles.css
git commit -m "feat(images): add progressive image component with blur placeholder"
```

---

### Task 13: Integrate web-vitals tracking

**Files:**
- Modify: `frontend/package.json` (add `web-vitals` dependency)
- Create: `frontend/src/app/core/services/web-vitals.service.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.ts`

**Step 1: Install web-vitals**

```bash
cd frontend && npm install web-vitals
```

**Step 2: Create WebVitalsService**

An injectable service that imports `onLCP`, `onINP`, `onCLS` from `web-vitals`. On init (browser only), registers all three metrics. Logs them to console in development. Optionally sends them to the existing analytics service via a new Supabase table or just stores in sessionStorage for the analytics dashboard.

**Step 3: Initialize in portfolio layout**

Call `webVitalsService.init()` in `portfolio-layout.component.ts` `ngOnInit`.

**Step 4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git add frontend/src/app/core/services/web-vitals.service.ts
git add frontend/src/app/features/portfolio/portfolio-layout/
git commit -m "feat(analytics): add Core Web Vitals tracking with web-vitals library"
```

---

### Task 14: Add cache headers in Vercel config

**Files:**
- Modify: `frontend/vercel.json`

**Step 1: Add cache headers for static assets**

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

Merge this into the existing `vercel.json` (keep existing `rewrites`).

**Step 2: Commit**

```bash
git add frontend/vercel.json
git commit -m "perf: add cache headers for static assets in Vercel config"
```

---

### Task 15: Bundle audit and tree-shaking check

**Files:**
- Modify: `frontend/package.json` (add analyze script)

**Step 1: Add bundle analyzer**

```bash
cd frontend && npm install --save-dev source-map-explorer
```

Add script to package.json: `"analyze": "source-map-explorer dist/stevsant26/browser/*.js"`

**Step 2: Build and analyze**

```bash
cd frontend && npm run build && npm run analyze
```

Review the output. Look for: unused Angular Material modules, large RxJS operator imports, unnecessary dependencies.

**Step 3: Remove any unused imports found**

Fix any tree-shaking issues identified.

**Step 4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "perf: add bundle analyzer and optimize tree-shaking"
```

---

## PHASE 3: Accessibility + SEO + PWA

### Task 16: Add semantic HTML landmarks to portfolio layout

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-navbar/portfolio-navbar.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-footer/portfolio-footer.component.html`

**Step 1: Wrap layout sections with landmarks**

- Wrap the navbar in `<nav aria-label="Main navigation">`
- Wrap the router-outlet area in `<main id="main-content">`
- Wrap the footer in `<footer aria-label="Site footer">`
- Add `role="banner"` to the header area if not using `<header>`

**Step 2: Update navbar and footer components**

Replace generic `<div>` wrappers with `<nav>` and `<footer>` elements. Add `aria-label` attributes.

**Step 3: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-layout/
git add frontend/src/app/features/portfolio/portfolio-navbar/
git add frontend/src/app/features/portfolio/portfolio-footer/
git commit -m "a11y: add semantic HTML landmarks to portfolio layout"
```

---

### Task 17: Add skip navigation link

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-layout.component.html`
- Modify: `frontend/src/styles.css`

**Step 1: Add skip-to-content link**

Add as the first element in the portfolio layout template:

```html
<a href="#main-content" class="skip-link">
  {{ 'portfolio.a11y.skipToContent' | translate }}
</a>
```

**Step 2: Add CSS for skip link**

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 10000;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-accent);
  color: var(--btn-primary-text);
  font-weight: 600;
  border-radius: 0 0 0.5rem 0;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 0;
}
```

**Step 3: Add translation keys**

Add `portfolio.a11y.skipToContent` to both i18n files ("Saltar al contenido" / "Skip to content").

**Step 4: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-layout/
git add frontend/src/styles.css frontend/src/assets/i18n/
git commit -m "a11y: add skip navigation link for keyboard users"
```

---

### Task 18: Add ARIA labels to all interactive elements

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-navbar/portfolio-navbar.component.html`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.html`
- Modify: `frontend/src/app/shared/components/theme-toggle/theme-toggle.component.html`
- Modify: `frontend/src/app/shared/components/language-selector/language-selector.component.html`
- Modify: `frontend/src/app/shared/components/pagination/pagination.component.html`

**Step 1: Audit all interactive elements**

Scan all portfolio template files for `<button>`, `(click)`, `<a>`, and `<input>` elements. Add `aria-label` where the element has no visible text (icon-only buttons, image links).

Key elements to label:
- Theme toggle button
- Language selector button
- Mobile menu open/close buttons
- Pagination prev/next buttons
- Image modal close button
- CV download dropdown
- Search/filter inputs (add `aria-label` or associated `<label>`)

**Step 2: Add translation keys for all ARIA labels**

Add `portfolio.a11y.*` keys to both i18n files for all labels.

**Step 3: Commit**

```bash
git add frontend/src/app/features/portfolio/ frontend/src/app/shared/components/
git add frontend/src/assets/i18n/
git commit -m "a11y: add ARIA labels to all interactive elements"
```

---

### Task 19: Add keyboard navigation and focus management

**Files:**
- Modify: `frontend/src/styles.css`
- Modify: `frontend/src/app/features/portfolio/portfolio-layout/portfolio-mobile-menu/portfolio-mobile-menu.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.ts`

**Step 1: Add visible focus indicators**

Add to `frontend/src/styles.css`:

```css
/* Focus visible indicators */
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Remove default focus for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

**Step 2: Add focus trap to mobile menu**

When the mobile menu opens, trap focus within it. On close, return focus to the trigger button. Use `document.querySelectorAll` to find focusable elements and handle Tab/Shift+Tab cycling.

**Step 3: Add focus trap to image modal**

Same pattern for the image preview modal in the home component. On open, focus the close button. On Escape or close, return focus.

**Step 4: Commit**

```bash
git add frontend/src/styles.css
git add frontend/src/app/features/portfolio/
git commit -m "a11y: add visible focus indicators and focus trapping for modals"
```

---

### Task 20: Color contrast audit for all themes

**Files:**
- Modify: `frontend/src/styles.css` (theme variables if needed)

**Step 1: Audit contrast ratios**

Use browser DevTools or a contrast checker to verify WCAG AA (4.5:1 for normal text, 3:1 for large text) for all 4 themes. Key pairs to check:
- `--color-text-primary` on `--color-bg-primary`
- `--color-text-secondary` on `--color-bg-primary`
- `--color-text-muted` on `--color-bg-primary` and `--color-bg-secondary`
- `--color-accent` on `--color-bg-primary`

**Step 2: Fix any failing contrast ratios**

Adjust the CSS variable values in `styles.css` for any theme that fails. Typically `--color-text-muted` is the most common failure in dark themes.

**Step 3: Commit**

```bash
git add frontend/src/styles.css
git commit -m "a11y: fix color contrast ratios across all themes for WCAG AA compliance"
```

---

### Task 21: Add aria-live regions for dynamic content

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-projects/portfolio-projects.component.html`
- Modify: `frontend/src/app/shared/components/pagination/pagination.component.html`

**Step 1: Add live region for filter results**

When the user filters projects/skills, announce the result count to screen readers. Add an `aria-live="polite"` region with a visually hidden `<span>` that updates with the count.

```html
<span class="sr-only" aria-live="polite">
  {{ filteredCount }} {{ 'portfolio.a11y.resultsFound' | translate }}
</span>
```

**Step 2: Add screen-reader-only utility class**

Add to `frontend/src/styles.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Step 3: Add alt text audit**

Ensure all `<img>` tags in portfolio templates have meaningful `alt` attributes (not just "image" or empty). Profile images should have the person's name. Project images should have the project title.

**Step 4: Commit**

```bash
git add frontend/src/app/features/portfolio/ frontend/src/app/shared/components/
git add frontend/src/styles.css frontend/src/assets/i18n/
git commit -m "a11y: add aria-live regions, sr-only utility, and alt text improvements"
```

---

### Task 22: Generate dynamic sitemap at build time

**Files:**
- Create: `frontend/scripts/generate-sitemap.ts`
- Modify: `frontend/package.json` (add build script)
- Modify: `frontend/public/sitemap.xml` (will be auto-generated)

**Step 1: Create sitemap generation script**

A Node.js script that:
1. Fetches all project IDs, experience IDs, competition IDs, and event IDs from Supabase
2. Generates `sitemap.xml` with all static routes + all dynamic detail page routes
3. Sets appropriate `priority` and `changefreq` values
4. Writes to `frontend/public/sitemap.xml`

Uses the Supabase client directly (import from environment file).

**Step 2: Add to build pipeline**

Add to `package.json`: `"prebuild": "npx tsx scripts/generate-sitemap.ts"`

**Step 3: Run and verify**

```bash
cd frontend && npm run build
```

Check that `sitemap.xml` now includes dynamic routes.

**Step 4: Commit**

```bash
git add frontend/scripts/generate-sitemap.ts frontend/package.json
git add frontend/public/sitemap.xml
git commit -m "feat(seo): add dynamic sitemap generation with all detail pages"
```

---

### Task 23: Add meta tags for detail pages

**Files:**
- Modify: `frontend/src/app/features/portfolio/portfolio-project-detail/portfolio-project-detail.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-experience-detail/portfolio-experience-detail.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-competition-detail/portfolio-competition-detail.component.ts`
- Modify: `frontend/src/app/features/portfolio/portfolio-event-detail/portfolio-event-detail.component.ts`

**Step 1: Update detail page components to set unique meta tags**

In each detail component's data-loading logic, after fetching the entity data, call `seoService.updateMeta()` with:
- `title`: Entity name + site name
- `description`: Entity description (truncated to 160 chars)
- `ogImage`: First image URL for the entity
- `ogType`: 'article'
- `canonical`: Full URL to the detail page

Also call `seoService.setJsonLd()` with the appropriate schema (project → CreativeWork, experience → WorkExperience, etc.).

**Step 2: Verify meta tags in browser**

Navigate to a project detail page and inspect the `<head>` for correct OG tags and JSON-LD.

**Step 3: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-project-detail/
git add frontend/src/app/features/portfolio/portfolio-experience-detail/
git add frontend/src/app/features/portfolio/portfolio-competition-detail/
git add frontend/src/app/features/portfolio/portfolio-event-detail/
git commit -m "feat(seo): add dynamic meta tags and JSON-LD for all detail pages"
```

---

### Task 24: Add PWA support with @angular/service-worker

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/angular.json`
- Create: `frontend/ngsw-config.json`
- Create: `frontend/public/manifest.webmanifest`
- Modify: `frontend/src/index.html`
- Modify: `frontend/src/app/app.config.ts`

**Step 1: Install Angular service worker**

```bash
cd frontend && ng add @angular/pwa --skip-confirmation
```

If `ng add` doesn't work cleanly, install manually:

```bash
npm install @angular/service-worker
```

**Step 2: Configure ngsw-config.json**

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.csr.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.csr.html", "/*.css", "/*.js"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/assets/**", "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api",
      "urls": ["https://veelrxhltxgdbhytjpcu.supabase.co/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "10s"
      }
    }
  ]
}
```

**Step 3: Create web app manifest**

Create `frontend/public/manifest.webmanifest` with app name "Esteban Santamaría", theme colors matching the dark-elegant theme, icons (use existing favicon or create PWA icons), `display: "standalone"`, `start_url: "/"`.

**Step 4: Register service worker in app config**

Add to `app.config.ts`:

```typescript
import { provideServiceWorker } from '@angular/service-worker';

// In providers array:
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerWhenStable:30000',
})
```

**Step 5: Add manifest link to index.html**

```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0a0a0a">
```

**Step 6: Build and verify**

```bash
cd frontend && npm run build
```

Check that `ngsw-worker.js` and `manifest.webmanifest` are in the build output.

**Step 7: Commit**

```bash
git add frontend/ngsw-config.json frontend/public/manifest.webmanifest
git add frontend/src/index.html frontend/src/app/app.config.ts
git add frontend/angular.json frontend/package.json frontend/package-lock.json
git commit -m "feat(pwa): add service worker, web manifest, and offline caching"
```

---

## PHASE 4: Testing + DX + Error Handling + Documentation

### Task 25: Add 404 not-found page

**Files:**
- Create: `frontend/src/app/features/portfolio/portfolio-not-found/portfolio-not-found.component.ts`
- Modify: `frontend/src/app/app.routes.ts`
- Modify: `frontend/src/assets/i18n/es.json`
- Modify: `frontend/src/assets/i18n/en.json`

**Step 1: Create not-found component**

A standalone component with a branded 404 page. Show a large "404" number, a friendly message, and a "Back to Home" button. Use theme colors and the portfolio layout style.

**Step 2: Add wildcard route**

In `app.routes.ts`, add a wildcard route `{ path: '**', loadComponent: ... }` at the end of the portfolio children routes, pointing to the not-found component.

**Step 3: Add translations**

Add `portfolio.notFound.title`, `portfolio.notFound.message`, `portfolio.notFound.backHome` keys.

**Step 4: Verify in browser**

Navigate to `/nonexistent-page` and confirm the 404 page shows.

**Step 5: Commit**

```bash
git add frontend/src/app/features/portfolio/portfolio-not-found/
git add frontend/src/app/app.routes.ts frontend/src/assets/i18n/
git commit -m "feat(ui): add branded 404 not-found page"
```

---

### Task 26: Add toast/notification service

**Files:**
- Create: `frontend/src/app/shared/components/toast/toast.component.ts`
- Create: `frontend/src/app/core/services/toast.service.ts`
- Modify: `frontend/src/app/app.ts` (add toast container to root)

**Step 1: Create ToastService**

An injectable root service that manages a `signal<Toast[]>` array. Methods: `success(message)`, `error(message)`, `info(message)`. Each toast has a type, message, and auto-dismiss timeout (default 4s). Max 3 toasts visible at once.

**Step 2: Create ToastComponent**

A standalone component that renders the toast stack. Fixed position bottom-right. Each toast slides in from the right and fades out. Uses theme colors for success/error/info variants.

**Step 3: Add to root component**

Import and add `<app-toast />` to the root `App` component template.

**Step 4: Integrate with dashboard CRUD**

In dashboard form components, replace `console.log` success/error messages with `toastService.success()` / `toastService.error()` calls.

**Step 5: Commit**

```bash
git add frontend/src/app/shared/components/toast/
git add frontend/src/app/core/services/toast.service.ts
git add frontend/src/app/app.ts
git commit -m "feat(ui): add toast notification service and component"
```

---

### Task 27: Add ESLint with angular-eslint

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/eslint.config.js`

**Step 1: Install ESLint dependencies**

```bash
cd frontend && ng add @angular-eslint/schematics --skip-confirmation
```

Or manually:

```bash
npm install --save-dev @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/schematics @angular-eslint/template-parser eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Step 2: Configure eslint.config.js**

Use the flat config format (ESLint 9+). Include Angular-specific rules and template linting. Enable accessibility rules from `@angular-eslint/template`.

**Step 3: Add lint script**

Add to package.json: `"lint": "ng lint"`

**Step 4: Run lint and fix critical issues**

```bash
cd frontend && npm run lint
```

Fix any critical/error-level issues. Warnings can be addressed later.

**Step 5: Commit**

```bash
git add frontend/eslint.config.js frontend/package.json frontend/package-lock.json
git commit -m "chore(dx): add ESLint with angular-eslint and a11y template rules"
```

---

### Task 28: Add Husky pre-commit hooks with lint-staged

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/.husky/pre-commit`
- Create: `frontend/.lintstagedrc.json`

**Step 1: Install Husky and lint-staged**

```bash
cd frontend && npm install --save-dev husky lint-staged && npx husky init
```

**Step 2: Configure lint-staged**

Create `frontend/.lintstagedrc.json`:

```json
{
  "*.ts": ["eslint --fix", "prettier --write"],
  "*.html": ["prettier --write"],
  "*.css": ["prettier --write"],
  "*.json": ["prettier --write"]
}
```

**Step 3: Configure pre-commit hook**

Update `frontend/.husky/pre-commit`:

```bash
cd frontend && npx lint-staged
```

**Step 4: Test the hook**

Make a small change, stage it, and commit. Verify lint-staged runs.

**Step 5: Commit**

```bash
git add frontend/.husky/ frontend/.lintstagedrc.json frontend/package.json frontend/package-lock.json
git commit -m "chore(dx): add Husky pre-commit hooks with lint-staged"
```

---

### Task 29: Write component tests for key portfolio pages

**Files:**
- Create: `frontend/src/app/features/portfolio/portfolio-home/portfolio-home.component.spec.ts`
- Create: `frontend/src/app/features/portfolio/portfolio-projects/portfolio-projects.component.spec.ts`
- Create: `frontend/src/app/features/portfolio/portfolio-skills/portfolio-skills.component.spec.ts`

**Step 1: Write home component tests**

Test cases:
- Component creates successfully
- Displays profile name when data is loaded
- Shows pinned projects section when projects exist
- Shows skills section when categories exist
- CV download menu toggles on click
- Image modal opens and closes

Mock `PortfolioDataService` with signal-based return values.

**Step 2: Write projects component tests**

Test cases:
- Renders project cards from data
- Filter updates visible projects
- Skeleton shows during loading

**Step 3: Write skills component tests**

Test cases:
- Renders skill categories
- Shows proficiency bars with correct widths
- Displays skill icons when available

**Step 4: Run tests**

```bash
cd frontend && npm test
```

Expected: All tests pass.

**Step 5: Commit**

```bash
git add frontend/src/app/features/portfolio/**/*.spec.ts
git commit -m "test: add component tests for home, projects, and skills pages"
```

---

### Task 30: Write service tests

**Files:**
- Create: `frontend/src/app/core/services/translate.service.spec.ts`
- Create: `frontend/src/app/core/services/seo.service.spec.ts`
- Create: `frontend/src/app/core/services/theme.service.spec.ts`

**Step 1: Write TranslateService tests**

Test cases:
- `instant()` returns correct translation for dot-notation key
- `instant()` returns key if translation not found
- `setLanguage()` updates `currentLang` signal
- `get()` returns computed signal that updates on language change
- Interpolation works with `{{ param }}` syntax

**Step 2: Write SeoService tests**

Test cases:
- `updateMeta()` sets title and meta tags
- `setJsonLd()` adds script element with correct schema
- `removeJsonLd()` cleans up script elements
- `buildPersonSchema()` returns valid Person schema

**Step 3: Write ThemeService tests**

Test cases:
- Default theme is `dark-elegant`
- `setTheme()` updates `currentTheme` signal
- `cycleTheme()` moves to next theme
- Theme is persisted to localStorage

**Step 4: Run tests**

```bash
cd frontend && npm test
```

**Step 5: Commit**

```bash
git add frontend/src/app/core/services/*.spec.ts
git commit -m "test: add unit tests for TranslateService, SeoService, and ThemeService"
```

---

### Task 31: Add E2E tests with Playwright

**Files:**
- Create: `frontend/e2e/playwright.config.ts`
- Create: `frontend/e2e/portfolio.spec.ts`
- Modify: `frontend/package.json`

**Step 1: Install Playwright**

```bash
cd frontend && npm install --save-dev @playwright/test && npx playwright install
```

**Step 2: Configure Playwright**

Create `frontend/e2e/playwright.config.ts` with base URL `http://localhost:4200`, projects for Chromium/Firefox/WebKit, and a webServer config that runs `npm start`.

**Step 3: Write E2E tests for recruiter journey**

Test the core recruiter flow:
1. Land on home page → verify name, avatar, availability badge visible
2. Click "View Projects" → verify projects page loads with cards
3. Click first project → verify detail page loads with title, description, skills
4. Navigate to experience → verify experience list loads
5. Navigate to skills → verify skill categories render
6. Verify theme toggle works
7. Verify language switch works

**Step 4: Add e2e script**

Add to package.json: `"e2e": "npx playwright test --config=e2e/playwright.config.ts"`

**Step 5: Run E2E tests**

```bash
cd frontend && npm run e2e
```

**Step 6: Commit**

```bash
git add frontend/e2e/ frontend/package.json frontend/package-lock.json
git commit -m "test(e2e): add Playwright E2E tests for core recruiter journey"
```

---

### Task 32: Add GitHub Actions CI pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create CI workflow**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - run: npm ci
      - run: npm run lint
      - run: npm test -- --run
      - run: npm run build
```

**Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions pipeline for lint, test, and build"
```

---

### Task 33: Write Architecture Decision Records

**Files:**
- Create: `docs/adr/001-custom-i18n-system.md`
- Create: `docs/adr/002-supabase-backend.md`
- Create: `docs/adr/003-signal-based-state.md`
- Create: `docs/adr/004-four-theme-system.md`

**Step 1: Write ADRs**

Each ADR follows the format:
- **Title**
- **Status:** Accepted
- **Context:** Why the decision was needed
- **Decision:** What was chosen
- **Consequences:** Trade-offs and implications

Keep each ADR concise (150-250 words).

**Step 2: Commit**

```bash
git add docs/adr/
git commit -m "docs: add Architecture Decision Records for key technical decisions"
```

---

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1 | Tasks 1-9 | Scroll animations, micro-interactions, page transitions, skeletons |
| 2 | Tasks 10-15 | Image optimization, web vitals, caching, bundle audit |
| 3 | Tasks 16-24 | Accessibility, dynamic SEO, PWA |
| 4 | Tasks 25-33 | 404 page, toasts, ESLint, Husky, tests, CI, ADRs |

Total: 33 tasks across 4 phases. Each task is independently committable.
