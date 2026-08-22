import React from 'react';

// Stub simples só pra este projeto rodar sozinho.
// No projeto real de vocês, isso deve ser o Textarea do shadcn/ui.
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full border border-stone-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-300 ${className}`}
      {...props}
    />
  );
}
