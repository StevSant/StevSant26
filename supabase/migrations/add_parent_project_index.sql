-- =============================================
-- Index for parent_project_id on project table
-- Improves performance when filtering parent/child projects
-- =============================================

CREATE INDEX IF NOT EXISTS idx_project_parent
ON project(parent_project_id);
