# ADR 003: Signal-Based State Management

**Status:** Accepted

## Context

Angular 21 introduced stable signals as a reactive primitive. The project needed a state management approach that was simple, performant, and aligned with Angular's direction. Libraries like NgRx or Akita add significant boilerplate for a portfolio-sized application.

## Decision

Use Angular signals exclusively for component and service state. Services expose `signal()` and `computed()` values directly. No state management library is used. The `PortfolioDataService` holds all portfolio data as signals, loaded once on initialization and consumed reactively by all child components.

## Consequences

- **Pro:** Minimal boilerplate — no actions, reducers, or effects
- **Pro:** Fine-grained reactivity with `computed()` — only affected views re-render
- **Pro:** Aligned with Angular's roadmap (signal-based components, zoneless change detection)
- **Con:** No time-travel debugging or DevTools integration
- **Con:** State is not serializable/restorable (acceptable for a read-heavy portfolio)
