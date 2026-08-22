import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Delete } from 'lucide-react';
import { hasPin, setPin, verifyPin, resetPin, markUnlocked } from '@/lib/guardianAuth';

const PIN_LENGTH = 4;
const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

export default function AreaResponsavel() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('loading'); // loading | create | confirm | enter
  const [digits, setDigits] = useState('');
  const [firstEntry, setFirstEntry] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(hasPin() ? 'enter' : 'create');
  }, []);

  const title =
    mode === 'create' ? 'Crie um PIN de 4 dígitos'
    : mode === 'confirm' ? 'Digite de novo pra confirmar'
    : 'Digite o PIN do responsável';

  const handlePress = async (key) => {
    setError('');
    if (key === 'back') {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (key === '' || digits.length >= PIN_LENGTH) return;

    const next = digits + key;
    setDigits(next);
    if (next.length < PIN_LENGTH) return;

    // PIN completo — decide o que fazer
    setTimeout(async () => {
      if (mode === 'create') {
        setFirstEntry(next);
        setDigits('');
        setMode('confirm');
      } else if (mode === 'confirm') {
        if (next === firstEntry) {
          await setPin(next);
          markUnlocked();
          navigate('/cadastro');
        } else {
          setError('Os PINs não bateram. Vamos tentar de novo.');
          setDigits('');
          setFirstEntry('');
          setMode('create');
        }
      } else if (mode === 'enter') {
        const ok = await verifyPin(next);
        if (ok) {
          markUnlocked();
          navigate('/cadastro');
        } else {
          setError('PIN incorreto.');
          setDigits('');
        }
      }
    }, 120);
  };

  const handleForgot = () => {
    if (confirm('Isso vai apagar o PIN atual e você vai criar um novo. Continuar?')) {
      resetPin();
      setDigits('');
      setFirstEntry('');
      setError('');
      setMode('create');
    }
  };

  if (mode === 'loading') return null;

  return (
    <div className="min-h-screen bg-[#FDF8F5] relative overflow-hidden flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-violet-200/25 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-rose-200/25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-xs"
      >
        <div className="w-14 h-14 rounded-full bg-white grid place-items-center mx-auto mb-5 border border-stone-100">
          <ShieldCheck className="w-6 h-6 text-stone-500" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Área do responsável</p>
        <h1 className="mt-2 font-display text-2xl text-stone-800">{title}</h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode + error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-3 my-8"
          >
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <span
                key={i}
                className={`w-4 h-4 rounded-full border-2 ${
                  i < digits.length ? 'bg-stone-800 border-stone-800' : 'border-stone-300'
                }`}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {error && <p className="text-sm text-rose-500 -mt-4 mb-6">{error}</p>}

        <div className="grid grid-cols-3 gap-3">
          {PAD.map((key, i) =>
            key === '' ? (
              <div key={i} />
            ) : (
              <button
                key={i}
                onClick={() => handlePress(key)}
                className="h-16 rounded-2xl bg-white border border-stone-100 text-xl font-display text-stone-800 grid place-items-center hover:bg-stone-50 active:scale-95 transition-transform"
                aria-label={key === 'back' ? 'Apagar dígito' : key}
              >
                {key === 'back' ? <Delete className="w-5 h-5" /> : key}
              </button>
            )
          )}
        </div>

        {mode === 'enter' && (
          <button onClick={handleForgot} className="mt-8 text-sm text-stone-400 hover:text-stone-600 underline">
            Esqueci o PIN
          </button>
        )}
      </motion.div>
    </div>
  );
}
