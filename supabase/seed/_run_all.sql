-- ============================================================
-- Master Seed Script — Executes all seed files in dependency order
-- ============================================================
-- Usage:  psql -f supabase/seed/_run_all.sql
--    or:  run via Supabase dashboard / CLI
-- ============================================================

-- ─── 1. Base / Independent Tables ───────────────────────────
\ir languages.sql
\ir profile.sql
\ir skill_categories.sql

-- ─── 2. Skills (depends on skill_category + language) ───────
\ir skill.sql

-- ─── 3. Other Entities (depend on language for translations)─
\ir competitions.sql
\ir education.sql
\ir events.sql
\ir experience.sql

-- ─── 4. Projects ────────────────────────────────────────────
\ir proyects/streamflow/projects.sql
\ir proyects/hackathon/projects.sql
\ir proyects/mesaya/projects.sql
\ir proyects/rosetta_script/projects.sql
\ir proyects/rosetta_bot/projects.sql

-- ─── 5. Skill Usages (depend on projects + skill + language)─
\ir proyects/streamflow/skill_usages.sql
\ir proyects/hackathon/skill_usages.sql
\ir proyects/mesaya/skill_usages.sql
\ir proyects/rosetta_script/skill_usages.sql
\ir proyects/rosetta_bot/skill_usages.sql

-- ─── 6. Content Sections (depend on projects + language) ────
\ir proyects/streamflow/content_sections.sql
\ir proyects/hackathon/content_sections.sql
\ir proyects/mesaya/content_sections.sql
\ir proyects/rosetta_script/content_sections.sql
\ir proyects/rosetta_bot/content_sections.sql
