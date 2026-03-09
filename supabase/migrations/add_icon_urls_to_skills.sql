-- Migration: add icon_url to skills that lack fallback icons
-- Skills already covered by the frontend fallback map (skill-icons.ts) keep icon_url NULL.

UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg' WHERE code = 'drf';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' WHERE code = 'java_kotlin';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' WHERE code = 'github_gitlab';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg' WHERE code = 'gcloud_run';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg' WHERE code = 'shell_bash';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg' WHERE code = 'kafka';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swagger/swagger-original.svg' WHERE code = 'swagger_openapi';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' WHERE code = 'html_css';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg' WHERE code = 'github_actions';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg' WHERE code = 'strawberry_graphql';
UPDATE skill SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg' WHERE code = 'sql';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/langchain' WHERE code = 'langchain';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/pydantic' WHERE code = 'pydantic';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/openai' WHERE code = 'openai';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/n8n' WHERE code = 'n8n';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/sonarqube' WHERE code = 'sonarqube';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/playwright' WHERE code = 'playwright';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/leaflet' WHERE code = 'leaflet';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/chroma' WHERE code = 'chromadb';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/ngrx' WHERE code = 'ngrx';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/typeorm' WHERE code = 'typeorm';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/webSocket/white' WHERE code = 'websocket';
UPDATE skill SET icon_url = 'https://cdn.simpleicons.org/groq' WHERE code = 'groq';

-- Conceptual/methodology skills (using Iconify MDI icons)
UPDATE skill SET icon_url = 'https://api.iconify.design/mdi/view-dashboard-outline.svg?color=%23a78bfa' WHERE code = 'scrum';
UPDATE skill SET icon_url = 'https://api.iconify.design/mdi/sync.svg?color=%23a78bfa' WHERE code = 'agile';
UPDATE skill SET icon_url = 'https://api.iconify.design/mdi/infinity.svg?color=%23a78bfa' WHERE code = 'ci_cd';
UPDATE skill SET icon_url = 'https://api.iconify.design/mdi/layers-triple-outline.svg?color=%23a78bfa' WHERE code = 'clean_architecture';
UPDATE skill SET icon_url = 'https://api.iconify.design/mdi/api.svg?color=%23a78bfa' WHERE code = 'rest_api';
UPDATE skill SET icon_url = 'https://api.iconify.design/mdi/hexagon-multiple-outline.svg?color=%23a78bfa' WHERE code = 'ddd';
UPDATE skill SET icon_url = 'https://api.iconify.design/mdi/web.svg?color=%23a78bfa' WHERE code = 'web_scraping';
