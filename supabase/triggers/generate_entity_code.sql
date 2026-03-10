-- Function: generates a code from table_name + id if code is NULL or empty
CREATE OR REPLACE FUNCTION generate_entity_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := TG_TABLE_NAME || '_' || NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all entity tables with a `code` column
CREATE TRIGGER trg_generate_code_skill_category
  BEFORE INSERT ON skill_category
  FOR EACH ROW EXECUTE FUNCTION generate_entity_code();

CREATE TRIGGER trg_generate_code_skill
  BEFORE INSERT ON skill
  FOR EACH ROW EXECUTE FUNCTION generate_entity_code();

CREATE TRIGGER trg_generate_code_competitions
  BEFORE INSERT ON competitions
  FOR EACH ROW EXECUTE FUNCTION generate_entity_code();

CREATE TRIGGER trg_generate_code_experience
  BEFORE INSERT ON experience
  FOR EACH ROW EXECUTE FUNCTION generate_entity_code();

CREATE TRIGGER trg_generate_code_education
  BEFORE INSERT ON education
  FOR EACH ROW EXECUTE FUNCTION generate_entity_code();

CREATE TRIGGER trg_generate_code_event
  BEFORE INSERT ON event
  FOR EACH ROW EXECUTE FUNCTION generate_entity_code();

CREATE TRIGGER trg_generate_code_project
  BEFORE INSERT ON project
  FOR EACH ROW EXECUTE FUNCTION generate_entity_code();
