import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getProfileId } from '@/lib/profileStore';
export default function Welcome() {
  const hasProfile = !!getProfileId();
  return (
    <div className="min-h-screen bg-[#FDF8F5] relative overflow-hidden flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="mx-auto w-40 h-40 rounded-full bg-gradient-to-br from-rose-300 via-amber-200 to-violet-300 shadow-[0_30px_80px_-30px_rgba(190,110,150,0.6)] grid place-items-center">
          <span className="text-6xl">🌷</span>
        </div>
        <h1 className="mt-10 font-display text-5xl tracking-tight text-stone-800">Nantea</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-stone-400">companhia que cuida</p>
        <p className="mt-8 text-xl text-stone-600 max-w-sm mx-auto leading-relaxed">
          “Estou aqui para acompanhar você.”
        </p>
        <div className="mt-12 space-y-3">
          <Link to="/quem-vai-usar">
            <Button className="h-14 px-10 rounded-full bg-stone-800 hover:bg-stone-900 text-base">Começar</Button>
          </Link>
          {hasProfile && (
            <div>
              <Link to="/inicio" className="text-stone-500 underline text-sm">
                Continuar de onde parei
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
