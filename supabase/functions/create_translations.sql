--  Generic function to create translations
CREATE OR REPLACE FUNCTION public.create_translations_for_entity()
RETURNS TRIGGER AS $$
DECLARE
  lang RECORD;
  sql TEXT;
BEGIN
  -- Recorre todos los idiomas
  FOR lang IN SELECT id FROM public.language LOOP

    -- SQL dinámico para cada tabla de traducción
    sql := format(
      'INSERT INTO %I (%I, language_id) VALUES ($1, $2)',
      TG_ARGV[0], -- tabla translation
      TG_ARGV[1]  -- columna FK (event_id, project_id, etc)
    );

    EXECUTE sql USING NEW.id, lang.id;

  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profile
DROP TRIGGER IF EXISTS on_profile_created ON profile;
CREATE TRIGGER on_profile_created
AFTER INSERT ON profile
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'profile_translation',
  'profile_id'
);


-- Trigger for event
DROP TRIGGER IF EXISTS on_event_created ON event;

CREATE TRIGGER on_event_created
AFTER INSERT ON event
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'event_translation',
  'event_id'
);


-- Trigger for project
DROP TRIGGER IF EXISTS on_project_created ON project;
CREATE TRIGGER on_project_created
AFTER INSERT ON project
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'project_translation',
  'project_id'
);


-- Trigger for skill
DROP TRIGGER IF EXISTS on_skill_created ON skill;
CREATE TRIGGER on_skill_created
AFTER INSERT ON skill
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'skill_translation',
  'skill_id'
);


-- Trigger for experience
DROP TRIGGER IF EXISTS on_experience_created ON experience;
CREATE TRIGGER on_experience_created
AFTER INSERT ON experience
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'experience_translation',
  'experience_id'
);

-- Trigger for skill_category
DROP TRIGGER IF EXISTS on_skill_category_created ON skill_category;
CREATE TRIGGER on_skill_category_created
AFTER INSERT ON skill_category
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'skill_category_translation',
  'skill_category_id'
);


-- Trigger for competitions
DROP TRIGGER IF EXISTS on_competitions_created ON competitions;
CREATE TRIGGER on_competitions_created
AFTER INSERT ON competitions
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'competitions_translation',
  'competitions_id'
);


-- Trigger for skill usage
DROP TRIGGER IF EXISTS on_skill_usages_created ON skill_usages;
CREATE TRIGGER on_skill_usages_created
AFTER INSERT ON skill_usages
FOR EACH ROW
EXECUTE FUNCTION public.create_translations_for_entity(
  'skill_usages_translation',
  'skill_usages_id'
);


