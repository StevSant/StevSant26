INSERT INTO language (code, name) VALUES
('es', 'Español'),
('en', 'English'),
ON CONFLICT (code) DO NOTHING;
