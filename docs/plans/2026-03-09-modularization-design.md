# Codebase Modularization Design

**Date:** 2026-03-09

## Problem

Many components use inline templates/styles, large monolithic components and services exist, and the global styles.css is 1,036 lines in a single file.

## Design

### Phase A: File Structure Cleanup

Extract inline templates from 7 components to separate `.html` files:
- portfolio-timeline-skeleton, portfolio-skills-skeleton, portfolio-grid-skeleton, portfolio-home-skeleton
- dashboard-list-skeleton, progressive-image, toast (also extract inline styles to `.css`)

Components with tiny templates (<10 lines) stay inline.

### Phase B: Split analytics.component + analytics.service

**analytics.component (1,138 HTML + 433 TS)** → 6 widget sub-components:
- analytics-overview-cards, analytics-visitors-chart, analytics-top-pages
- analytics-referrers, analytics-devices, analytics-geography

**analytics.service (1,072 lines)** → 5 specialized services:
- visitor-analytics.service, content-analytics.service, device-analytics.service
- geo-analytics.service, analytics-utils.service

### Phase C: Split portfolio-home

**portfolio-home.component (481 HTML + 210 TS)** → 4 child components:
- portfolio-hero, portfolio-about, portfolio-featured-projects, portfolio-skills-ticker

### Phase D: Split styles.css by domain

**styles.css (1,036 lines)** → 7 domain files:
- base.css, typography.css, buttons.css, cards.css, forms.css, animations.css, layout.css

Main styles.css becomes thin `@import` file.

## Files Summary

| Phase | New Files | Modified Files |
|-------|-----------|----------------|
| A | 7 .html, 1 .css | 7 .ts files |
| B | ~6 components, ~5 services | analytics.component (shell), delete old service |
| C | 4 components | portfolio-home (shell) |
| D | 7 CSS files | styles.css (imports only) |
