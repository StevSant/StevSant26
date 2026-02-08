-- ================================================
-- EVENTS SEED FILE
-- Uses 'code' field for stable references
-- ================================================

INSERT INTO event (code, assisted_at, is_archived, is_pinned, position)
VALUES
('supabase_launch_week_15', '2025-07-16', false, false, 1),
('viamatica_20th_anniversary', '2025-08-28', false, true, 2),
('supabase_pitch_day_club_ia', '2025-09-25', false, true, 3),
('cursor_meetup_manta', '2025-10-16', false, false, 4),
('uleam_tech_fest_2025', '2025-11-06', false, true, 5),
('supabase_workshop', '2025-12-06', false, true, 6);

-- ======================
-- TRANSLATIONS
-- ======================

INSERT INTO event_translation (
  event_id,
  language_id,
  name,
  description
)
VALUES

-- ======================
-- SUPABASE Launch WEEK #15
-- ======================
(
  (SELECT id FROM event WHERE code = 'supabase_launch_week_15'),
  (SELECT id FROM language WHERE code = 'es'),
  'Supabase Launch Week #15',
  'Primera introducción a Supabase, donde aprendí sobre la plataforma, su iniciativa, la comunidad global y su enfoque moderno para el desarrollo backend.'
),
(
  (SELECT id FROM event WHERE code = 'supabase_launch_week_15'),
  (SELECT id FROM language WHERE code = 'en'),
  'Supabase Launch Week #15',
  'My first introduction to Supabase, learning about the platform, its initiative, community, and modern backend development approach.'
),

-- ======================
-- VIAMATICA 20TH ANNIVERSARY
-- ======================
(
  (SELECT id FROM event WHERE code = 'viamatica_20th_anniversary'),
  (SELECT id FROM language WHERE code = 'es'),
  'Aniversario 20 años de Viamatica',
  'Evento especial por el 20º aniversario de Viamatica, al que fui invitado como ganador del HackIAthon (tercer lugar). Un espacio de conversación, aprendizaje e inspiración junto a profesionales y talentos del ecosistema tecnológico del Ecuador.'
),
(
  (SELECT id FROM event WHERE code = 'viamatica_20th_anniversary'),
  (SELECT id FROM language WHERE code = 'en'),
  'Viamatica 20th Anniversary',
  'Special event celebrating Viamatica's 20th anniversary. I was invited as a HackIAthon winner (3rd place), sharing ideas and discussions about technology and the future of AI in Ecuador.'
),

-- ======================
-- SUPABASE + CLUB IA ULEAM
-- ======================
(
  (SELECT id FROM event WHERE code = 'supabase_pitch_day_club_ia'),
  (SELECT id FROM language WHERE code = 'es'),
  'Supabase Pitch Day – Club IA ULEAM',
  'Evento organizado por el Club IA ULEAM en colaboración con Supabase, donde se presentaron ideas y proyectos tecnológicos. Presenté StreamFlow, una plataforma musical desarrollada con Supabase, enfocada en innovación y emprendimiento.'
),
(
  (SELECT id FROM event WHERE code = 'supabase_pitch_day_club_ia'),
  (SELECT id FROM language WHERE code = 'en'),
  'Supabase Pitch Day – Club IA ULEAM',
  'Event organized by Club IA ULEAM in partnership with Supabase, where students showcased innovative projects. I presented StreamFlow, a music platform built using Supabase.'
),

-- ======================
-- CURSOR MEETUP MANTA
-- ======================
(
  (SELECT id FROM event WHERE code = 'cursor_meetup_manta'),
  (SELECT id FROM language WHERE code = 'es'),
  'Cursor Meetup – Manta',
  'Primera meetup de Cursor en la ciudad de Manta, realizada en la ULEAM. Un espacio para compartir ideas, aprender de otros desarrolladores y fortalecer la comunidad tecnológica local.'
),
(
  (SELECT id FROM event WHERE code = 'cursor_meetup_manta'),
  (SELECT id FROM language WHERE code = 'en'),
  'Cursor Meetup – Manta',
  'First Cursor meetup held in the city of Manta at ULEAM, bringing together developers and tech enthusiasts to share ideas and strengthen the local tech community.'
),

-- ======================
-- ULEAM TECH FEST 2025
-- ======================
(
  (SELECT id FROM event WHERE code = 'uleam_tech_fest_2025'),
  (SELECT id FROM language WHERE code = 'es'),
  'ULEAM Tech Fest 2025',
  'Participación en el ULEAM Tech Fest 2025 como asistente y miembro del equipo organizador a través del Club IA ULEAM. El evento incluyó bootcamps, proyectos tecnológicos, pósteres académicos y charlas sobre IA, desarrollo de software y tecnologías emergentes.'
),
(
  (SELECT id FROM event WHERE code = 'uleam_tech_fest_2025'),
  (SELECT id FROM language WHERE code = 'en'),
  'ULEAM Tech Fest 2025',
  'Participation in ULEAM Tech Fest 2025 as an attendee and organizing team member through Club IA ULEAM. The event featured bootcamps, tech projects, academic posters, and talks on AI and software development.'
),

-- ======================
-- SUPABASE WORKSHOP
-- ======================
(
  (SELECT id FROM event WHERE code = 'supabase_workshop'),
  (SELECT id FROM language WHERE code = 'es'),
  'Supabase Workshop',
  'Workshop impartido por Tomás Pozo, donde profundizamos en Supabase como solución backend moderna. Se trabajó con autenticación, bases de datos PostgreSQL, APIs automáticas y la integración con IA usando Cursor.'
),
(
  (SELECT id FROM event WHERE code = 'supabase_workshop'),
  (SELECT id FROM language WHERE code = 'en'),
  'Supabase Workshop',
  'Hands-on workshop led by Tomás Pozo, exploring Supabase as a modern backend solution, covering authentication, PostgreSQL databases, auto-generated APIs, and AI integration using Cursor.'
);
