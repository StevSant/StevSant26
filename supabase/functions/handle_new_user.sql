-- Function to handle new user creation

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear perfil base
  INSERT INTO public.profile (id, first_name, last_name, nickname)
  VALUES (
    NEW.id,
    '',   -- puedes dejar vacío o poner algo por defecto
    '',
    ''
  );

  -- Crear traducción por defecto (ej: español)
  INSERT INTO public.profile_translation (profile_id, language, about)
  VALUES (
    NEW.id,
    'es',
    'Sobre mí...'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Trigger to call the function on new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear perfil base
  INSERT INTO public.profile (id, first_name, last_name, nickname)
  VALUES (
    NEW.id,
    '',   -- puedes dejar vacío o poner algo por defecto
    '',
    ''
  );

  -- Crear traducción por defecto (ej: español)
  INSERT INTO public.profile_translation (profile_id, language, about)
  VALUES (
    NEW.id,
    'es',
    'Sobre mí...'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

