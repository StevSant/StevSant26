-- =============================================
-- Seed: skill
-- =============================================

INSERT INTO skill (code, skill_category_id, position)
VALUES
-- Idiomas
('spanish', (SELECT id FROM skill_category WHERE code = 'languages'), 1),
('english', (SELECT id FROM skill_category WHERE code = 'languages'), 2),

-- Backend
('django', (SELECT id FROM skill_category WHERE code = 'backend'), 1),
('drf', (SELECT id FROM skill_category WHERE code = 'backend'), 2),
('flask', (SELECT id FROM skill_category WHERE code = 'backend'), 3),
('fastapi', (SELECT id FROM skill_category WHERE code = 'backend'), 4),
('nestjs', (SELECT id FROM skill_category WHERE code = 'backend'), 5),

-- Frontend
('angular', (SELECT id FROM skill_category WHERE code = 'frontend'), 1),
('react', (SELECT id FROM skill_category WHERE code = 'frontend'), 2),

-- Móviles
('kotlin', (SELECT id FROM skill_category WHERE code = 'mobile'), 1),

-- Lenguajes
('python', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 1),
('javascript', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 2),
('typescript', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 3),
('java_kotlin', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 4),

-- Bases de datos
('mysql', (SELECT id FROM skill_category WHERE code = 'databases'), 1),
('postgresql', (SELECT id FROM skill_category WHERE code = 'databases'), 2),
('mongodb', (SELECT id FROM skill_category WHERE code = 'databases'), 3),

-- Herramientas
('git', (SELECT id FROM skill_category WHERE code = 'tools'), 1),
('docker', (SELECT id FROM skill_category WHERE code = 'tools'), 2),
('github_gitlab', (SELECT id FROM skill_category WHERE code = 'tools'), 3),
('postman', (SELECT id FROM skill_category WHERE code = 'tools'), 4),
('vscode', (SELECT id FROM skill_category WHERE code = 'tools'), 5),

-- Cloud
('vercel', (SELECT id FROM skill_category WHERE code = 'cloud'), 1),
('azure', (SELECT id FROM skill_category WHERE code = 'cloud'), 2),
('gcloud_run', (SELECT id FROM skill_category WHERE code = 'cloud'), 3),

-- Metodologías
('scrum', (SELECT id FROM skill_category WHERE code = 'methodologies'), 1),
('agile', (SELECT id FROM skill_category WHERE code = 'methodologies'), 2),
('ci_cd', (SELECT id FROM skill_category WHERE code = 'methodologies'), 3);



INSERT INTO skill_translation (skill_id, language_id, name, description)
VALUES

-- ======================
-- IDIOMAS
-- ======================
(
  (SELECT id FROM skill WHERE code = 'spanish'),
  (SELECT id FROM language WHERE code = 'es'),
  'Español',
  'Lengua materna, comunicación oral y escrita fluida en contextos técnicos y profesionales.'
),
(
  (SELECT id FROM skill WHERE code = 'spanish'),
  (SELECT id FROM language WHERE code = 'en'),
  'Spanish',
  'Native language, fluent oral and written communication in technical and professional contexts.'
),
(
  (SELECT id FROM skill WHERE code = 'english'),
  (SELECT id FROM language WHERE code = 'es'),
  'Inglés',
  'Nivel avanzado C1, lectura de documentación técnica y comunicación profesional.'
),
(
  (SELECT id FROM skill WHERE code = 'english'),
  (SELECT id FROM language WHERE code = 'en'),
  'English',
  'Advanced C1 level, able to read technical documentation and communicate professionally.'
),

