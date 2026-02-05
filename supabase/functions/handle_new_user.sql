-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_language_id INT;
BEGIN
  SELECT id INTO default_language_id
  FROM public.language
  WHERE code = 'es';

  IF default_language_id IS NULL THEN
    RAISE EXCEPTION 'Default language es not found in language table';
  END IF;

  INSERT INTO public.profile (id, first_name, last_name, nickname)
  VALUES (NEW.id, '', '', '');

  INSERT INTO public.profile_translation (profile_id, language_id, about)
  VALUES (NEW.id, default_language_id, 'Sobre mí...');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
