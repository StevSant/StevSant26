INSERT INTO skill (skill_category_id, position)
VALUES
-- Idiomas
((SELECT id FROM skill_category WHERE position = 1), 1),
((SELECT id FROM skill_category WHERE position = 1), 2),

-- Backend
((SELECT id FROM skill_category WHERE position = 2), 1),
((SELECT id FROM skill_category WHERE position = 2), 2),
((SELECT id FROM skill_category WHERE position = 2), 3),
((SELECT id FROM skill_category WHERE position = 2), 4),
((SELECT id FROM skill_category WHERE position = 2), 5),

-- Frontend
((SELECT id FROM skill_category WHERE position = 3), 1),
((SELECT id FROM skill_category WHERE position = 3), 2),

-- Móviles
((SELECT id FROM skill_category WHERE position = 4), 1),

-- Lenguajes
((SELECT id FROM skill_category WHERE position = 5), 1),
((SELECT id FROM skill_category WHERE position = 5), 2),
((SELECT id FROM skill_category WHERE position = 5), 3),
((SELECT id FROM skill_category WHERE position = 5), 4),

-- Bases de datos
((SELECT id FROM skill_category WHERE position = 6), 1),
((SELECT id FROM skill_category WHERE position = 6), 2),
((SELECT id FROM skill_category WHERE position = 6), 3),

-- Herramientas
((SELECT id FROM skill_category WHERE position = 7), 1),
((SELECT id FROM skill_category WHERE position = 7), 2),
((SELECT id FROM skill_category WHERE position = 7), 3),
((SELECT id FROM skill_category WHERE position = 7), 4),
((SELECT id FROM skill_category WHERE position = 7), 5),

-- Cloud
((SELECT id FROM skill_category WHERE position = 8), 1),
((SELECT id FROM skill_category WHERE position = 8), 2),
((SELECT id FROM skill_category WHERE position = 8), 3),

-- Metodologías
((SELECT id FROM skill_category WHERE position = 9), 1),
((SELECT id FROM skill_category WHERE position = 9), 2),
((SELECT id FROM skill_category WHERE position = 9), 3);



INSERT INTO skill_translation (skill_id, language_id, name, description)
VALUES

-- ======================
-- IDIOMAS
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 1 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Español',
  'Lengua materna, comunicación oral y escrita fluida en contextos técnicos y profesionales.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 1 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Spanish',
  'Native language, fluent oral and written communication in technical and professional contexts.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 1 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'Inglés',
  'Nivel avanzado C1, lectura de documentación técnica y comunicación profesional.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 1 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'English',
  'Advanced C1 level, able to read technical documentation and communicate professionally.'
),

-- ======================
-- BACKEND
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Django',
  'Desarrollo de aplicaciones web robustas, seguras y escalables con arquitectura MVC.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Django',
  'Development of robust, secure and scalable web applications using MVC architecture.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'Django REST Framework',
  'Diseño e implementación de APIs RESTful con autenticación, permisos y serialización.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'Django REST Framework',
  'Design and implementation of RESTful APIs with authentication, permissions and serialization.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'es'),
  'Flask',
  'Creación de aplicaciones web y APIs ligeras priorizando simplicidad y flexibilidad.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'en'),
  'Flask',
  'Creation of lightweight web applications and APIs focusing on simplicity and flexibility.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 4),
  (SELECT id FROM language WHERE code = 'es'),
  'FastAPI',
  'Desarrollo de APIs modernas y de alto rendimiento con validaciones y documentación automática.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 4),
  (SELECT id FROM language WHERE code = 'en'),
  'FastAPI',
  'Development of modern, high-performance APIs with validation and automatic documentation.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 5),
  (SELECT id FROM language WHERE code = 'es'),
  'NestJS',
  'Construcción de APIs escalables en Node.js usando arquitectura modular y TypeScript.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 2 AND s.position = 5),
  (SELECT id FROM language WHERE code = 'en'),
  'NestJS',
  'Building scalable Node.js APIs using modular architecture and TypeScript.'
),

-- ======================
-- FRONTEND
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 3 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Angular',
  'Framework principal para desarrollo de aplicaciones web SPA estructuradas.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 3 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Angular',
  'Main framework for building structured single-page web applications.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 3 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'React',
  'Conocimientos básicos para desarrollo de interfaces basadas en componentes.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 3 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'React',
  'Basic knowledge for building component-based user interfaces.'
),

