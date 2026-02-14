/**
 * Migration script: Replace <span class="material-symbols-outlined ..."> with <mat-icon ...>
 * Also adds MatIcon import to corresponding component TS files.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

// Recursively find files matching a pattern
function findFiles(dir, regex) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(full, regex));
    } else if (regex.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ── Phase 1: HTML replacements ──────────────────────────────────────────────
const htmlFiles = findFiles(srcDir, /\.component\.html$/);
const modifiedHtmlFiles = [];

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('material-symbols-outlined')) continue;

  const original = content;

  // Regex: match <span ...material-symbols-outlined...>innerContent</span>
  // Handles multi-line attributes (uses [\s\S] for the attribute region up to >)
  const spanRegex = /<span\b((?:[^>]|\n|\r)*?)>([\s\S]*?)<\/span>/g;

  content = content.replace(spanRegex, (match, attrs, inner) => {
    if (!attrs.includes('material-symbols-outlined')) return match;

    // Remove "material-symbols-outlined" from class value
    attrs = attrs.replace(/(class=")([^"]*?)"/g, (_m, prefix, classStr) => {
      classStr = classStr
        .replace(/\bmaterial-symbols-outlined\b/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      if (!classStr) return ''; // remove empty class=""
      return `${prefix}${classStr}"`;
    });

    // Clean leftover whitespace from removed class=""
    attrs = attrs.replace(/^\s+$/, '');
    // Remove leading space if class was removed and nothing else
    attrs = attrs.replace(/\s{2,}/g, ' ');

    return `<mat-icon${attrs}>${inner}</mat-icon>`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    const rel = path.relative(srcDir, file);
    const count = (original.match(/material-symbols-outlined/g) || []).length;
    console.log(`  HTML  ${rel}  (${count} icons)`);
    modifiedHtmlFiles.push(file);
  }
}

console.log(`\n✔ HTML: ${modifiedHtmlFiles.length} files modified\n`);

// ── Phase 2: Add MatIcon import to TS files ─────────────────────────────────
let tsModified = 0;

for (const htmlFile of modifiedHtmlFiles) {
  const tsFile = htmlFile.replace(/\.html$/, '.ts');
  if (!fs.existsSync(tsFile)) {
    // Try removing "component." prefix variations
    console.log(`  WARN  No TS file for ${path.relative(srcDir, htmlFile)}`);
    continue;
  }

  let ts = fs.readFileSync(tsFile, 'utf-8');
  if (ts.includes('MatIcon')) {
    // Already imported
    continue;
  }

  // 1. Add import statement
  // Find last import line to insert after
  const importLines = ts.match(/^import .+$/gm);
  if (importLines && importLines.length > 0) {
    const lastImport = importLines[importLines.length - 1];
    const idx = ts.lastIndexOf(lastImport);
    ts =
      ts.slice(0, idx + lastImport.length) +
      "\nimport { MatIcon } from '@angular/material/icon';" +
      ts.slice(idx + lastImport.length);
  }

  // 2. Add MatIcon to imports array in @Component
  //    Match imports: [ ... ] and add MatIcon
  ts = ts.replace(/imports:\s*\[([^\]]*)\]/, (match, inner) => {
    const trimmed = inner.trim();
    if (!trimmed) return `imports: [MatIcon]`;
    // Add MatIcon at the end
    return `imports: [${inner}, MatIcon]`;
  });

  fs.writeFileSync(tsFile, ts, 'utf-8');
  tsModified++;
  console.log(`  TS   ${path.relative(srcDir, tsFile)}`);
}

console.log(`\n✔ TS: ${tsModified} files modified`);
console.log('\nDone! Run `ng build` or `ng serve` to verify.');