-- ======================
-- BACKEND
-- ======================
(
  (SELECT id FROM skill WHERE code = 'django'),
  (SELECT id FROM language WHERE code = 'es'),
  'Django',
  'Desarrollo de aplicaciones web robustas, seguras y escalables con arquitectura MVC.'
),
(
  (SELECT id FROM skill WHERE code = 'django'),
  (SELECT id FROM language WHERE code = 'en'),
  'Django',
  'Development of robust, secure and scalable web applications using MVC architecture.'
),
(
  (SELECT id FROM skill WHERE code = 'drf'),
  (SELECT id FROM language WHERE code = 'es'),
  'Django REST Framework',
  'Diseño e implementación de APIs RESTful con autenticación, permisos y serialización.'
),
(
  (SELECT id FROM skill WHERE code = 'drf'),
  (SELECT id FROM language WHERE code = 'en'),
  'Django REST Framework',
  'Design and implementation of RESTful APIs with authentication, permissions and serialization.'
),
(
  (SELECT id FROM skill WHERE code = 'flask'),
  (SELECT id FROM language WHERE code = 'es'),
  'Flask',
  'Creación de aplicaciones web y APIs ligeras priorizando simplicidad y flexibilidad.'
),
(
  (SELECT id FROM skill WHERE code = 'flask'),
  (SELECT id FROM language WHERE code = 'en'),
  'Flask',
  'Creation of lightweight web applications and APIs focusing on simplicity and flexibility.'
),
(
  (SELECT id FROM skill WHERE code = 'fastapi'),
  (SELECT id FROM language WHERE code = 'es'),
  'FastAPI',
  'Desarrollo de APIs modernas y de alto rendimiento con validaciones y documentación automática.'
),
(
  (SELECT id FROM skill WHERE code = 'fastapi'),
  (SELECT id FROM language WHERE code = 'en'),
  'FastAPI',
  'Development of modern, high-performance APIs with validation and automatic documentation.'
),
(
  (SELECT id FROM skill WHERE code = 'nestjs'),
  (SELECT id FROM language WHERE code = 'es'),
  'NestJS',
  'Construcción de APIs escalables en Node.js usando arquitectura modular y TypeScript.'
),
(
  (SELECT id FROM skill WHERE code = 'nestjs'),
  (SELECT id FROM language WHERE code = 'en'),
  'NestJS',
  'Building scalable Node.js APIs using modular architecture and TypeScript.'
),

-- ======================
-- FRONTEND
-- ======================
(
  (SELECT id FROM skill WHERE code = 'angular'),
  (SELECT id FROM language WHERE code = 'es'),
  'Angular',
  'Framework principal para desarrollo de aplicaciones web SPA estructuradas.'
),
(
  (SELECT id FROM skill WHERE code = 'angular'),
  (SELECT id FROM language WHERE code = 'en'),
  'Angular',
  'Main framework for building structured single-page web applications.'
),
(
  (SELECT id FROM skill WHERE code = 'react'),
  (SELECT id FROM language WHERE code = 'es'),
  'React',
  'Conocimientos básicos para desarrollo de interfaces basadas en componentes.'
),
(
  (SELECT id FROM skill WHERE code = 'react'),
  (SELECT id FROM language WHERE code = 'en'),
  'React',
  'Basic knowledge for building component-based user interfaces.'
),

-- ======================
-- MÓVILES
-- ======================
(
  (SELECT id FROM skill WHERE code = 'kotlin'),
  (SELECT id FROM language WHERE code = 'es'),
  'Kotlin',
  'Conocimientos básicos en desarrollo de aplicaciones móviles Android.'
),
(
  (SELECT id FROM skill WHERE code = 'kotlin'),
  (SELECT id FROM language WHERE code = 'en'),
  'Kotlin',
  'Basic knowledge of Android mobile application development.'
),

