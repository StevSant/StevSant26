-- =============================================
-- TRANSLATION TABLES
-- =============================================

-- =========================
-- profile_translation
-- =========================
CREATE TABLE profile_translation (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profile(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  about TEXT NOT NULL,

  UNIQUE(profile_id, language)
);

-- =========================
-- skill_category_translation
-- =========================
CREATE TABLE skill_category_translation (
  id SERIAL PRIMARY KEY,
  skill_category_id INT REFERENCES skill_category(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  approach TEXT,

  UNIQUE(skill_category_id, language)
);

-- =========================
-- skill_translation
-- =========================
CREATE TABLE skill_translation (
  id SERIAL PRIMARY KEY,
  skill_id INT REFERENCES skill(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  UNIQUE(skill_id, language)
);

-

-- =========================
-- competitions_translation
-- =========================
CREATE TABLE competitions_translation (
  id SERIAL PRIMARY KEY,
  competitions_id INT REFERENCES competitions(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  result TEXT,

  UNIQUE(competitions_id, language)
);

-- =========================
-- experience_translation
-- =========================
CREATE TABLE experience_translation (
  id SERIAL PRIMARY KEY,
  experience_id INT REFERENCES experience(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,

  UNIQUE(experience_id, language)
);

-- =========================
-- event_translation
-- =========================
CREATE TABLE event_translation (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES event(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  UNIQUE(event_id, language)
);

-- =========================
-- project_translation
-- =========================
CREATE TABLE project_translation (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES project(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  UNIQUE(project_id, language)
);

-- =========================
-- skill_usages_translation
-- =========================
CREATE TABLE skill_usages_translation (
  id SERIAL PRIMARY KEY,
  skill_usages_id INT REFERENCES skill_usages(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  notes TEXT,

  UNIQUE(skill_usages_id, language)
);
