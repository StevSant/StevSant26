-- =============================================
-- Base de datos del Portafolio 2026
-- =============================================

-- Tabla: skill_category
CREATE TABLE skill_category (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  approach TEXT
);

-- Tabla: skill
CREATE TABLE skill (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  skill_category_id INT REFERENCES skill_category(id) ON DELETE SET NULL
);

-- Tabla: competitions
CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  organizer TEXT,
  date DATE,
  description TEXT,
  result TEXT
);

-- Tabla: experience
CREATE TABLE experience (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT
);

-- Tabla: event
CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  assisted_at DATE
);

-- Tabla: project (polimórfica)
-- source_id puede ser NULL para proyectos personales
CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  created_at DATE DEFAULT NOW(),
  parent_project_id INT REFERENCES project(id) ON DELETE SET NULL,
  source_id INT,
  source_type TEXT
);

-- Tabla: image (polimórfica)
CREATE TABLE image (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  source_id INT,
  source_type TEXT
);

-- Tabla: skill_usages (relación polimórfica principal)
CREATE TABLE skill_usages (
  id SERIAL PRIMARY KEY,
  skill_id INT NOT NULL REFERENCES skill(id) ON DELETE CASCADE,
  source_id INT NOT NULL,
  source_type TEXT NOT NULL,
  level INT, -- nivel de 1 a 5 o 1 a 10
  description TEXT,
  started_at DATE,
  ended_at DATE
);

-- Tabla: profile (datos públicos del usuario)
-- El id debe coincidir con auth.users.id de Supabase
CREATE TABLE profile (
  id UUID PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  nickname TEXT,
  about TEXT
);

-- NOTA: No se necesita tabla admin, usar Supabase Auth para login

-- =============================================
-- Índices recomendados (para performance)
-- =============================================

CREATE INDEX idx_project_source ON project(source_type, source_id);

CREATE INDEX idx_image_source ON image(source_type, source_id);

CREATE INDEX idx_skill_usage_source ON skill_usages(source_type, source_id);
