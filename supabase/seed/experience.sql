-- =============================================
-- Seed: experience
-- =============================================

INSERT INTO experience (
  code,
  company,
  start_date,
  end_date,
  is_archived,
  is_pinned,
  position,
  company_image_url
)
VALUES (
  'club_ia_uleam',
  'Club IA ULEAM',
  '2025-02-01',
  NULL,
  false,
  true,
  1,
  'https://media.licdn.com/dms/image/v2/D4E0BAQFQbfP6wYLPfQ/company-logo_200_200/B4EZpwVGiAKoAM-/0/1762821172224?e=1772064000&v=beta&t=os0g6Gz9W6DJMl_eV9OvaCuOS9lWRiBi5Tp3o6MsGHE'
),
(
  'personal_projects',
  'Personal Projects',
  '2023-09-15',
  NULL,
  false,
  true,
  2,
  NULL
)
ON CONFLICT (code) DO NOTHING;


INSERT INTO experience_translation (
  experience_id,
  language_id,
  role,
  description
)
VALUES

-- ======================
-- Club IA ULEAM
-- ======================
(
  (SELECT id FROM experience WHERE code = 'club_ia_uleam'),
  (SELECT id FROM language WHERE code = 'es'),
  'Content Manager',
  'Responsable de la creación y gestión de contenidos del Club IA ULEAM. Planifico y preparo talleres, apoyo en la definición de temáticas para eventos y colaboro en la organización de actividades enfocadas en inteligencia artificial, desarrollo de software y tecnologías emergentes.'
),
(
  (SELECT id FROM experience WHERE code = 'club_ia_uleam'),
  (SELECT id FROM language WHERE code = 'en'),
  'Content Manager',
  'Responsible for content creation and management at Club IA ULEAM. I design and prepare workshops, contribute to defining event topics, and support the organization of activities focused on artificial intelligence, software development, and emerging technologies.'
),

-- ======================
-- Personal Projects
-- ======================
(
  (SELECT id FROM experience WHERE code = 'personal_projects'),
  (SELECT id FROM language WHERE code = 'es'),
  'Full Stack & Backend Developer',
  'Desarrollo continuo de proyectos personales enfocados en backend y full stack desde septiembre de 2023. Diseño y construcción de APIs REST, autenticación, lógica de negocio, bases de datos relacionales y no relacionales, así como interfaces frontend. Uso de tecnologías modernas como Django, FastAPI, NestJS, Angular, PostgreSQL, Supabase, Docker y herramientas asistidas por IA para acelerar el desarrollo y mejorar la calidad del código.'
),
(
  (SELECT id FROM experience WHERE code = 'personal_projects'),
  (SELECT id FROM language WHERE code = 'en'),
  'Full Stack & Backend Developer',
  'Ongoing development of personal projects focused on backend and full stack development since September 2023. Design and implementation of REST APIs, authentication systems, business logic, relational and non-relational databases, and frontend interfaces. Working with modern technologies such as Django, FastAPI, NestJS, Angular, PostgreSQL, Supabase, Docker, and AI-assisted tools to improve development speed and code quality.'
);
