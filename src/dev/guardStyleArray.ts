import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const orig = React.createElement as any;
  // @ts-ignore monkeypatch dev only
  React.createElement = function(type: any, props: any, ...children: any[]) {
    if (props && Array.isArray(props.style)) {
      const isDom = typeof type === 'string';
      if (isDom) {
        // eslint-disable-next-line no-console
        console.warn('[style-array-dom]', type, props.style);
      }
    }
    return orig(type, props, ...children);
  };
}
