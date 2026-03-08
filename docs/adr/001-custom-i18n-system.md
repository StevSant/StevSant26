# ADR 001: Custom Signal-Based i18n System

**Status:** Accepted

## Context

The portfolio needed multi-language support (Spanish + English). Popular libraries like `ngx-translate` rely heavily on RxJS Observables, which conflicts with Angular's signal-based reactivity model adopted in this project. We also needed tight integration with Supabase translation tables for entity-level translations.

## Decision

Built a custom `TranslateService` using Angular signals instead of adopting `ngx-translate`. The service loads JSON translation files from `/assets/i18n/`, exposes `instant(key)` for synchronous lookups and `get(key)` as a computed signal. Language preference is persisted to localStorage.

## Consequences

- **Pro:** Zero-dependency, signal-native reactivity — templates update automatically when language changes
- **Pro:** Full control over interpolation and fallback behavior
- **Pro:** Simpler mental model — no Observable subscriptions to manage
- **Con:** Must maintain translation files manually (no extraction tooling)
- **Con:** No pluralization rules built in (not needed for current scope)