-- ======================
-- MÓVILES
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 4 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Kotlin',
  'Conocimientos básicos en desarrollo de aplicaciones móviles Android.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 4 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Kotlin',
  'Basic knowledge of Android mobile application development.'
),

-- ======================
-- LENGUAJES DE PROGRAMACIÓN
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Python',
  'Lenguaje principal para desarrollo backend, automatización y scripting.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Python',
  'Primary language for backend development, automation and scripting.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'JavaScript',
  'Lenguaje utilizado en desarrollo frontend y backend con frameworks modernos.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'JavaScript',
  'Language used for frontend and backend development with modern frameworks.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'es'),
  'TypeScript',
  'Uso de tipado estático para mejorar la mantenibilidad del código.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'en'),
  'TypeScript',
  'Use of static typing to improve code maintainability.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 4),
  (SELECT id FROM language WHERE code = 'es'),
  'Java / Kotlin',
  'Conocimientos básicos en lenguajes orientados a objetos.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 5 AND s.position = 4),
  (SELECT id FROM language WHERE code = 'en'),
  'Java / Kotlin',
  'Basic knowledge of object-oriented programming languages.'
),

-- ======================
-- BASES DE DATOS
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 6 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'MySQL',
  'Gestión de bases de datos relacionales y diseño de esquemas.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 6 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'MySQL',
  'Management of relational databases and schema design.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 6 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'PostgreSQL',
  'Uso de bases de datos avanzadas con consultas complejas.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 6 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'PostgreSQL',
  'Use of advanced databases with complex queries.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 6 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'es'),
  'MongoDB',
  'Manejo de bases de datos NoSQL orientadas a documentos.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 6 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'en'),
  'MongoDB',
  'Handling of document-oriented NoSQL databases.'
),

-- ======================
-- HERRAMIENTAS
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Git',
  'Control de versiones y trabajo colaborativo en equipos de desarrollo.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Git',
  'Version control and collaborative development workflows.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'Docker',
  'Creación y gestión de contenedores para entornos de desarrollo y despliegue.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'Docker',
  'Creation and management of containers for development and deployment.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'es'),
  'GitHub / GitLab',
  'Gestión de repositorios, revisiones de código y pipelines CI/CD.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'en'),
  'GitHub / GitLab',
  'Repository management, code reviews and CI/CD pipelines.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 4),
  (SELECT id FROM language WHERE code = 'es'),
  'Postman',
  'Pruebas, documentación y validación de APIs.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 4),
  (SELECT id FROM language WHERE code = 'en'),
  'Postman',
  'API testing, documentation and validation.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 5),
  (SELECT id FROM language WHERE code = 'es'),
  'Visual Studio Code',
  'Editor principal de desarrollo con extensiones de productividad.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 7 AND s.position = 5),
  (SELECT id FROM language WHERE code = 'en'),
  'Visual Studio Code',
  'Primary development editor with productivity extensions.'
),

-- ======================
-- CLOUD
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 8 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Vercel',
  'Despliegue de aplicaciones frontend y serverless.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 8 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Vercel',
  'Deployment of frontend and serverless applications.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 8 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'Azure',
  'Uso de servicios cloud para despliegue y gestión de aplicaciones.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 8 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'Azure',
  'Use of cloud services for application deployment and management.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 8 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'es'),
  'Google Cloud Run',
  'Despliegue de contenedores escalables bajo demanda.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 8 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'en'),
  'Google Cloud Run',
  'On-demand scalable container deployment.'
),

-- ======================
-- METODOLOGÍAS
-- ======================
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 9 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'es'),
  'Scrum',
  'Trabajo en equipos ágiles usando roles, ceremonias y entregas iterativas.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 9 AND s.position = 1),
  (SELECT id FROM language WHERE code = 'en'),
  'Scrum',
  'Working in agile teams using defined roles, ceremonies and iterations.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 9 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'es'),
  'Desarrollo ágil',
  'Aplicación de principios ágiles para entrega continua de valor.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 9 AND s.position = 2),
  (SELECT id FROM language WHERE code = 'en'),
  'Agile development',
  'Application of agile principles for continuous value delivery.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 9 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'es'),
  'Integración continua',
  'Automatización de pruebas e integración frecuente de código.'
),
(
  (SELECT s.id FROM skill s JOIN skill_category c ON c.id = s.skill_category_id
   WHERE c.position = 9 AND s.position = 3),
  (SELECT id FROM language WHERE code = 'en'),
  'Continuous integration',
  'Automation of testing and frequent code integration.'
);
