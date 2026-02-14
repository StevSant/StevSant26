/**
 * Third-pass fix for ALL remaining material-symbols-outlined patterns.
 *
 * Handles:
 *  A) <span class="material-symbols-outlined...">text</mat-icon>   (malformed hybrid)
 *  B) <mat-icon ...>text</span\n  >                                (opening converted, closing split)
 *  C) <span\n  class="material-symbols-outlined..."\n  >text</span\n  >  (multi-line with split >)
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

function cleanAttrs(attrs) {
  // Remove material-symbols-outlined from class attribute
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

const htmlFiles = findFiles(srcDir, /\.component\.html$/);
let totalFixed = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;

  // ─── Pattern A: <span ...material-symbols-outlined...>text</mat-icon> ───
  // (single-line opening span, closing already changed to </mat-icon>)
  content = content.replace(
    /<span\b([^>]*material-symbols-outlined[^>]*)>([\s\S]*?)<\/mat-icon\s*>/g,
    (match, attrs, inner) => {
      attrs = cleanAttrs(attrs);
      return `<mat-icon${attrs}>${inner}</mat-icon>`;
    },
  );

  // ─── Pattern B: <mat-icon ...>text</span followed by optional whitespace and > ───
  // (opening already converted, closing wasn't because of split >)
  content = content.replace(/(<mat-icon\b[^>]*>[^<]*)<\/span(\s*)>/g, (match, before, ws) => {
    return `${before}</mat-icon${ws}>`;
  });

  // ─── Pattern C: Multi-line <span ...material-symbols-outlined...>text</span > ───
  // The key: closing tag is </span\n      > (split across lines)
  // Use a regex that allows whitespace inside </span ... >
  let changed = true;
  while (changed) {
    const prev = content;
    // Match opening <span with multi-line attrs containing material-symbols-outlined,
    // then content (no nested spans), then closing </span with optional whitespace before >
    content = content.replace(
      /<span\b((?:[^>]|\n|\r)*?material-symbols-outlined(?:[^>]|\n|\r)*?)>((?:(?!<span\b)[\s\S])*?)<\/span(\s*)>/,
      (match, attrs, inner, closingWs) => {
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

// Verify no material-symbols-outlined remain in HTML
let remaining = 0;
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/material-symbols-outlined/g);
  if (matches) {
    remaining += matches.length;
    console.log(`  ⚠ REMAINING: ${path.relative(srcDir, file)} (${matches.length} occurrences)`);
  }
}
if (remaining === 0) {
  console.log('✔ No material-symbols-outlined references remain in HTML templates!');
} else {
  console.log(`\n⚠ ${remaining} references still remain.`);
}
