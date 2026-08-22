import React from 'react';

// Stub simples só pra este projeto rodar sozinho.
// No projeto real de vocês, isso deve ser o Input do shadcn/ui.
export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-stone-200 px-4 focus:outline-none focus:ring-2 focus:ring-stone-300 ${className}`}
      {...props}
    />
  );
}
