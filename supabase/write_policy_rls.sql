-- skill_category
CREATE POLICY "Admin write skill_category"
ON skill_category
FOR ALL
USING (auth.uid() IS NOT NULL);

-- skill
CREATE POLICY "Admin write skill"
ON skill
FOR ALL
USING (auth.uid() IS NOT NULL);

-- competitions
CREATE POLICY "Admin write competitions"
ON competitions
FOR ALL
USING (auth.uid() IS NOT NULL);

-- experience
CREATE POLICY "Admin write experience"
ON experience
FOR ALL
USING (auth.uid() IS NOT NULL);

-- event
CREATE POLICY "Admin write event"
ON event
FOR ALL
USING (auth.uid() IS NOT NULL);

-- project
CREATE POLICY "Admin write project"
ON project
FOR ALL
USING (auth.uid() IS NOT NULL);

-- image
CREATE POLICY "Admin write image"
ON image
FOR ALL
USING (auth.uid() IS NOT NULL);

-- skill_usages
CREATE POLICY "Admin write skill_usages"
ON skill_usages
FOR ALL
USING (auth.uid() IS NOT NULL);
