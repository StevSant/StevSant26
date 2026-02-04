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

-- profile (también público)
CREATE POLICY "Public read profile"
ON profile
FOR SELECT
USING (true);
