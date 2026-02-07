-- =========================
-- BASE TABLES
-- =========================

-- skill_category
CREATE POLICY "Public read skill_category"
ON skill_category
FOR SELECT
USING (true);

-- skill
CREATE POLICY "Public read skill"
ON skill
FOR SELECT
USING (true);

-- competitions
CREATE POLICY "Public read competitions"
ON competitions
FOR SELECT
USING (true);

-- experience
CREATE POLICY "Public read experience"
ON experience
FOR SELECT
USING (true);

-- education
CREATE POLICY "Public read education"
ON education
FOR SELECT
USING (true);

-- event
CREATE POLICY "Public read event"
ON event
FOR SELECT
USING (true);

-- project
CREATE POLICY "Public read project"
ON project
FOR SELECT
USING (true);

-- image
CREATE POLICY "Public read image"
ON image
FOR SELECT
USING (true);

-- skill_usages
CREATE POLICY "Public read skill_usages"
ON skill_usages
FOR SELECT
USING (true);

-- document
CREATE POLICY "Public read document"
ON document
FOR SELECT
USING (true);

-- profile
CREATE POLICY "Public read profile"
ON profile
FOR SELECT
USING (true);


-- =========================
-- TRANSLATION TABLES
-- =========================

-- skill_category_translation
CREATE POLICY "Public read skill_category_translation"
ON skill_category_translation
FOR SELECT
USING (true);

-- skill_translation
CREATE POLICY "Public read skill_translation"
ON skill_translation
FOR SELECT
USING (true);

-- competitions_translation
CREATE POLICY "Public read competitions_translation"
ON competitions_translation
FOR SELECT
USING (true);

-- experience_translation
CREATE POLICY "Public read experience_translation"
ON experience_translation
FOR SELECT
USING (true);

-- education_translation
CREATE POLICY "Public read education_translation"
ON education_translation
FOR SELECT
USING (true);

-- event_translation
CREATE POLICY "Public read event_translation"
ON event_translation
FOR SELECT
USING (true);

-- project_translation
CREATE POLICY "Public read project_translation"
ON project_translation
FOR SELECT
USING (true);


-- skill_usages_translation
CREATE POLICY "Public read skill_usages_translation"
ON skill_usages_translation
FOR SELECT
USING (true);

-- profile_translation
CREATE POLICY "Public read profile_translation"
ON profile_translation
FOR SELECT
USING (true);
