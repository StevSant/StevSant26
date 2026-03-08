# ADR 002: Supabase as Backend

**Status:** Accepted

## Context

The portfolio needed a database, authentication, file storage, and REST API. Building a custom backend would add significant complexity and hosting costs for what is essentially a single-user portfolio application.

## Decision

Adopted Supabase (hosted PostgreSQL) as the sole backend. All data access goes through the Supabase JS client via a generic `CrudService`. Row-Level Security (RLS) policies enforce that only the authenticated owner can mutate data, while public read access is open. File uploads use Supabase Storage buckets (`images`, `documents`).

## Consequences

- **Pro:** Zero backend code to maintain — no server, no deployments, no scaling concerns
- **Pro:** Built-in auth, storage, and real-time capabilities
- **Pro:** PostgreSQL gives full relational modeling with foreign keys and joins
- **Con:** Vendor lock-in to Supabase's API surface
- **Con:** Complex queries require SQL functions rather than simple REST calls
- **Con:** Schema changes must be tracked both remotely and in local SQL files (dual-update rule)
