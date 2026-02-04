CREATE POLICY "User can manage own profile"
ON profile
FOR ALL
USING (auth.uid() = id);
