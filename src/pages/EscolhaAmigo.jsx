import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveCompanion } from '@/lib/profileStore';
import CompanionAvatar, { COMPANIONS, getCompanion } from '@/components/CompanionAvatar';

export default function EscolhaAmigo() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedId, setSelectedId] = useState(null);
  const [customPhoto, setCustomPhoto] = useState(null);
  const [name, setName] = useState('');

  const handleSelect = (id) => {
    setSelectedId(id);
    const companion = getCompanion(id);
    setName(companion ? companion.suggested : '');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhoto(reader.result);
      setSelectedId('custom');
      setName('');
    };
    reader.readAsDataURL(file);
  };

  const handleStart = () => {
    if (!selectedId) return;
    const finalName = name.trim() || (selectedId === 'custom' ? 'Amigo' : getCompanion(selectedId)?.suggested);
    saveCompanion({
      id: selectedId,
      name: finalName,
      photoUrl: selectedId === 'custom' ? customPhoto : null,
    });
    navigate('/inicio');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] relative overflow-hidden px-6 py-16">
      <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-sm mx-auto text-center"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Seu amiguinho</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-stone-800">
          Quem vai te acompanhar?
        </h1>
        <p className="mt-3 text-stone-500 text-sm leading-relaxed">
          Escolha um amiguinho pra ficar com você. Ele te ajuda a lembrar da sua rotina.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 text-left">
          {COMPANIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`rounded-3xl p-4 border-2 transition-colors ${
                selectedId === c.id ? 'border-stone-800 bg-white' : 'border-transparent bg-white/70 hover:bg-white'
              }`}
            >
              <CompanionAvatar id={c.id} size={64} className="mx-auto" />
              <div className="mt-3 font-display text-sm text-stone-800 text-center">{c.label}</div>
              <div className="text-xs text-stone-400 text-center">{c.trait}</div>
            </button>
          ))}

          {selectedId === 'custom' && customPhoto ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-3xl p-4 border-2 border-stone-800 bg-white"
            >
              <CompanionAvatar photoUrl={customPhoto} size={64} className="mx-auto" />
              <div className="mt-3 font-display text-sm text-stone-800 text-center">Sua foto</div>
              <div className="text-xs text-stone-400 text-center">Trocar foto</div>
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-3xl p-4 border-2 border-dashed border-stone-300 text-stone-400 hover:border-stone-400 flex flex-col items-center justify-center gap-2"
            >
              <Camera className="w-6 h-6" />
              <div className="font-display text-sm">Foto real</div>
              <div className="text-xs">Bichinho ou objeto</div>
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-stone-400">
          A foto real é só para bichinhos, brinquedos ou objetos — nunca para fotos de pessoas.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        {selectedId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 bg-white rounded-3xl p-6 border border-stone-100"
          >
            <CompanionAvatar id={selectedId} photoUrl={customPhoto} size={56} className="mx-auto" />
            <label className="block mt-4 text-sm font-medium text-stone-600">
              Que nome ele vai ter?
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              className="mt-2 text-center rounded-full h-12"
            />
            <Button
              onClick={handleStart}
              className="mt-6 h-14 px-10 rounded-full bg-stone-800 hover:bg-stone-900 text-base w-full"
            >
              Pronto, vamos começar!
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
