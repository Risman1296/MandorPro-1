#!/usr/bin/env node
/*
  Convert relative imports ('./', '../') to '@/' alias based on project root.
  Safe regex-based rewrite for import/export/require specifiers.

  Usage:
    node scripts/convert-imports-to-alias.cjs --dry [app src]
    node scripts/convert-imports-to-alias.cjs --write [app src]
*/
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isDry = args.includes('--dry');
const isWrite = args.includes('--write');
const roots = args.filter((a) => !a.startsWith('--'));
const rootDir = process.cwd();
const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

if (!isDry && !isWrite) {
  console.log('Specify --dry or --write');
  process.exit(1);
}

const startDirs = roots.length ? roots : ['app', 'src'];

/** Recursively gather files */
function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      out.push(...walk(p));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.has(ext)) out.push(p);
    }
  }
  return out;
}

function toAlias(fromFile, rel) {
  if (!rel || !rel.startsWith('.')) return null; // only relative
  const abs = path.resolve(path.dirname(fromFile), rel);
  let relFromRoot = path.relative(rootDir, abs);
  if (relFromRoot.startsWith('..') || path.isAbsolute(rel)) return null; // outside project
  relFromRoot = relFromRoot.split('\\').join('/');
  relFromRoot = relFromRoot.replace(/\.(ts|tsx|js|jsx)$/i, '');
  return `@/${relFromRoot}`;
}

function rewrite(content, filePath) {
  let changed = false;

  // import ... from '...'
  content = content.replace(/(from\s+)(['"])(\.{1,2}\/[^'"\)]+)\2/g, (full, prefix, quote, rel) => {
    const next = toAlias(filePath, rel);
    if (next) {
      changed = true;
      return `${prefix}${quote}${next}${quote}`;
    }
    return full;
  });
  // bare side-effect: import '...'
  content = content.replace(/(\bimport\s+)(['"])(\.{1,2}\/[^'"\)]+)\2/g, (full, prefix, quote, rel) => {
    const next = toAlias(filePath, rel);
    if (next) {
      changed = true;
      return `${prefix}${quote}${next}${quote}`;
    }
    return full;
  });
  // export ... from '...'
  content = content.replace(/(\bexport\s+[^;]*?from\s+)(['"])(\.{1,2}\/[^'"\)]+)\2/g, (full, prefix, quote, rel) => {
    const next = toAlias(filePath, rel);
    if (next) {
      changed = true;
      return `${prefix}${quote}${next}${quote}`;
    }
    return full;
  });
  // require('...')
  content = content.replace(/require\(\s*(['"])(\.{1,2}\/[^'"\)]+)\1\s*\)/g, (m, q, rel) => {
    const next = toAlias(filePath, rel);
    if (next) {
      changed = true;
      return `require(${q}${next}${q})`;
    }
    return m;
  });

  // Cleanup: normalize any broken imports missing 'from'
  // E.g., "import X 'module'" -> "import X from 'module'"
  content = content.replace(/\bimport\s+([^'";\n]+?)\s+(['"][^'"]+['"])/g, (m, spec, mod) => {
    if (/\bfrom\b\s+['"]/i.test(m)) return m; // already correct
    // avoid matching bare imports like: import 'module'
    if (/^['"]/ .test(spec.trim())) return m;
    changed = true;
    return `import ${spec} from ${mod}`;
  });

  return { content, changed };
}

let totalFiles = 0;
let modified = 0;

for (const d of startDirs) {
  const dirPath = path.resolve(rootDir, d);
  const files = walk(dirPath);
  for (const f of files) {
    totalFiles++;
    const orig = fs.readFileSync(f, 'utf8');
    const { content, changed } = rewrite(orig, f);
    if (changed) {
      modified++;
      if (isWrite) {
        fs.writeFileSync(f, content, 'utf8');
      }
    }
  }
}

console.log(`[imports->alias] Scanned: ${totalFiles} files, ${modified} would be modified${isWrite ? ' (written)' : ''}.`);
