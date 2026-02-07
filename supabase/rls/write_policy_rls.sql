-- =========================
-- BASE TABLES
-- =========================

-- skill_category
CREATE POLICY "Admin write skill_category"
ON skill_category
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- skill
CREATE POLICY "Admin write skill"
ON skill
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- competitions
CREATE POLICY "Admin write competitions"
ON competitions
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- experience
CREATE POLICY "Admin write experience"
ON experience
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- education
CREATE POLICY "Admin write education"
ON education
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- event
CREATE POLICY "Admin write event"
ON event
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- project
CREATE POLICY "Admin write project"
ON project
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- image
CREATE POLICY "Admin write image"
ON image
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- document
CREATE POLICY "Admin write document"
ON document
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- skill_usages
CREATE POLICY "Admin write skill_usages"
ON skill_usages
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- =========================
-- TRANSLATION TABLES
-- =========================

-- skill_category_translation
CREATE POLICY "Admin write skill_category_translation"
ON skill_category_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- skill_translation
CREATE POLICY "Admin write skill_translation"
ON skill_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- competitions_translation
CREATE POLICY "Admin write competitions_translation"
ON competitions_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- experience_translation
CREATE POLICY "Admin write experience_translation"
ON experience_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- education_translation
CREATE POLICY "Admin write education_translation"
ON education_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- event_translation
CREATE POLICY "Admin write event_translation"
ON event_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- project_translation
CREATE POLICY "Admin write project_translation"
ON project_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);


-- skill_usages_translation
CREATE POLICY "Admin write skill_usages_translation"
ON skill_usages_translation
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);
