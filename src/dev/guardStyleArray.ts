import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const orig = React.createElement as any;
  const seen = new Set<string>();
  // @ts-ignore monkeypatch dev only
  React.createElement = function(type: any, props: any, ...children: any[]) {
    const isDom = typeof type === 'string';
    if (isDom && props && Array.isArray(props.style)) {
      const key = `${type}`;
      if (!seen.has(key)) {
        seen.add(key);
        // eslint-disable-next-line no-console
        console.error(
          `[style-array-dom] <${type}> menerima style array.`,
          '\nSampel style[0]:',
          props.style[0],
          '\nStack:\n',
          new Error().stack
        );
      }
    }
    return orig(type, props, ...children);
  };
}
