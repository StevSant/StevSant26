-- =============================================
-- Base de datos del Portafolio 2026 (Multilenguaje)
-- =============================================

-- =========================
-- Tabla: profile
-- =========================
CREATE TABLE profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  nickname TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  instagram_url TEXT,
  whatsapp TEXT
);

-- =========================
-- Tabla: cv_document
-- =========================
CREATE TABLE cv_document (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_name TEXT,
  label TEXT,
  language_id INT REFERENCES language(id) ON DELETE SET NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- Tabla: skill_category
-- =========================
CREATE TABLE skill_category (
  id SERIAL PRIMARY KEY,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: skill
-- =========================
CREATE TABLE skill (
  id SERIAL PRIMARY KEY,
  skill_category_id INT REFERENCES skill_category(id) ON DELETE SET NULL,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: competitions
-- =========================
CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,
  organizer TEXT,
  date DATE,
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
  start_date DATE,
  end_date DATE,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: event
-- =========================
CREATE TABLE event (
  id SERIAL PRIMARY KEY,
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
  url TEXT,
  created_at DATE DEFAULT NOW(),
  parent_project_id INT REFERENCES project(id) ON DELETE SET NULL,
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
  started_at DATE,
  ended_at DATE,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  position INT
);

-- =========================
-- Tabla: language
-- =========================
CREATE TABLE language (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'es', 'en', 'fr'
  name TEXT NOT NULL        -- 'Español', 'English', 'Français'
);

