-- ================================================
-- COMPETITIONS SEED FILE
-- Uses 'code' field for stable references
-- ================================================

INSERT INTO competitions (code, organizer, date, is_archived, is_pinned, position)
VALUES (
  'hackiathon_viamatica_2025',
  'Viamatica',
  '2025-08-23',
  false,
  true,
  3
);

-- ======================
-- TRANSLATIONS
-- ======================

INSERT INTO competitions_translation (
  competitions_id,
  language_id,
  name,
  description,
  result
)
VALUES
-- ESPAÑOL
(
  (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2025'),
  (SELECT id FROM language WHERE code = 'es'),
  'HackIAthon – Primera Hackathon de IA en Ecuador',
  'Participación en la primera edición del HackIAthon organizado por Viamatica, una competencia enfocada en el desarrollo de soluciones innovadoras con Inteligencia Artificial. La experiencia incluyó trabajo en equipo, aprendizaje intensivo, uso de tecnologías de IA y presentación final ante un jurado especializado. El evento reunió a talentos, mentores y empresas del ecosistema tecnológico del país.',
  'Tercer lugar 🥉 – Top 6 finalistas'
),
-- ENGLISH
(
  (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2025'),
  (SELECT id FROM language WHERE code = 'en'),
  'HackIAthon – Ecuador's First AI Hackathon',
  'Participation in the first edition of HackIAthon organized by Viamatica, a competition focused on building innovative Artificial Intelligence solutions. The experience involved teamwork, intensive learning, AI technologies, and a final pitch presented to a professional jury. The event brought together talent, mentors, and companies from Ecuador's tech ecosystem.',
  '3rd place 🥉 – Top 6 finalists'
);

-- ================================================
-- HackIAthon 2026 — Viamatica (2nd edition) — 1st place
-- ================================================

INSERT INTO competitions (code, organizer, date, is_archived, is_pinned, position)
VALUES (
  'hackiathon_viamatica_2026',
  'Viamatica',
  '2026-06-15',
  false,
  true,
  1
);

INSERT INTO competitions_translation (
  competitions_id,
  language_id,
  name,
  description,
  result
)
VALUES
-- ESPAÑOL
(
  (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2026'),
  (SELECT id FROM language WHERE code = 'es'),
  'HackIAthon 2026 – Detección de Fraude con IA',
  'Segunda edición del HackIAthon organizado por Viamatica, esta vez en el reto de Aseguradora del Sur. Tras obtener el 3er lugar en la primera edición, regresé junto al equipo 404 Not Founders y desarrollamos Centinela IA, una plataforma de IA híbrida y explicable para detectar posibles fraudes en siniestros de seguros, combinando reglas de negocio, machine learning y un agente conversacional. El proyecto fue presentado en el Pitch Day final ante un jurado especializado y obtuvo el primer lugar de la edición 2026.',
  'Primer lugar 🥇 – Edición 2026'
),
-- ENGLISH
(
  (SELECT id FROM competitions WHERE code = 'hackiathon_viamatica_2026'),
  (SELECT id FROM language WHERE code = 'en'),
  'HackIAthon 2026 – AI Fraud Detection',
  'Second edition of the HackIAthon organized by Viamatica, this time tackling the Aseguradora del Sur challenge. After placing 3rd in the first edition, I returned with team 404 Not Founders and we built Centinela IA, an explainable hybrid-AI platform to detect possible fraud in insurance claims, combining business rules, machine learning, and a conversational agent. The project was presented at the final Pitch Day before a professional jury and won 1st place in the 2026 edition.',
  '1st place 🥇 – 2026 edition'
);
