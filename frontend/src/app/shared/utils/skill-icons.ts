/**
 * Fallback icon URLs for known skills when icon_url is not set in the database.
 * Uses devicon CDN (https://devicon.dev) for technology icons
 * and flag emojis for language skills.
 */

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/** Map of lowercase skill names to their icon URLs. */
const SKILL_ICON_MAP: Record<string, string> = {
  // Programming Languages
  javascript: `${DEVICON_BASE}/javascript/javascript-original.svg`,
  typescript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
  python: `${DEVICON_BASE}/python/python-original.svg`,
  java: `${DEVICON_BASE}/java/java-original.svg`,
  'c#': `${DEVICON_BASE}/csharp/csharp-original.svg`,
  csharp: `${DEVICON_BASE}/csharp/csharp-original.svg`,
  'c++': `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  c: `${DEVICON_BASE}/c/c-original.svg`,
  go: `${DEVICON_BASE}/go/go-original.svg`,
  rust: `${DEVICON_BASE}/rust/rust-original.svg`,
  ruby: `${DEVICON_BASE}/ruby/ruby-original.svg`,
  php: `${DEVICON_BASE}/php/php-original.svg`,
  swift: `${DEVICON_BASE}/swift/swift-original.svg`,
  kotlin: `${DEVICON_BASE}/kotlin/kotlin-original.svg`,
  dart: `${DEVICON_BASE}/dart/dart-original.svg`,
  r: `${DEVICON_BASE}/r/r-original.svg`,
  scala: `${DEVICON_BASE}/scala/scala-original.svg`,
  elixir: `${DEVICON_BASE}/elixir/elixir-original.svg`,

  // Frameworks & Libraries
  react: `${DEVICON_BASE}/react/react-original.svg`,
  angular: `${DEVICON_BASE}/angular/angular-original.svg`,
  vue: `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  'vue.js': `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  vuejs: `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  svelte: `${DEVICON_BASE}/svelte/svelte-original.svg`,
  'next.js': `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  nextjs: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  nuxt: `${DEVICON_BASE}/nuxtjs/nuxtjs-original.svg`,
  'nuxt.js': `${DEVICON_BASE}/nuxtjs/nuxtjs-original.svg`,
  django: `${DEVICON_BASE}/django/django-plain.svg`,
  flask: `${DEVICON_BASE}/flask/flask-original.svg`,
  fastapi: `${DEVICON_BASE}/fastapi/fastapi-original.svg`,
  express: `${DEVICON_BASE}/express/express-original.svg`,
  'express.js': `${DEVICON_BASE}/express/express-original.svg`,
  nestjs: `${DEVICON_BASE}/nestjs/nestjs-original.svg`,
  'nest.js': `${DEVICON_BASE}/nestjs/nestjs-original.svg`,
  spring: `${DEVICON_BASE}/spring/spring-original.svg`,
  'spring boot': `${DEVICON_BASE}/spring/spring-original.svg`,
  laravel: `${DEVICON_BASE}/laravel/laravel-original.svg`,
  rails: `${DEVICON_BASE}/rails/rails-original-wordmark.svg`,
  'ruby on rails': `${DEVICON_BASE}/rails/rails-original-wordmark.svg`,
  flutter: `${DEVICON_BASE}/flutter/flutter-original.svg`,
  '.net': `${DEVICON_BASE}/dot-net/dot-net-original.svg`,
  dotnet: `${DEVICON_BASE}/dot-net/dot-net-original.svg`,
  gatsby: `${DEVICON_BASE}/gatsby/gatsby-original.svg`,
  ember: `${DEVICON_BASE}/ember/ember-original-wordmark.svg`,
  backbone: `${DEVICON_BASE}/backbonejs/backbonejs-original.svg`,

  // CSS & Styling
  css: `${DEVICON_BASE}/css3/css3-original.svg`,
  css3: `${DEVICON_BASE}/css3/css3-original.svg`,
  html: `${DEVICON_BASE}/html5/html5-original.svg`,
  html5: `${DEVICON_BASE}/html5/html5-original.svg`,
  tailwind: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  'tailwind css': `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  tailwindcss: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  bootstrap: `${DEVICON_BASE}/bootstrap/bootstrap-original.svg`,
  sass: `${DEVICON_BASE}/sass/sass-original.svg`,
  scss: `${DEVICON_BASE}/sass/sass-original.svg`,
  less: `${DEVICON_BASE}/less/less-plain-wordmark.svg`,
  'material ui': `${DEVICON_BASE}/materialui/materialui-original.svg`,

  // Databases
  postgresql: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  postgres: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  mysql: `${DEVICON_BASE}/mysql/mysql-original.svg`,
  mongodb: `${DEVICON_BASE}/mongodb/mongodb-original.svg`,
  redis: `${DEVICON_BASE}/redis/redis-original.svg`,
  sqlite: `${DEVICON_BASE}/sqlite/sqlite-original.svg`,
  firebase: `${DEVICON_BASE}/firebase/firebase-original.svg`,
  supabase: `${DEVICON_BASE}/supabase/supabase-original.svg`,
  oracle: `${DEVICON_BASE}/oracle/oracle-original.svg`,
  dynamodb: `${DEVICON_BASE}/dynamodb/dynamodb-original.svg`,

  // DevOps & Cloud
  docker: `${DEVICON_BASE}/docker/docker-original.svg`,
  kubernetes: `${DEVICON_BASE}/kubernetes/kubernetes-original.svg`,
  aws: `${DEVICON_BASE}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  azure: `${DEVICON_BASE}/azure/azure-original.svg`,
  gcp: `${DEVICON_BASE}/googlecloud/googlecloud-original.svg`,
  'google cloud': `${DEVICON_BASE}/googlecloud/googlecloud-original.svg`,
  nginx: `${DEVICON_BASE}/nginx/nginx-original.svg`,
  jenkins: `${DEVICON_BASE}/jenkins/jenkins-original.svg`,
  terraform: `${DEVICON_BASE}/terraform/terraform-original.svg`,
  ansible: `${DEVICON_BASE}/ansible/ansible-original.svg`,
  vercel: `${DEVICON_BASE}/vercel/vercel-original.svg`,
  heroku: `${DEVICON_BASE}/heroku/heroku-original.svg`,
  netlify: `${DEVICON_BASE}/netlify/netlify-original.svg`,

  // Tools
  git: `${DEVICON_BASE}/git/git-original.svg`,
  github: `${DEVICON_BASE}/github/github-original.svg`,
  gitlab: `${DEVICON_BASE}/gitlab/gitlab-original.svg`,
  vscode: `${DEVICON_BASE}/vscode/vscode-original.svg`,
  'visual studio code': `${DEVICON_BASE}/vscode/vscode-original.svg`,
  npm: `${DEVICON_BASE}/npm/npm-original-wordmark.svg`,
  yarn: `${DEVICON_BASE}/yarn/yarn-original.svg`,
  webpack: `${DEVICON_BASE}/webpack/webpack-original.svg`,
  babel: `${DEVICON_BASE}/babel/babel-original.svg`,
  figma: `${DEVICON_BASE}/figma/figma-original.svg`,
  jira: `${DEVICON_BASE}/jira/jira-original.svg`,
  postman: `${DEVICON_BASE}/postman/postman-original.svg`,
  graphql: `${DEVICON_BASE}/graphql/graphql-plain.svg`,
  linux: `${DEVICON_BASE}/linux/linux-original.svg`,
  ubuntu: `${DEVICON_BASE}/ubuntu/ubuntu-original.svg`,
  vim: `${DEVICON_BASE}/vim/vim-original.svg`,

  // Testing
  jest: `${DEVICON_BASE}/jest/jest-plain.svg`,
  mocha: `${DEVICON_BASE}/mocha/mocha-original.svg`,
  pytest: `${DEVICON_BASE}/pytest/pytest-original.svg`,
  selenium: `${DEVICON_BASE}/selenium/selenium-original.svg`,
  vitest: `${DEVICON_BASE}/vitest/vitest-original.svg`,

  // Mobile
  'react native': `${DEVICON_BASE}/react/react-original.svg`,
  android: `${DEVICON_BASE}/android/android-original.svg`,
  ios: `${DEVICON_BASE}/apple/apple-original.svg`,

  // Other
  node: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  'node.js': `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  nodejs: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  deno: `${DEVICON_BASE}/denojs/denojs-original.svg`,
  bun: `${DEVICON_BASE}/bun/bun-original.svg`,
  'socket.io': `${DEVICON_BASE}/socketio/socketio-original.svg`,
  socketio: `${DEVICON_BASE}/socketio/socketio-original.svg`,
  threejs: `${DEVICON_BASE}/threejs/threejs-original.svg`,
  'three.js': `${DEVICON_BASE}/threejs/threejs-original.svg`,
};