-- ======================
-- LENGUAJES DE PROGRAMACIÓN
-- ======================
(
  (SELECT id FROM skill WHERE code = 'python'),
  (SELECT id FROM language WHERE code = 'es'),
  'Python',
  'Lenguaje principal para desarrollo backend, automatización y scripting.'
),
(
  (SELECT id FROM skill WHERE code = 'python'),
  (SELECT id FROM language WHERE code = 'en'),
  'Python',
  'Primary language for backend development, automation and scripting.'
),
(
  (SELECT id FROM skill WHERE code = 'javascript'),
  (SELECT id FROM language WHERE code = 'es'),
  'JavaScript',
  'Lenguaje utilizado en desarrollo frontend y backend con frameworks modernos.'
),
(
  (SELECT id FROM skill WHERE code = 'javascript'),
  (SELECT id FROM language WHERE code = 'en'),
  'JavaScript',
  'Language used for frontend and backend development with modern frameworks.'
),
(
  (SELECT id FROM skill WHERE code = 'typescript'),
  (SELECT id FROM language WHERE code = 'es'),
  'TypeScript',
  'Uso de tipado estático para mejorar la mantenibilidad del código.'
),
(
  (SELECT id FROM skill WHERE code = 'typescript'),
  (SELECT id FROM language WHERE code = 'en'),
  'TypeScript',
  'Use of static typing to improve code maintainability.'
),
(
  (SELECT id FROM skill WHERE code = 'java_kotlin'),
  (SELECT id FROM language WHERE code = 'es'),
  'Java / Kotlin',
  'Conocimientos básicos en lenguajes orientados a objetos.'
),
(
  (SELECT id FROM skill WHERE code = 'java_kotlin'),
  (SELECT id FROM language WHERE code = 'en'),
  'Java / Kotlin',
  'Basic knowledge of object-oriented programming languages.'
),

-- ======================
-- BASES DE DATOS
-- ======================
(
  (SELECT id FROM skill WHERE code = 'mysql'),
  (SELECT id FROM language WHERE code = 'es'),
  'MySQL',
  'Gestión de bases de datos relacionales y diseño de esquemas.'
),
(
  (SELECT id FROM skill WHERE code = 'mysql'),
  (SELECT id FROM language WHERE code = 'en'),
  'MySQL',
  'Management of relational databases and schema design.'
),
(
  (SELECT id FROM skill WHERE code = 'postgresql'),
  (SELECT id FROM language WHERE code = 'es'),
  'PostgreSQL',
  'Uso de bases de datos avanzadas con consultas complejas.'
),
(
  (SELECT id FROM skill WHERE code = 'postgresql'),
  (SELECT id FROM language WHERE code = 'en'),
  'PostgreSQL',
  'Use of advanced databases with complex queries.'
),
(
  (SELECT id FROM skill WHERE code = 'mongodb'),
  (SELECT id FROM language WHERE code = 'es'),
  'MongoDB',
  'Manejo de bases de datos NoSQL orientadas a documentos.'
),
(
  (SELECT id FROM skill WHERE code = 'mongodb'),
  (SELECT id FROM language WHERE code = 'en'),
  'MongoDB',
  'Handling of document-oriented NoSQL databases.'
),

