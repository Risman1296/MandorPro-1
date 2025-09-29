/**
 * Codemod: style={[...]} -> style={StyleSheet.flatten([...])}
 * Strategy: flatten ALL style arrays EXCEPT on known safe RN primitives.
 * Bonus: Link/Slot (DOM-forwarding) will be flattened because they're not in SAFE_RN.
 */
const SAFE_RN = new Set([
  'View','Text','Image','Pressable','TouchableOpacity','TouchableWithoutFeedback',
  'ScrollView','FlatList','SectionList','TextInput','Modal','SafeAreaView'
]);

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

  const isTargetElement = (name) => !SAFE_RN.has(name);

  root.find(j.JSXAttribute, { name: { name: 'style' }})
    .filter(path => path.node.value && path.node.value.expression && path.node.value.expression.type === 'ArrayExpression')
    .filter(path => {
      const el = path.parent.node.name;
      if (el.type !== 'JSXIdentifier') return false;
      const name = el.name;
      return isTargetElement(name);
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