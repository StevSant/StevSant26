-- =============================================
-- Seed: skill
-- =============================================

INSERT INTO skill (code, skill_category_id, position, predefined_level, icon_url)
VALUES
-- Idiomas (predefined_level: 5=nativo, 4=C1 avanzado)
('spanish', (SELECT id FROM skill_category WHERE code = 'languages'), 1, 5, NULL),
('english', (SELECT id FROM skill_category WHERE code = 'languages'), 2, 4, NULL),

-- Backend
('django', (SELECT id FROM skill_category WHERE code = 'backend'), 1, NULL, NULL),
('drf', (SELECT id FROM skill_category WHERE code = 'backend'), 2, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg'),
('flask', (SELECT id FROM skill_category WHERE code = 'backend'), 3, NULL, NULL),
('fastapi', (SELECT id FROM skill_category WHERE code = 'backend'), 4, NULL, NULL),
('nestjs', (SELECT id FROM skill_category WHERE code = 'backend'), 5, NULL, NULL),

-- Frontend
('angular', (SELECT id FROM skill_category WHERE code = 'frontend'), 1, NULL, NULL),
('react', (SELECT id FROM skill_category WHERE code = 'frontend'), 2, NULL, NULL),

-- Móviles
('kotlin', (SELECT id FROM skill_category WHERE code = 'mobile'), 1, NULL, NULL),

-- Lenguajes
('python', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 1, NULL, NULL),
('javascript', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 2, NULL, NULL),
('typescript', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 3, NULL, NULL),
('java_kotlin', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 4, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'),

-- Bases de datos
('mysql', (SELECT id FROM skill_category WHERE code = 'databases'), 1, NULL, NULL),
('postgresql', (SELECT id FROM skill_category WHERE code = 'databases'), 2, NULL, NULL),
('mongodb', (SELECT id FROM skill_category WHERE code = 'databases'), 3, NULL, NULL),

-- Herramientas
('git', (SELECT id FROM skill_category WHERE code = 'tools'), 1, NULL, NULL),
('docker', (SELECT id FROM skill_category WHERE code = 'tools'), 2, NULL, NULL),
('github_gitlab', (SELECT id FROM skill_category WHERE code = 'tools'), 3, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg'),
('postman', (SELECT id FROM skill_category WHERE code = 'tools'), 4, NULL, NULL),
('vscode', (SELECT id FROM skill_category WHERE code = 'tools'), 5, NULL, NULL),

-- Cloud
('vercel', (SELECT id FROM skill_category WHERE code = 'cloud'), 1, NULL, NULL),
('azure', (SELECT id FROM skill_category WHERE code = 'cloud'), 2, NULL, NULL),
('gcloud_run', (SELECT id FROM skill_category WHERE code = 'cloud'), 3, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg'),

-- Metodologías
('scrum', (SELECT id FROM skill_category WHERE code = 'methodologies'), 1, NULL, 'https://api.iconify.design/mdi/view-dashboard-outline.svg?color=%23a78bfa'),
('agile', (SELECT id FROM skill_category WHERE code = 'methodologies'), 2, NULL, 'https://api.iconify.design/mdi/sync.svg?color=%23a78bfa'),
('ci_cd', (SELECT id FROM skill_category WHERE code = 'methodologies'), 3, NULL, 'https://api.iconify.design/mdi/infinity.svg?color=%23a78bfa'),
('clean_architecture', (SELECT id FROM skill_category WHERE code = 'methodologies'), 4, NULL, 'https://api.iconify.design/mdi/layers-triple-outline.svg?color=%23a78bfa'),
('rest_api', (SELECT id FROM skill_category WHERE code = 'methodologies'), 5, NULL, 'https://api.iconify.design/mdi/api.svg?color=%23a78bfa'),
('ddd', (SELECT id FROM skill_category WHERE code = 'methodologies'), 6, NULL, 'https://api.iconify.design/mdi/hexagon-multiple-outline.svg?color=%23a78bfa'),

-- Backend (nuevos)
('langchain', (SELECT id FROM skill_category WHERE code = 'backend'), 6, NULL, 'https://cdn.simpleicons.org/langchain'),
('pydantic', (SELECT id FROM skill_category WHERE code = 'backend'), 7, NULL, 'https://cdn.simpleicons.org/pydantic'),
('graphql', (SELECT id FROM skill_category WHERE code = 'backend'), 8, NULL, NULL),
('websocket', (SELECT id FROM skill_category WHERE code = 'backend'), 9, NULL, 'https://cdn.simpleicons.org/webSocket/white'),
('nodejs', (SELECT id FROM skill_category WHERE code = 'backend'), 10, NULL, NULL),
('strawberry_graphql', (SELECT id FROM skill_category WHERE code = 'backend'), 11, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg'),

-- Frontend (nuevos)
('tailwindcss', (SELECT id FROM skill_category WHERE code = 'frontend'), 3, NULL, NULL),
('scss', (SELECT id FROM skill_category WHERE code = 'frontend'), 4, NULL, NULL),
('html_css', (SELECT id FROM skill_category WHERE code = 'frontend'), 5, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg'),
('ngrx', (SELECT id FROM skill_category WHERE code = 'frontend'), 6, NULL, 'https://cdn.simpleicons.org/ngrx'),
('leaflet', (SELECT id FROM skill_category WHERE code = 'frontend'), 7, NULL, 'https://cdn.simpleicons.org/leaflet'),

-- Bases de datos (nuevas)
('chromadb', (SELECT id FROM skill_category WHERE code = 'databases'), 4, NULL, 'https://cdn.simpleicons.org/chroma'),
('sql', (SELECT id FROM skill_category WHERE code = 'databases'), 5, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg'),
('typeorm', (SELECT id FROM skill_category WHERE code = 'databases'), 6, NULL, 'https://cdn.simpleicons.org/typeorm'),

-- Herramientas (nuevas)
('playwright', (SELECT id FROM skill_category WHERE code = 'tools'), 6, NULL, 'https://cdn.simpleicons.org/playwright'),
('jest', (SELECT id FROM skill_category WHERE code = 'tools'), 7, NULL, NULL),
('pytest', (SELECT id FROM skill_category WHERE code = 'tools'), 8, NULL, NULL),
('kafka', (SELECT id FROM skill_category WHERE code = 'tools'), 9, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg'),
('sonarqube', (SELECT id FROM skill_category WHERE code = 'tools'), 10, NULL, 'https://cdn.simpleicons.org/sonarqube'),
('swagger_openapi', (SELECT id FROM skill_category WHERE code = 'tools'), 11, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swagger/swagger-original.svg'),
('web_scraping', (SELECT id FROM skill_category WHERE code = 'tools'), 12, NULL, 'https://api.iconify.design/mdi/web.svg?color=%23a78bfa'),
('github_actions', (SELECT id FROM skill_category WHERE code = 'tools'), 13, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg'),
('n8n', (SELECT id FROM skill_category WHERE code = 'tools'), 14, NULL, 'https://cdn.simpleicons.org/n8n'),

-- Cloud (nuevos)
('supabase', (SELECT id FROM skill_category WHERE code = 'cloud'), 4, NULL, NULL),
('openai', (SELECT id FROM skill_category WHERE code = 'cloud'), 5, NULL, 'https://cdn.simpleicons.org/openai'),
('groq', (SELECT id FROM skill_category WHERE code = 'cloud'), 6, NULL, 'https://cdn.simpleicons.org/groq'),

-- Lenguajes (nuevos)
('shell_bash', (SELECT id FROM skill_category WHERE code = 'programming_languages'), 5, NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg');



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
),

-- ======================
-- METODOLOGÍAS (nuevas)
-- ======================
(
  (SELECT id FROM skill WHERE code = 'clean_architecture'),
  (SELECT id FROM language WHERE code = 'es'),
  'Arquitectura Limpia',
  'Separación de responsabilidades en capas: dominio, casos de uso, infraestructura y presentación.'
),
(
  (SELECT id FROM skill WHERE code = 'clean_architecture'),
  (SELECT id FROM language WHERE code = 'en'),
  'Clean Architecture',
  'Separation of concerns in layers: domain, use cases, infrastructure and presentation.'
),
(
  (SELECT id FROM skill WHERE code = 'rest_api'),
  (SELECT id FROM language WHERE code = 'es'),
  'API REST',
  'Diseño e implementación de APIs RESTful con buenas prácticas y documentación.'
),
(
  (SELECT id FROM skill WHERE code = 'rest_api'),
  (SELECT id FROM language WHERE code = 'en'),
  'REST API',
  'Design and implementation of RESTful APIs with best practices and documentation.'
),
(
  (SELECT id FROM skill WHERE code = 'ddd'),
  (SELECT id FROM language WHERE code = 'es'),
  'DDD',
  'Diseño guiado por el dominio con entidades ricas, Value Objects y eventos de dominio.'
),
(
  (SELECT id FROM skill WHERE code = 'ddd'),
  (SELECT id FROM language WHERE code = 'en'),
  'DDD',
  'Domain-Driven Design with rich entities, Value Objects and domain events.'
),

-- ======================
-- BACKEND (nuevos)
-- ======================
(
  (SELECT id FROM skill WHERE code = 'langchain'),
  (SELECT id FROM language WHERE code = 'es'),
  'LangChain',
  'Framework de orquestación de LLMs para cadenas de prompts y pipelines RAG.'
),
(
  (SELECT id FROM skill WHERE code = 'langchain'),
  (SELECT id FROM language WHERE code = 'en'),
  'LangChain',
  'LLM orchestration framework for prompt chains and RAG pipelines.'
),
(
  (SELECT id FROM skill WHERE code = 'pydantic'),
  (SELECT id FROM language WHERE code = 'es'),
  'Pydantic',
  'Validación de datos y configuración tipada en Python.'
),
(
  (SELECT id FROM skill WHERE code = 'pydantic'),
  (SELECT id FROM language WHERE code = 'en'),
  'Pydantic',
  'Data validation and typed configuration in Python.'
),
(
  (SELECT id FROM skill WHERE code = 'graphql'),
  (SELECT id FROM language WHERE code = 'es'),
  'GraphQL',
  'Lenguaje de consulta para APIs con schema tipado y resolvers.'
),
(
  (SELECT id FROM skill WHERE code = 'graphql'),
  (SELECT id FROM language WHERE code = 'en'),
  'GraphQL',
  'API query language with typed schema and resolvers.'
),
(
  (SELECT id FROM skill WHERE code = 'websocket'),
  (SELECT id FROM language WHERE code = 'es'),
  'WebSocket',
  'Comunicación bidireccional en tiempo real entre cliente y servidor.'
),
(
  (SELECT id FROM skill WHERE code = 'websocket'),
  (SELECT id FROM language WHERE code = 'en'),
  'WebSocket',
  'Real-time bidirectional communication between client and server.'
),
(
  (SELECT id FROM skill WHERE code = 'nodejs'),
  (SELECT id FROM language WHERE code = 'es'),
  'Node.js',
  'Entorno de ejecución JavaScript para desarrollo backend.'
),
(
  (SELECT id FROM skill WHERE code = 'nodejs'),
  (SELECT id FROM language WHERE code = 'en'),
  'Node.js',
  'JavaScript runtime for backend development.'
),
(
  (SELECT id FROM skill WHERE code = 'strawberry_graphql'),
  (SELECT id FROM language WHERE code = 'es'),
  'Strawberry GraphQL',
  'Biblioteca GraphQL para Python con tipado nativo y resolvers declarativos.'
),
(
  (SELECT id FROM skill WHERE code = 'strawberry_graphql'),
  (SELECT id FROM language WHERE code = 'en'),
  'Strawberry GraphQL',
  'Python GraphQL library with native typing and declarative resolvers.'
),
-- ======================
-- FRONTEND (nuevos)
-- ======================
(
  (SELECT id FROM skill WHERE code = 'tailwindcss'),
  (SELECT id FROM language WHERE code = 'es'),
  'TailwindCSS',
  'Framework CSS utility-first para desarrollo rápido de interfaces responsivas.'
),
(
  (SELECT id FROM skill WHERE code = 'tailwindcss'),
  (SELECT id FROM language WHERE code = 'en'),
  'TailwindCSS',
  'Utility-first CSS framework for rapid responsive interface development.'
),
(
  (SELECT id FROM skill WHERE code = 'scss'),
  (SELECT id FROM language WHERE code = 'es'),
  'SCSS',
  'Preprocesador CSS con variables, mixins y sistema de módulos.'
),
(
  (SELECT id FROM skill WHERE code = 'scss'),
  (SELECT id FROM language WHERE code = 'en'),
  'SCSS',
  'CSS preprocessor with variables, mixins and module system.'
),
(
  (SELECT id FROM skill WHERE code = 'html_css'),
  (SELECT id FROM language WHERE code = 'es'),
  'HTML/CSS',
  'Maquetación semántica y estilización de interfaces web.'
),
(
  (SELECT id FROM skill WHERE code = 'html_css'),
  (SELECT id FROM language WHERE code = 'en'),
  'HTML/CSS',
  'Semantic markup and web interface styling.'
),
(
  (SELECT id FROM skill WHERE code = 'ngrx'),
  (SELECT id FROM language WHERE code = 'es'),
  'NgRx',
  'Gestión de estado reactivo para aplicaciones Angular.'
),
(
  (SELECT id FROM skill WHERE code = 'ngrx'),
  (SELECT id FROM language WHERE code = 'en'),
  'NgRx',
  'Reactive state management for Angular applications.'
),
(
  (SELECT id FROM skill WHERE code = 'leaflet'),
  (SELECT id FROM language WHERE code = 'es'),
  'Leaflet',
  'Biblioteca JavaScript para mapas interactivos.'
),
(
  (SELECT id FROM skill WHERE code = 'leaflet'),
  (SELECT id FROM language WHERE code = 'en'),
  'Leaflet',
  'JavaScript library for interactive maps.'
),

-- ======================
-- BASES DE DATOS (nuevas)
-- ======================
(
  (SELECT id FROM skill WHERE code = 'chromadb'),
  (SELECT id FROM language WHERE code = 'es'),
  'ChromaDB',
  'Base de datos vectorial para almacenamiento de embeddings y búsqueda semántica.'
),
(
  (SELECT id FROM skill WHERE code = 'chromadb'),
  (SELECT id FROM language WHERE code = 'en'),
  'ChromaDB',
  'Vector database for embedding storage and semantic search.'
),
(
  (SELECT id FROM skill WHERE code = 'sql'),
  (SELECT id FROM language WHERE code = 'es'),
  'SQL',
  'Consultas y gestión de bases de datos relacionales.'
),
(
  (SELECT id FROM skill WHERE code = 'sql'),
  (SELECT id FROM language WHERE code = 'en'),
  'SQL',
  'Relational database queries and management.'
),
(
  (SELECT id FROM skill WHERE code = 'typeorm'),
  (SELECT id FROM language WHERE code = 'es'),
  'TypeORM',
  'ORM para TypeScript/JavaScript con soporte para múltiples bases de datos.'
),
(
  (SELECT id FROM skill WHERE code = 'typeorm'),
  (SELECT id FROM language WHERE code = 'en'),
  'TypeORM',
  'TypeScript/JavaScript ORM with multi-database support.'
),

-- ======================
-- HERRAMIENTAS (nuevas)
-- ======================
(
  (SELECT id FROM skill WHERE code = 'playwright'),
  (SELECT id FROM language WHERE code = 'es'),
  'Playwright',
  'Automatización de navegadores web y testing end-to-end.'
),
(
  (SELECT id FROM skill WHERE code = 'playwright'),
  (SELECT id FROM language WHERE code = 'en'),
  'Playwright',
  'Web browser automation and end-to-end testing.'
),
(
  (SELECT id FROM skill WHERE code = 'jest'),
  (SELECT id FROM language WHERE code = 'es'),
  'Jest',
  'Framework de testing para JavaScript y TypeScript.'
),
(
  (SELECT id FROM skill WHERE code = 'jest'),
  (SELECT id FROM language WHERE code = 'en'),
  'Jest',
  'Testing framework for JavaScript and TypeScript.'
),
(
  (SELECT id FROM skill WHERE code = 'pytest'),
  (SELECT id FROM language WHERE code = 'es'),
  'pytest',
  'Framework de testing para Python con fixtures y parametrización.'
),
(
  (SELECT id FROM skill WHERE code = 'pytest'),
  (SELECT id FROM language WHERE code = 'en'),
  'pytest',
  'Python testing framework with fixtures and parameterization.'
),
(
  (SELECT id FROM skill WHERE code = 'kafka'),
  (SELECT id FROM language WHERE code = 'es'),
  'Apache Kafka',
  'Plataforma de streaming de eventos para comunicación asíncrona entre microservicios.'
),
(
  (SELECT id FROM skill WHERE code = 'kafka'),
  (SELECT id FROM language WHERE code = 'en'),
  'Apache Kafka',
  'Event streaming platform for asynchronous communication between microservices.'
),
(
  (SELECT id FROM skill WHERE code = 'sonarqube'),
  (SELECT id FROM language WHERE code = 'es'),
  'SonarQube',
  'Análisis continuo de calidad de código y cobertura de tests.'
),
(
  (SELECT id FROM skill WHERE code = 'sonarqube'),
  (SELECT id FROM language WHERE code = 'en'),
  'SonarQube',
  'Continuous code quality analysis and test coverage.'
),
(
  (SELECT id FROM skill WHERE code = 'swagger_openapi'),
  (SELECT id FROM language WHERE code = 'es'),
  'Swagger/OpenAPI',
  'Documentación y especificación de APIs REST.'
),
(
  (SELECT id FROM skill WHERE code = 'swagger_openapi'),
  (SELECT id FROM language WHERE code = 'en'),
  'Swagger/OpenAPI',
  'REST API documentation and specification.'
),
(
  (SELECT id FROM skill WHERE code = 'web_scraping'),
  (SELECT id FROM language WHERE code = 'es'),
  'Web Scraping',
  'Extracción automatizada de datos desde sitios web.'
),
(
  (SELECT id FROM skill WHERE code = 'web_scraping'),
  (SELECT id FROM language WHERE code = 'en'),
  'Web Scraping',
  'Automated data extraction from websites.'
),
(
  (SELECT id FROM skill WHERE code = 'github_actions'),
  (SELECT id FROM language WHERE code = 'es'),
  'GitHub Actions',
  'Automatización de CI/CD con workflows de GitHub.'
),
(
  (SELECT id FROM skill WHERE code = 'github_actions'),
  (SELECT id FROM language WHERE code = 'en'),
  'GitHub Actions',
  'CI/CD automation with GitHub workflows.'
),
(
  (SELECT id FROM skill WHERE code = 'n8n'),
  (SELECT id FROM language WHERE code = 'es'),
  'n8n',
  'Plataforma de automatización de workflows e integraciones.'
),
(
  (SELECT id FROM skill WHERE code = 'n8n'),
  (SELECT id FROM language WHERE code = 'en'),
  'n8n',
  'Workflow automation and integration platform.'
),

-- ======================
-- CLOUD (nuevos)
-- ======================
(
  (SELECT id FROM skill WHERE code = 'supabase'),
  (SELECT id FROM language WHERE code = 'es'),
  'Supabase',
  'Plataforma backend-as-a-service con base de datos, autenticación y almacenamiento.'
),
(
  (SELECT id FROM skill WHERE code = 'supabase'),
  (SELECT id FROM language WHERE code = 'en'),
  'Supabase',
  'Backend-as-a-service platform with database, authentication and storage.'
),
(
  (SELECT id FROM skill WHERE code = 'openai'),
  (SELECT id FROM language WHERE code = 'es'),
  'OpenAI',
  'Integración con modelos de lenguaje y embeddings de OpenAI.'
),
(
  (SELECT id FROM skill WHERE code = 'openai'),
  (SELECT id FROM language WHERE code = 'en'),
  'OpenAI',
  'Integration with OpenAI language models and embeddings.'
),
(
  (SELECT id FROM skill WHERE code = 'groq'),
  (SELECT id FROM language WHERE code = 'es'),
  'Groq',
  'Plataforma de inferencia de LLMs de ultra baja latencia con modelos como Llama y Mixtral.'
),
(
  (SELECT id FROM skill WHERE code = 'groq'),
  (SELECT id FROM language WHERE code = 'en'),
  'Groq',
  'Ultra-low latency LLM inference platform with models like Llama and Mixtral.'
),

-- ======================
-- LENGUAJES (nuevos)
-- ======================
(
  (SELECT id FROM skill WHERE code = 'shell_bash'),
  (SELECT id FROM language WHERE code = 'es'),
  'Shell/Bash',
  'Scripting y automatización en línea de comandos.'
),
(
  (SELECT id FROM skill WHERE code = 'shell_bash'),
  (SELECT id FROM language WHERE code = 'en'),
  'Shell/Bash',
  'Command-line scripting and automation.'
);
