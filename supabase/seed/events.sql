INSERT INTO event (id, assisted_at, position)
VALUES
(1, '2024-06-01', 1),
(2, '2025-01-15', 2)
ON CONFLICT DO NOTHING;



INSERT INTO event_translation (event_id, language_id, name, description)
SELECT
  e.id,
  l.id,
  CASE
    WHEN e.id=1 AND l.code='es' THEN 'Hackathon Universitario'
    WHEN e.id=1 AND l.code='en' THEN 'University Hackathon'

    WHEN e.id=2 AND l.code='es' THEN 'Conferencia de Software'
    WHEN e.id=2 AND l.code='en' THEN 'Software Conference'
  END,
  'Evento tecnológico'
FROM event e
CROSS JOIN language l
ON CONFLICT DO NOTHING;
