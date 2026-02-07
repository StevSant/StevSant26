INSERT INTO skill_category (position) VALUES
(1), -- Idiomas
(2), -- Backend
(3), -- Frontend
(4), -- Móviles
(5), -- Lenguajes de programación
(6), -- Bases de datos
(7), -- Herramientas y entornos
(8), -- Cloud
(9); -- Metodologías y prácticas


INSERT INTO skill_category_translation
(skill_category_id, language_id, name)
VALUES
-- Idiomas
((SELECT id FROM skill_category WHERE position = 1),
 (SELECT id FROM language WHERE code = 'es'),
 'Idiomas'),

((SELECT id FROM skill_category WHERE position = 1),
 (SELECT id FROM language WHERE code = 'en'),
 'Languages'),

-- Backend
((SELECT id FROM skill_category WHERE position = 2),
 (SELECT id FROM language WHERE code = 'es'),
 'Backend'),

((SELECT id FROM skill_category WHERE position = 2),
 (SELECT id FROM language WHERE code = 'en'),
 'Backend'),

-- Frontend
((SELECT id FROM skill_category WHERE position = 3),
 (SELECT id FROM language WHERE code = 'es'),
 'Frontend'),

((SELECT id FROM skill_category WHERE position = 3),
 (SELECT id FROM language WHERE code = 'en'),
 'Frontend'),

-- Móviles
((SELECT id FROM skill_category WHERE position = 4),
 (SELECT id FROM language WHERE code = 'es'),
 'Desarrollo móvil'),

((SELECT id FROM skill_category WHERE position = 4),
 (SELECT id FROM language WHERE code = 'en'),
 'Mobile development'),

-- Lenguajes
((SELECT id FROM skill_category WHERE position = 5),
 (SELECT id FROM language WHERE code = 'es'),
 'Lenguajes de programación'),

((SELECT id FROM skill_category WHERE position = 5),
 (SELECT id FROM language WHERE code = 'en'),
 'Programming languages'),

-- Bases de datos
((SELECT id FROM skill_category WHERE position = 6),
 (SELECT id FROM language WHERE code = 'es'),
 'Bases de datos'),

((SELECT id FROM skill_category WHERE position = 6),
 (SELECT id FROM language WHERE code = 'en'),
 'Databases'),

-- Herramientas
((SELECT id FROM skill_category WHERE position = 7),
 (SELECT id FROM language WHERE code = 'es'),
 'Herramientas y entornos'),

((SELECT id FROM skill_category WHERE position = 7),
 (SELECT id FROM language WHERE code = 'en'),
 'Tools and environments'),

-- Cloud
((SELECT id FROM skill_category WHERE position = 8),
 (SELECT id FROM language WHERE code = 'es'),
 'Cloud'),

((SELECT id FROM skill_category WHERE position = 8),
 (SELECT id FROM language WHERE code = 'en'),
 'Cloud'),

-- Metodologías
((SELECT id FROM skill_category WHERE position = 9),
 (SELECT id FROM language WHERE code = 'es'),
 'Metodologías y prácticas'),

((SELECT id FROM skill_category WHERE position = 9),
 (SELECT id FROM language WHERE code = 'en'),
 'Methodologies and practices');
