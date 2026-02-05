-- profile
CREATE POLICY "User can manage own profile"
ON profile
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- profile_translation
CREATE POLICY "User can manage own profile_translation"
ON profile_translation
FOR ALL
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);
