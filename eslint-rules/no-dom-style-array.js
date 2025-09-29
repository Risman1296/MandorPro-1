module.exports = {
  meta: { type: 'problem', docs: { description: 'Disallow style arrays on DOM/Link/Slot' } , schema: []},
  create(context) {
    const DOM = new Set(['a','div','span','img','button','input','label','ul','li','nav','main','section']);
    const TARGET = new Set(['Link','Slot']);
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        if (!node.value || node.value.type !== 'JSXExpressionContainer') return;
        if (node.value.expression.type !== 'ArrayExpression') return;

        const parent = node.parent && node.parent.name;
        if (!parent) return;

        const getName = (n) => n.type === 'JSXIdentifier' ? n.name : null;
        const name = getName(parent);
        if (name && (DOM.has(name) || TARGET.has(name))) {
          context.report({
            node,
            message: 'Use StyleSheet.flatten(...) or className instead of style array on DOM/Link/Slot.'
          });
        }
      }
    };
  }
};