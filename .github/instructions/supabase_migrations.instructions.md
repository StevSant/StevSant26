---
applyTo: '**'
---

# Supabase + Copilot SQL Synchronization Rules

This project uses Supabase as the primary backend and database provider. GitHub Copilot (Agent mode with MCP access) must strictly follow the synchronization rules below when generating or modifying SQL, migrations, or database-related logic.

The main goals are:

- Keep local SQL schema fully synchronized with Supabase
- Avoid schema drift between remote and local environments
- Ensure migrations and base schema are always aligned
- Prevent partial or inconsistent database updates

---

## 1. Mandatory Dual Update Rule (Remote + Local)

Whenever Copilot performs ANY database-related operation through MCP (Supabase remote):

- Creating tables
- Altering tables
- Adding columns
- Modifying column types
- Adding indexes
- Adding constraints
- Creating triggers
- Creating functions
- Creating RLS policies
- Updating enums

It MUST also:

1. Update the local SQL schema files accordingly
2. Update the canonical schema definitions
3. Ensure migrations reflect the same change

No remote change is valid unless the local schema is updated in the same task.

---

## 2. Source of Truth Policy

The database structure must follow this hierarchy:

1. Migration files define incremental changes
2. The base schema file reflects the current final structure
3. Supabase remote must match local state exactly

If a migration is created:

- It MUST update the base schema file to reflect the final structure
- It MUST NOT leave the base schema outdated

The base schema file should always represent the full, current database state.

---

## 3. Migration Consistency Rules

When generating SQL migrations:

- Do not create migrations without reflecting changes in the main schema file
- Avoid duplicated logic across migrations
- Never generate a migration that contradicts the current schema
- Always validate column names, types, and constraints against the latest local schema

If a table is modified:

- The migration must include only the delta
- The schema file must reflect the final structure

---

## 4. No Silent Schema Drift

Copilot must never:

- Modify remote schema without updating local files
- Create local migrations without ensuring remote consistency
- Leave tables partially updated
- Rename columns without updating references

Every schema modification must be atomic and consistent.

---

## 5. Table Update Enforcement

If a migration modifies a table:

- The original table definition in local SQL must be updated
- The schema representation must not remain outdated
- Indexes, constraints, and RLS policies must remain consistent

There must never be a case where:

- A migration adds a column
- But the base schema does not include that column

---

## 6. RLS and Policies

Whenever Row-Level Security policies are added or modified:

- Ensure RLS is enabled on the table if required
- Update local schema definitions
- Reflect policy changes clearly in migration files
- Keep naming consistent and deterministic

---

## 7. Validation Checklist Before Completing a Task

Before finalizing any database-related task, Copilot must verify:

- Remote Supabase schema matches local SQL
- Base schema reflects the latest structure
- Migrations are coherent and incremental
- No duplicate table definitions exist
- No outdated schema definitions remain

If synchronization cannot be guaranteed, the task is incomplete.

---

## 8. Absolute Rule

Every change made through Supabase MCP MUST have a corresponding local SQL update.

Remote-only changes are strictly forbidden.
Local-only migrations without remote consistency are strictly forbidden.

Database integrity and synchronization are mandatory.
