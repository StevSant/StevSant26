INSERT INTO competitions (organizer, date, is_archived, is_pinned, position)
VALUES (
  'Viamatica',
  '2025-08-23',
  false,
  true,
  3
);


INSERT INTO competitions_translation (
  competitions_id,
  language_id,
  name,
  description,
  result
)
VALUES

-- ======================
-- ESPAÑOL
-- ======================
(
  (SELECT id FROM competitions WHERE organizer = 'Viamatica' AND position = 3),
  (SELECT id FROM language WHERE code = 'es'),
  'HackIAthon – Primera Hackathon de IA en Ecuador',
  'Participación en la primera edición del HackIAthon organizado por Viamatica, una competencia enfocada en el desarrollo de soluciones innovadoras con Inteligencia Artificial. La experiencia incluyó trabajo en equipo, aprendizaje intensivo, uso de tecnologías de IA y presentación final ante un jurado especializado. El evento reunió a talentos, mentores y empresas del ecosistema tecnológico del país.',
  'Tercer lugar 🥉 – Top 6 finalistas'
),

-- ======================
-- ENGLISH
-- ======================
(
  (SELECT id FROM competitions WHERE organizer = 'Viamatica' AND position = 3),
  (SELECT id FROM language WHERE code = 'en'),
  'HackIAthon – Ecuador’s First AI Hackathon',
  'Participation in the first edition of HackIAthon organized by Viamatica, a competition focused on building innovative Artificial Intelligence solutions. The experience involved teamwork, intensive learning, AI technologies, and a final pitch presented to a professional jury. The event brought together talent, mentors, and companies from Ecuador’s tech ecosystem.',
  '3rd place 🥉 – Top 6 finalists'
);
