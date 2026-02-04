-- =============================================
-- Base de datos del Portafolio 2026
-- =============================================
-- =========================
-- Tabla: skill_category
-- =========================
CREATE TABLE skill_category (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  approach TEXT,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: skill
-- =========================
CREATE TABLE skill (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  skill_category_id INT REFERENCES skill_category(id) ON DELETE
  SET
    NULL,
    is_archived BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    position INT
);

-- =========================
-- Tabla: competitions
-- =========================
CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  organizer TEXT,
  date DATE,
  description TEXT,
  result TEXT,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: experience
-- =========================
CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: event
-- =========================
CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  assisted_at DATE,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: project (polimórfica)
-- =========================
CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  created_at DATE DEFAULT NOW(),
  parent_project_id INT REFERENCES project(id) ON DELETE
  SET
    NULL,
    source_id INT,
    source_type TEXT,
    is_archived BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    position INT
);

-- =========================
-- Tabla: image (polimórfica)
-- =========================
CREATE TABLE image (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  source_id INT,
  source_type TEXT,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: skill_usages (polimórfica)
-- =========================
CREATE TABLE skill_usages (
  id SERIAL PRIMARY KEY,
  skill_id INT NOT NULL REFERENCES skill(id) ON DELETE CASCADE,
  source_id INT NOT NULL,
  source_type TEXT NOT NULL,
  level INT,
  description TEXT,
  started_at DATE,
  ended_at DATE,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: profile
-- =========================
  CREATE TABLE profile (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    nickname TEXT,
    about TEXT
  );

-- =============================================
-- Índices recomendados
-- =============================================
CREATE INDEX idx_project_source ON project(source_type, source_id);

CREATE INDEX idx_image_source ON image(source_type, source_id);

CREATE INDEX idx_skill_usage_source ON skill_usages(source_type, source_id);
