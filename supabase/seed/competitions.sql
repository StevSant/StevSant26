INSERT INTO competitions (id, organizer, date, position)
VALUES
(1, 'Universidad', '2023-11-01', 1)
ON CONFLICT DO NOTHING;

INSERT INTO competitions_translation (competitions_id, language_id, name, description, result)
SELECT
  c.id,
  l.id,
  CASE
    WHEN l.code='es' THEN 'Concurso de programación'
    WHEN l.code='en' THEN 'Programming contest'
  END,
  'Competencia técnica',
  'Primer lugar'
FROM competitions c
CROSS JOIN language l
ON CONFLICT DO NOTHING;
