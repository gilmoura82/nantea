import React from 'react';

// Stub simples só pra este projeto rodar sozinho.
// No projeto real de vocês, isso deve ser o Button do shadcn/ui.
export function Button({ className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
