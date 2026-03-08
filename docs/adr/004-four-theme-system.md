# ADR 004: Four-Theme System with CSS Custom Properties

**Status:** Accepted

## Context

The portfolio targets recruiters and developers who may browse in different lighting conditions and have varying aesthetic preferences. A single theme limits personalization. CSS-in-JS solutions add runtime cost and complexity.

## Decision

Implemented four themes (Dark Elegant, Light Elegant, Midnight Blue, Warm Sepia) using CSS custom properties defined in `:root` and toggled via class names on the document element. The `ThemeService` manages theme selection, persists to localStorage, and respects `prefers-color-scheme` on first visit. All components reference semantic variables like `--color-bg-primary` and `--color-accent` rather than hard-coded colors.

## Consequences

- **Pro:** Zero runtime JS cost — theme switching is pure CSS class toggle
- **Pro:** Every component automatically respects the active theme
- **Pro:** Easy to add new themes by defining a new variable set
- **Con:** ~200 CSS variables to maintain per theme
- **Con:** Cannot do per-component theme overrides without additional specificity
