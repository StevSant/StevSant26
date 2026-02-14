/**
 * Second-pass fix for remaining <span class="material-symbols-outlined">
 * and malformed <span ...>...</mat-icon> tags.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function findFiles(dir, regex) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFiles(full, regex));
    else if (regex.test(entry.name)) results.push(full);
  }
  return results;
}

const htmlFiles = findFiles(srcDir, /\.component\.html$/);
let totalFixed = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('material-symbols-outlined')) continue;

  const original = content;

  // Fix 1: Malformed <span ...material-symbols-outlined...>...</mat-icon>
  //   → <mat-icon ...>...</mat-icon>
  content = content.replace(
    /<span\b((?:[^>])*material-symbols-outlined[^>]*)>([\s\S]*?)<\/mat-icon>/g,
    (match, attrs, inner) => {
      attrs = cleanAttrs(attrs);
      return `<mat-icon${attrs}>${inner}</mat-icon>`;
    },
  );

  // Fix 2: Remaining <span ...material-symbols-outlined...>...</span>
  //   Handle one level of nesting by being smarter about the end tag
  let changed = true;
  while (changed) {
    const prev = content;
    content = content.replace(
      /<span\b((?:[^>])*material-symbols-outlined(?:[^>])*)>((?:(?!<span\b)[\s\S])*?)<\/span>/,
      (match, attrs, inner) => {
        attrs = cleanAttrs(attrs);
        return `<mat-icon${attrs}>${inner}</mat-icon>`;
      },
    );
    changed = content !== prev;
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    const rel = path.relative(srcDir, file);
    console.log(`  FIXED  ${rel}`);
    totalFixed++;
  }
}

console.log(`\n✔ Fixed ${totalFixed} files`);

// ── Check for TS imports ──
const tsFiles = findFiles(srcDir, /\.component\.ts$/);
for (const tsFile of tsFiles) {
  const htmlFile = tsFile.replace(/\.ts$/, '.html');
  if (!fs.existsSync(htmlFile)) continue;
  const html = fs.readFileSync(htmlFile, 'utf-8');
  if (!html.includes('<mat-icon')) continue;

  let ts = fs.readFileSync(tsFile, 'utf-8');
  if (ts.includes('MatIcon')) continue;

  // Add import
  const importLines = ts.match(/^import .+$/gm);
  if (importLines && importLines.length > 0) {
    const last = importLines[importLines.length - 1];
    const idx = ts.lastIndexOf(last);
    ts =
      ts.slice(0, idx + last.length) +
      "\nimport { MatIcon } from '@angular/material/icon';" +
      ts.slice(idx + last.length);
  }

  // Add to imports array
  if (!ts.includes('MatIcon')) continue; // skip if import wasn't added
  ts = ts.replace(/imports:\s*\[([^\]]*)\]/, (m, inner) => {
    if (inner.includes('MatIcon')) return m;
    return `imports: [${inner.trim() ? inner + ', ' : ''}MatIcon]`;
  });

  fs.writeFileSync(tsFile, ts, 'utf-8');
  console.log(`  TS   ${path.relative(srcDir, tsFile)}`);
}

function cleanAttrs(attrs) {
  attrs = attrs.replace(/(class=")([^"]*?)"/g, (_m, prefix, classStr) => {
    classStr = classStr
      .replace(/\bmaterial-symbols-outlined\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (!classStr) return '';
    return `${prefix}${classStr}"`;
  });
  attrs = attrs.replace(/\s{2,}/g, ' ');
  return attrs;
}
