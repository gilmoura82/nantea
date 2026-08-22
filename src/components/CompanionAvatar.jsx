import React from 'react';

// Amiguinhos ilustrados — nunca fotos de pessoas reais.
// A opção "custom" existe só para foto de bichinho de pelúcia ou objeto.
export const COMPANIONS = [
  { id: 'raposa', label: 'Raposa', trait: 'Curiosa e brincalhona', emoji: '🦊', gradient: 'from-orange-200 to-rose-200', suggested: 'Fael' },
  { id: 'coruja', label: 'Coruja', trait: 'Sábia e tranquila', emoji: '🦉', gradient: 'from-violet-200 to-indigo-100', suggested: 'Nina' },
  { id: 'urso', label: 'Urso', trait: 'Forte e gentil', emoji: '🐻', gradient: 'from-amber-200 to-orange-100', suggested: 'Tico' },
  { id: 'coelho', label: 'Coelho', trait: 'Doce e atenciosa', emoji: '🐰', gradient: 'from-rose-200 to-pink-100', suggested: 'Mel' },
  { id: 'estrela', label: 'Estrela', trait: 'Alegre e brilhante', emoji: '⭐', gradient: 'from-amber-200 to-yellow-100', suggested: 'Sol' },
  { id: 'nuvem', label: 'Nuvem', trait: 'Calma e sonhadora', emoji: '☁️', gradient: 'from-sky-100 to-violet-100', suggested: 'Bru' },
];

export function getCompanion(id) {
  return COMPANIONS.find((c) => c.id === id);
}

/**
 * Mostra o amiguinho. Se `photoUrl` vier preenchido (upload de bichinho/objeto
 * real), mostra a foto em vez do emoji ilustrado — mas nunca deve ser usado
 * com foto de uma pessoa.
 */
export default function CompanionAvatar({ id, photoUrl, size = 64, className = '' }) {
  const style = { width: size, height: size };

  if (photoUrl) {
    return (
      <div className={`rounded-full overflow-hidden ${className}`} style={style}>
        <img src={photoUrl} alt="Foto do amiguinho" className="w-full h-full object-cover" />
      </div>
    );
  }

  const companion = getCompanion(id);
  if (!companion) return null;

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${companion.gradient} grid place-items-center ${className}`}
      style={{ ...style, fontSize: size * 0.5 }}
    >
      {companion.emoji}
    </div>
  );
}
