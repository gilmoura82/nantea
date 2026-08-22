import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { saveWhoUses } from '@/lib/profileStore';

const OPTIONS = [
  { id: 'crianca', label: 'Criança', hint: '4 a 9 anos', emoji: '🧒', gradient: 'from-rose-200 to-amber-100' },
  { id: 'adolescente', label: 'Adolescente', hint: '10 a 17 anos', emoji: '🧑', gradient: 'from-violet-200 to-rose-100' },
  { id: 'adulto', label: 'Adulto', hint: '18 a 59 anos', emoji: '🙂', gradient: 'from-amber-200 to-orange-100' },
  { id: 'idoso', label: 'Pessoa idosa', hint: '60 anos ou mais', emoji: '👴', gradient: 'from-sky-100 to-violet-100' },
];

export default function QuemVaiUsar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    saveWhoUses(selected);
    navigate('/area-responsavel');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] relative overflow-hidden flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Antes de começar</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-stone-800">
          Quem vai usar o Nantea?
        </h1>
        <p className="mt-3 text-stone-500 text-sm leading-relaxed">
          Isso ajuda a gente a preparar a linguagem e as opções certas pra essa pessoa.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`rounded-3xl p-5 border-2 transition-colors text-left ${
                selected === opt.id
                  ? 'border-stone-800 bg-white'
                  : 'border-transparent bg-white/70 hover:bg-white'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${opt.gradient} grid place-items-center text-2xl`}
              >
                {opt.emoji}
              </div>
              <div className="mt-3 font-display text-base text-stone-800">{opt.label}</div>
              <div className="text-xs text-stone-400">{opt.hint}</div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="mt-10 h-14 px-10 rounded-full bg-stone-800 hover:bg-stone-900 text-base disabled:opacity-40"
        >
          Continuar
        </Button>
      </motion.div>
    </div>
  );
}
