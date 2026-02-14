/**
 * Ensures all components using <mat-icon> in their template have MatIcon imported.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function find(dir, regex) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...find(full, regex));
    else if (regex.test(entry.name)) results.push(full);
  }
  return results;
}

const htmlFiles = find(srcDir, /\.component\.html$/);
let fixed = 0;

for (const hf of htmlFiles) {
  const html = fs.readFileSync(hf, 'utf-8');
  if (!html.includes('<mat-icon')) continue;

  const tf = hf.replace(/\.html$/, '.ts');
  if (!fs.existsSync(tf)) continue;

  let ts = fs.readFileSync(tf, 'utf-8');
  let changed = false;

  // Add import statement if missing
  if (!ts.includes('MatIcon')) {
    const lastImport = ts.match(/^import .+$/gm);
    if (lastImport) {
      const last = lastImport[lastImport.length - 1];
      const idx = ts.lastIndexOf(last);
      ts =
        ts.slice(0, idx + last.length) +
        "\nimport { MatIcon } from '@angular/material/icon';" +
        ts.slice(idx + last.length);
      changed = true;
    }
  }

  // Add to @Component imports array if missing
  if (ts.includes('MatIcon')) {
    const hasInImports = /imports:\s*\[[\s\S]*?MatIcon[\s\S]*?\]/.test(ts);
    if (!hasInImports) {
      // Try to add to existing imports array
      const importsMatch = ts.match(/imports:\s*\[([^\]]*)\]/);
      if (importsMatch) {
        const inner = importsMatch[1];
        if (!inner.includes('MatIcon')) {
          ts = ts.replace(
            /imports:\s*\[([^\]]*)\]/,
            'imports: [' + inner.trim() + (inner.trim() ? ', ' : '') + 'MatIcon]',
          );
          changed = true;
        }
      } else {
        // No imports array, add after standalone: true
        ts = ts.replace(/(standalone:\s*true,?)/, '$1\n  imports: [MatIcon],');
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(tf, ts, 'utf-8');
    const rel = path.relative(srcDir, tf);
    console.log(`  FIXED  ${rel}`);
    fixed++;
  }
}

console.log(`\n✔ Fixed ${fixed} files`);