/** Language skill names (lowercase) mapped to flag country codes. */
const LANGUAGE_SKILL_FLAGS: Record<string, string> = {
  spanish: 'ES',
  english: 'US',
  french: 'FR',
  german: 'DE',
  portuguese: 'BR',
  italian: 'IT',
  chinese: 'CN',
  mandarin: 'CN',
  japanese: 'JP',
  korean: 'KR',
  russian: 'RU',
  arabic: 'SA',
  hindi: 'IN',
  dutch: 'NL',
  polish: 'PL',
  swedish: 'SE',
  danish: 'DK',
  finnish: 'FI',
  norwegian: 'NO',
  turkish: 'TR',
  thai: 'TH',
  vietnamese: 'VN',
  indonesian: 'ID',
  malay: 'MY',
  ukrainian: 'UA',
  czech: 'CZ',
  romanian: 'RO',
  hungarian: 'HU',
  greek: 'GR',
  hebrew: 'IL',
  catalan: 'ES',
  quechua: 'PE',
  guarani: 'PY',
  // Spanish variants
  español: 'ES',
  inglés: 'US',
  francés: 'FR',
  alemán: 'DE',
  portugués: 'BR',
  italiano: 'IT',
  chino: 'CN',
  japonés: 'JP',
  coreano: 'KR',
  ruso: 'RU',
  árabe: 'SA',
};

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');
}

/**
 * Get a fallback icon URL or flag emoji for a skill name.
 * Returns { type: 'url', value: string } for image URLs
 * or { type: 'flag', value: string } for flag emojis
 * or null if no mapping found.
 */
export function getSkillFallbackIcon(
  skillName: string,
): { type: 'url' | 'flag'; value: string } | null {
  if (!skillName) return null;
  const lower = skillName.toLowerCase().trim();

  // Check language flags first
  const flagCode = LANGUAGE_SKILL_FLAGS[lower];
  if (flagCode) {
    return { type: 'flag', value: countryCodeToFlag(flagCode) };
  }

  // Check tech icon map
  const url = SKILL_ICON_MAP[lower];
  if (url) {
    return { type: 'url', value: url };
  }

  return null;
}
