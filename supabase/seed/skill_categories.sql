-- =============================================
-- Seed: skill_category
-- =============================================

INSERT INTO skill_category (code, position) VALUES
('languages', 1),
('backend', 2),
('frontend', 3),
('mobile', 4),
('programming_languages', 5),
('databases', 6),
('tools', 7),
('cloud', 8),
('methodologies', 9);


INSERT INTO skill_category_translation
(skill_category_id, language_id, name)
VALUES
-- Idiomas
((SELECT id FROM skill_category WHERE code = 'languages'),
 (SELECT id FROM language WHERE code = 'es'),
 'Idiomas'),

((SELECT id FROM skill_category WHERE code = 'languages'),
 (SELECT id FROM language WHERE code = 'en'),
 'Languages'),

-- Backend
((SELECT id FROM skill_category WHERE code = 'backend'),
 (SELECT id FROM language WHERE code = 'es'),
 'Backend'),

((SELECT id FROM skill_category WHERE code = 'backend'),
 (SELECT id FROM language WHERE code = 'en'),
 'Backend'),

-- Frontend
((SELECT id FROM skill_category WHERE code = 'frontend'),
 (SELECT id FROM language WHERE code = 'es'),
 'Frontend'),

((SELECT id FROM skill_category WHERE code = 'frontend'),
 (SELECT id FROM language WHERE code = 'en'),
 'Frontend'),

-- Móviles
((SELECT id FROM skill_category WHERE code = 'mobile'),
 (SELECT id FROM language WHERE code = 'es'),
 'Desarrollo móvil'),

((SELECT id FROM skill_category WHERE code = 'mobile'),
 (SELECT id FROM language WHERE code = 'en'),
 'Mobile development'),

-- Lenguajes
((SELECT id FROM skill_category WHERE code = 'programming_languages'),
 (SELECT id FROM language WHERE code = 'es'),
 'Lenguajes de programación'),

((SELECT id FROM skill_category WHERE code = 'programming_languages'),
 (SELECT id FROM language WHERE code = 'en'),
 'Programming languages'),

-- Bases de datos
((SELECT id FROM skill_category WHERE code = 'databases'),
 (SELECT id FROM language WHERE code = 'es'),
 'Bases de datos'),

((SELECT id FROM skill_category WHERE code = 'databases'),
 (SELECT id FROM language WHERE code = 'en'),
 'Databases'),

-- Herramientas
((SELECT id FROM skill_category WHERE code = 'tools'),
 (SELECT id FROM language WHERE code = 'es'),
 'Herramientas y entornos'),

((SELECT id FROM skill_category WHERE code = 'tools'),
 (SELECT id FROM language WHERE code = 'en'),
 'Tools and environments'),

-- Cloud
((SELECT id FROM skill_category WHERE code = 'cloud'),
 (SELECT id FROM language WHERE code = 'es'),
 'Cloud'),

((SELECT id FROM skill_category WHERE code = 'cloud'),
 (SELECT id FROM language WHERE code = 'en'),
 'Cloud'),

-- Metodologías
((SELECT id FROM skill_category WHERE code = 'methodologies'),
 (SELECT id FROM language WHERE code = 'es'),
 'Metodologías y prácticas'),

((SELECT id FROM skill_category WHERE code = 'methodologies'),
 (SELECT id FROM language WHERE code = 'en'),
 'Methodologies and practices');
