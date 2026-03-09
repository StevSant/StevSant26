# Dashboard Polish + Portfolio Skeletons Design

**Date:** 2026-03-09

## Problem

1. Dashboard search bar and filters are too close to content items
2. Dashboard overall visual polish can be improved (loading states, empty states, spacing)
3. Portfolio uses a single skeleton for all pages — doesn't match actual page layouts

## Design

### 1. Dashboard Filter Bar Redesign

Wrap `dashboard-filter` in a card-like container with `p-4` padding.
Bump internal gap from `gap-3` to `gap-4`.
Parent pages increase section spacing from `space-y-6` to `space-y-8`.

### 2. Dashboard Section Rhythm

Increase item list spacing from `space-y-2` to `space-y-3`.
Better visual separation between header, toolbar, and content areas.

### 3. Dashboard Skeleton Loading

Replace SVG spinner in all 8 dashboard list pages with a generic `app-dashboard-list-skeleton`.
Shows 5 shimmer rows mimicking list items (drag handle + text lines + action area).
Reuses existing `app-skeleton` component.

### 4. Dashboard Empty States

Increase padding, refine icon sizing, add subtle card treatment.

### 5. Portfolio Page-Specific Skeletons

Replace single skeleton in `portfolio-layout` with route-aware approach.
Layout keeps only navbar skeleton. Each portfolio page handles its own content skeleton.

4 skeleton groups:

| Component | Used By | Layout |
|-----------|---------|--------|
| `portfolio-home-skeleton` | Home | Hero (circle + text) + 3-col cards |
| `portfolio-grid-skeleton` | Projects, Events, Competitions | Title + filter + 3-col image cards |
| `portfolio-timeline-skeleton` | Experience, Education | Title + vertical timeline + alternating cards |
| `portfolio-skills-skeleton` | Skills | Title + 2-col category cards + bars |

## Files

### New components
- `shared/components/dashboard-list-skeleton/`
- `shared/components/portfolio-home-skeleton/`
- `shared/components/portfolio-grid-skeleton/`
- `shared/components/portfolio-timeline-skeleton/`
- `shared/components/portfolio-skills-skeleton/`

### Modified files
- `shared/components/dashboard-filter/dashboard-filter.component.html`
- All 8 dashboard list pages (spacing, skeleton, empty states)
- `portfolio-layout.component.html` (remove content skeleton, keep navbar)
- 6 portfolio pages (add page-specific skeleton)
