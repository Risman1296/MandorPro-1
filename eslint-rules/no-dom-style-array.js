const SAFE_RN = new Set([
  'View','Text','Image','Pressable','TouchableOpacity','TouchableWithoutFeedback',
  'ScrollView','FlatList','SectionList','TextInput','Modal','SafeAreaView'
]);

module.exports = {
  meta: { type: 'problem', docs: { description: 'Disallow style arrays on non-RN primitives' } , schema: []},
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        if (!node.value || node.value.type !== 'JSXExpressionContainer') return;
        if (node.value.expression.type !== 'ArrayExpression') return;

        const open = node.parent && node.parent.name;
        if (!open || open.type !== 'JSXIdentifier') return;
        const name = open.name;

        if (!SAFE_RN.has(name)) {
          context.report({
            node,
            message: `style array is only allowed on RN primitives; found on <${name}>. Use StyleSheet.flatten(...) or className.`,
          });
        }
      }
    };
  }
};