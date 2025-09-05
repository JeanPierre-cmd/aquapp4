// scripts/cleanHtmlEntities.js
// Ejecuta: node scripts/cleanHtmlEntities.js
//
// Reemplaza &#39; &quot; < > &amp; por sus equivalentes reales
// SOLO en *.ts / *.tsx bajo src/components/Visualization3D
// No toca JSON, HTML ni otros módulos

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.join(__dirname, '..', 'src', 'components', 'Visualization3D');
const EXTENSIONS = new Set(['.ts', '.tsx']);
const REPLACEMENTS = [
  ['&#39;', `'`],
  ['&quot;', `"`],
  ['<', '<'],
  ['>', '>'],
  ['&amp;', '&']
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!EXTENSIONS.has(path.extname(entry.name))) continue;

    let data = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [entity, char] of REPLACEMENTS) {
      if (data.includes(entity)) {
        data = data.split(entity).join(char);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(full, data, 'utf8');
      console.log(`✅  Fixed entities in ${path.relative(BASE_DIR, full)}`);
    }
  }
}

walk(BASE_DIR);
console.log('✨  Entity cleanup complete');
