import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sunrise, Coffee, Backpack, Moon, Heart, Smile, Meh, Frown, Angry, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompanion as getSavedCompanion, getProfile } from '@/lib/profileStore';
import CompanionAvatar, { getCompanion as getCompanionData } from '@/components/CompanionAvatar';
import RecadoMamae from '@/components/RecadoMamae';

function toDigits(v) {
  return (v || '').replace(/\D/g, '');
}
// Assume DDI 55 (Brasil) se o número não vier com ele
function toInternational(v) {
  const digits = toDigits(v);
  if (!digits) return '';
  return digits.length >= 12 ? digits : '55' + digits;
}

const ROTINA = [
  { label: 'Escovar os dentes', icon: Sunrise, bg: 'bg-amber-100', fg: 'text-amber-700' },
  { label: 'Café da manhã', icon: Coffee, bg: 'bg-amber-100', fg: 'text-amber-700' },
  { label: 'Ir para a escola', icon: Backpack, bg: 'bg-violet-100', fg: 'text-violet-700' },
  { label: 'Hora de descansar', icon: Moon, bg: 'bg-sky-100', fg: 'text-sky-700' },
];

const MOODS = [
  { id: 'feliz', label: 'Bem', Icon: Smile, reply: 'Que bom! Vamos aproveitar o dia.' },
  { id: 'maisoumenos', label: 'Mais ou menos', Icon: Meh, reply: 'Tudo bem sentir assim às vezes.' },
  { id: 'triste', label: 'Triste', Icon: Frown, reply: 'Sinto muito. Quer me contar o que houve?' },
  { id: 'irritado', label: 'Irritado', Icon: Angry, reply: 'Entendo. Vamos respirar juntos um pouquinho?' },
  { id: 'cansado', label: 'Cansado', Icon: BedDouble, reply: 'Podemos ir com calma hoje.' },
];

export default function Inicio() {
  const [companion, setCompanion] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [greeting, setGreeting] = useState('Oi! Que bom te ver. Vamos ver o que temos pra hoje?');
  const [mood, setMood] = useState(null);
  const [helpState, setHelpState] = useState('idle'); // idle | sending | sent
  const [guardianPhone, setGuardianPhone] = useState('');

  useEffect(() => {
    const saved = getSavedCompanion?.();
    if (saved) setCompanion(saved);
    const profile = getProfile?.();
    if (profile?.telefoneResponsavel) setGuardianPhone(profile.telefoneResponsavel);
  }, []);

  const handleMood = (m) => {
    setMood(m.id);
    setGreeting(m.reply);
  };

  const helpPhone = toInternational(guardianPhone);
  const helpMessage = 'Preciso de ajuda agora, pode me ligar?';

  const handleHelp = () => {
    if (helpState !== 'idle') return;
    setHelpState('sending');
    setTimeout(() => {
      setHelpState('sent');
      if (helpPhone) {
        // Abre o discador do celular já com o número preenchido.
        // Por segurança do navegador, a ligação em si precisa de 1 toque a mais.
        window.location.href = `tel:+${helpPhone}`;
      }
    }, 1400);
  };

  const step = ROTINA[stepIndex];
  const companionData = companion?.id ? getCompanionData(companion.id) : null;

  return (
    <div className="min-h-screen bg-[#FDF8F5] px-6 py-10 pb-16">
      <div className="max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/escolha-amigo" className="text-sm text-stone-400 hover:text-stone-600">
            ‹ Trocar amiguinho
          </Link>
        </div>

        {/* Amiguinho */}
        <div className="flex items-center gap-4 bg-white rounded-3xl border border-stone-100 p-4 mb-6">
          <CompanionAvatar
            id={companion?.id}
            photoUrl={companion?.photoUrl}
            size={56}
            className="flex-shrink-0"
          />
          <p className="text-sm text-stone-600 leading-relaxed">
            <span className="block font-display text-sm text-stone-800 mb-0.5">
              {companion?.name || companionData?.suggested || 'Seu amiguinho'}
            </span>
            {greeting}
          </p>
        </div>

        {/* Recado da mamãe — sempre separado do amiguinho */}
        <RecadoMamae />

        {/* Trilha do dia */}
        <p className="font-display text-base text-stone-800 mb-3">Sua trilha de hoje</p>
        <AnimatePresence mode="wait">
          {step ? (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl border border-stone-100 p-7 text-center mb-6"
            >
              <p className="text-xs text-stone-400 mb-4">
                Passo {stepIndex + 1} de {ROTINA.length}
              </p>
              <div className={`w-20 h-20 rounded-3xl ${step.bg} ${step.fg} grid place-items-center mx-auto mb-4`}>
                <step.icon className="w-9 h-9" />
              </div>
              <p className="font-display text-lg text-stone-800 mb-5">{step.label}</p>
              <Button
                onClick={() => setStepIndex((i) => i + 1)}
                className="h-12 px-8 rounded-full bg-amber-300 hover:bg-amber-400 text-stone-800"
              >
                Concluí ✓
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 mb-6 text-stone-500 text-sm"
            >
              <Heart className="w-6 h-6 mx-auto mb-2 text-rose-400" />
              Você terminou tudo por hoje. Bom trabalho!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Humor */}
        <p className="font-display text-base text-stone-800 mb-3">Como você está?</p>
        <div className="flex justify-between gap-2 mb-8">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMood(m)}
              className={`flex-1 flex flex-col items-center gap-1 rounded-2xl border-2 py-3 transition-colors ${
                mood === m.id
                  ? 'border-stone-800 bg-white text-stone-800'
                  : 'border-transparent bg-white/70 text-stone-400 hover:bg-white'
              }`}
            >
              <m.Icon className="w-5 h-5" />
              <span className="text-[10px]">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Preciso de ajuda */}
        <div className="pt-2 border-t border-stone-200">
          <Button
            onClick={handleHelp}
            disabled={helpState !== 'idle'}
            className="w-full h-16 mt-4 rounded-3xl bg-rose-400 hover:bg-rose-500 text-white text-lg font-display flex items-center justify-center gap-2 disabled:opacity-80"
          >
            <Heart className="w-5 h-5" />
            Preciso de ajuda
          </Button>
          {helpState === 'sending' && (
            <p className="text-center text-sm text-stone-400 mt-3">Chamando sua mãe…</p>
          )}
          {helpState === 'sent' && (
            <div className="mt-3">
              {helpPhone ? (
                <>
                  <p className="text-center text-sm text-emerald-700 font-semibold mb-3">
                    ✓ Abrindo ligação para sua mãe…
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:+${helpPhone}`}
                      className="w-full h-12 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-display flex items-center justify-center gap-2"
                    >
                      📞 Ligar agora
                    </a>
                    <a
                      href={`https://wa.me/${helpPhone}?text=${encodeURIComponent(helpMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-display flex items-center justify-center gap-2"
                    >
                      💬 Chamar no WhatsApp
                    </a>
                    <a
                      href={`sms:+${helpPhone}?body=${encodeURIComponent(helpMessage)}`}
                      className="w-full h-12 rounded-2xl bg-white border border-stone-200 text-stone-700 text-sm font-display flex items-center justify-center gap-2"
                    >
                      ✉️ Enviar SMS
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-center text-sm text-stone-400">
                  Nenhum telefone de responsável cadastrado. Peça pra configurar isso na Área do Responsável.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
