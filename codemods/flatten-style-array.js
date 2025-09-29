/**
 * Codemod: style={[...]} -> style={StyleSheet.flatten([...])} untuk DOM/Link/Slot
 */
const DOM_NAMES = new Set(['a','div','span','img','button','input','label','ul','li','nav','main','section']);
const TARGET_NAMES = new Set(['Link','Slot']); // boleh tambah

module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // helper: pastikan import StyleSheet ada
  const ensureImport = () => {
    const hasImport = root.find(j.ImportDeclaration, {
      source: { value: 'react-native' }
    }).filter(p =>
      p.node.specifiers.some(s => s.imported && s.imported.name === 'StyleSheet')
    ).size() > 0;

    if (!hasImport) {
      const rnImport = root.find(j.ImportDeclaration, { source: { value: 'react-native' }});
      if (rnImport.size()) {
        rnImport.get().node.specifiers.push(
          j.importSpecifier(j.identifier('StyleSheet'))
        );
      } else {
        root.get().node.program.body.unshift(
          j.importDeclaration(
            [j.importSpecifier(j.identifier('StyleSheet'))],
            j.literal('react-native')
          )
        );
      }
    }
  };

  const isTargetElement = (name) =>
    DOM_NAMES.has(name) || TARGET_NAMES.has(name);

  root.find(j.JSXAttribute, { name: { name: 'style' }})
    .filter(path => path.node.value && path.node.value.expression && path.node.value.expression.type === 'ArrayExpression')
    .filter(path => {
      const el = path.parent.node.name;
      if (el.type === 'JSXIdentifier') return isTargetElement(el.name);
      if (el.type === 'JSXMemberExpression') return false;
      return false;
    })
    .forEach(path => {
      ensureImport();
      const arr = path.node.value.expression;
      path.node.value = j.jsxExpressionContainer(
        j.callExpression(
          j.memberExpression(j.identifier('StyleSheet'), j.identifier('flatten')),
          [arr]
        )
      );
    });

  return root.toSource({ quote: 'single' });
};