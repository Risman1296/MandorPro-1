/**
 * jscodeshift transform:
 * - Ubah import/export relatif ('./', '../') menjadi alias '@/...'
 * - Basis alias = project root (process.cwd() atau --rootDir)
 */
// Pakai:
// npx jscodeshift -t codemods/imports-to-alias.js "app/**/*.{ts,tsx,js,jsx}" "src/**/*.{ts,tsx,js,jsx}" --rootDir=.
const path = require('path');

module.exports = function transformer(fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = options.rootDir ? path.resolve(options.rootDir) : process.cwd();
  const src = j(fileInfo.source);

  function toAlias(fromFile, rel) {
    if (!rel || !rel.startsWith('.')) return null; // hanya relatif
    const abs = path.resolve(path.dirname(fromFile), rel);
    let relFromRoot = path.relative(root, abs).replace(/\\/g, '/'); // win path→posix
    // opsional: hapus ekstensi umum
    relFromRoot = relFromRoot.replace(/\.(ts|tsx|js|jsx)$/, '');
    return `@/${relFromRoot}`;
  }

  function rewriteLiteral(lit) {
    if (!lit || typeof lit.value !== 'string') return;
    const next = toAlias(fileInfo.path, lit.value);
    if (next) lit.value = next;
  }

  src.find(j.ImportDeclaration).forEach((p) => rewriteLiteral(p.value.source));
  src.find(j.ExportNamedDeclaration).forEach((p) => rewriteLiteral(p.value.source));
  src.find(j.ExportAllDeclaration).forEach((p) => rewriteLiteral(p.value.source));

  return src.toSource({ quote: 'single' });
};