-- ======================
-- HERRAMIENTAS
-- ======================
(
  (SELECT id FROM skill WHERE code = 'git'),
  (SELECT id FROM language WHERE code = 'es'),
  'Git',
  'Control de versiones y trabajo colaborativo en equipos de desarrollo.'
),
(
  (SELECT id FROM skill WHERE code = 'git'),
  (SELECT id FROM language WHERE code = 'en'),
  'Git',
  'Version control and collaborative development workflows.'
),
(
  (SELECT id FROM skill WHERE code = 'docker'),
  (SELECT id FROM language WHERE code = 'es'),
  'Docker',
  'Creación y gestión de contenedores para entornos de desarrollo y despliegue.'
),
(
  (SELECT id FROM skill WHERE code = 'docker'),
  (SELECT id FROM language WHERE code = 'en'),
  'Docker',
  'Creation and management of containers for development and deployment.'
),
(
  (SELECT id FROM skill WHERE code = 'github_gitlab'),
  (SELECT id FROM language WHERE code = 'es'),
  'GitHub / GitLab',
  'Gestión de repositorios, revisiones de código y pipelines CI/CD.'
),
(
  (SELECT id FROM skill WHERE code = 'github_gitlab'),
  (SELECT id FROM language WHERE code = 'en'),
  'GitHub / GitLab',
  'Repository management, code reviews and CI/CD pipelines.'
),
(
  (SELECT id FROM skill WHERE code = 'postman'),
  (SELECT id FROM language WHERE code = 'es'),
  'Postman',
  'Pruebas, documentación y validación de APIs.'
),
(
  (SELECT id FROM skill WHERE code = 'postman'),
  (SELECT id FROM language WHERE code = 'en'),
  'Postman',
  'API testing, documentation and validation.'
),
(
  (SELECT id FROM skill WHERE code = 'vscode'),
  (SELECT id FROM language WHERE code = 'es'),
  'Visual Studio Code',
  'Editor principal de desarrollo con extensiones de productividad.'
),
(
  (SELECT id FROM skill WHERE code = 'vscode'),
  (SELECT id FROM language WHERE code = 'en'),
  'Visual Studio Code',
  'Primary development editor with productivity extensions.'
),

-- ======================
-- CLOUD
-- ======================
(
  (SELECT id FROM skill WHERE code = 'vercel'),
  (SELECT id FROM language WHERE code = 'es'),
  'Vercel',
  'Despliegue de aplicaciones frontend y serverless.'
),
(
  (SELECT id FROM skill WHERE code = 'vercel'),
  (SELECT id FROM language WHERE code = 'en'),
  'Vercel',
  'Deployment of frontend and serverless applications.'
),
(
  (SELECT id FROM skill WHERE code = 'azure'),
  (SELECT id FROM language WHERE code = 'es'),
  'Azure',
  'Uso de servicios cloud para despliegue y gestión de aplicaciones.'
),
(
  (SELECT id FROM skill WHERE code = 'azure'),
  (SELECT id FROM language WHERE code = 'en'),
  'Azure',
  'Use of cloud services for application deployment and management.'
),
(
  (SELECT id FROM skill WHERE code = 'gcloud_run'),
  (SELECT id FROM language WHERE code = 'es'),
  'Google Cloud Run',
  'Despliegue de contenedores escalables bajo demanda.'
),
(
  (SELECT id FROM skill WHERE code = 'gcloud_run'),
  (SELECT id FROM language WHERE code = 'en'),
  'Google Cloud Run',
  'On-demand scalable container deployment.'
),

-- ======================
-- METODOLOGÍAS
-- ======================
(
  (SELECT id FROM skill WHERE code = 'scrum'),
  (SELECT id FROM language WHERE code = 'es'),
  'Scrum',
  'Trabajo en equipos ágiles usando roles, ceremonias y entregas iterativas.'
),
(
  (SELECT id FROM skill WHERE code = 'scrum'),
  (SELECT id FROM language WHERE code = 'en'),
  'Scrum',
  'Working in agile teams using defined roles, ceremonies and iterations.'
),
(
  (SELECT id FROM skill WHERE code = 'agile'),
  (SELECT id FROM language WHERE code = 'es'),
  'Desarrollo ágil',
  'Aplicación de principios ágiles para entrega continua de valor.'
),
(
  (SELECT id FROM skill WHERE code = 'agile'),
  (SELECT id FROM language WHERE code = 'en'),
  'Agile development',
  'Application of agile principles for continuous value delivery.'
),
(
  (SELECT id FROM skill WHERE code = 'ci_cd'),
  (SELECT id FROM language WHERE code = 'es'),
  'Integración continua',
  'Automatización de pruebas e integración frecuente de código.'
),
(
  (SELECT id FROM skill WHERE code = 'ci_cd'),
  (SELECT id FROM language WHERE code = 'en'),
  'Continuous integration',
  'Automation of testing and frequent code integration.'
);
