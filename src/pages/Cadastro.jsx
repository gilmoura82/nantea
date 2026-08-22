import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveProfile } from '@/lib/profileStore';

const COMUNICACAO = ['Fala', 'Texto', 'Botões visuais', 'Uma mistura'];
const SENSIBILIDADES = ['Sons altos', 'Luzes fortes', 'Toque', 'Multidões', 'Cheiros fortes', 'Mudanças de rotina'];
const ACALMAR = ['Silêncio', 'Música calma', 'Abraço apertado', 'Ficar sozinho(a) um pouco', 'Objeto favorito', 'Respirar fundo'];
const INDEPENDENCIA = [
  { id: 'bastante-apoio', label: 'Precisa de bastante apoio' },
  { id: 'algum-apoio', label: 'Precisa de apoio em algumas coisas' },
  { id: 'independente', label: 'É bem independente' },
];

const STEPS = ['Sobre a pessoa', 'Comunicação', 'Rotina e apoio', 'Gostos e objetivos'];

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm border-2 transition-colors ${
        active
          ? 'border-stone-800 bg-stone-800 text-white'
          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
      }`}
    >
      {label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-5 text-left">
      <label className="block text-sm font-medium text-stone-600 mb-2">{label}</label>
      {children}
    </div>
  );
}

export default function Cadastro() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    nome: '',
    idade: '',
    telefoneResponsavel: '',
    comunicacao: null,
    sensibilidades: [],
    acalmar: [],
    escolaTrabalho: '',
    horaAcordar: '',
    horaDormir: '',
    alimentacao: '',
    medicacoes: '',
    pessoasImportantes: '',
    gosta: '',
    naoGosta: '',
    independencia: null,
    objetivos: '',
  });

  const set = (key) => (value) => setData((d) => ({ ...d, [key]: value }));
  const toggleChip = (key, value) => {
    setData((d) => {
      const list = d[key];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...d, [key]: next };
    });
  };

  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      saveProfile(data);
      navigate('/escolha-amigo');
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] relative overflow-hidden px-6 py-14">
      <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-violet-200/25 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-rose-200/25 blur-3xl" />

      <div className="relative max-w-sm mx-auto">
        <div className="flex items-center justify-center gap-2 text-stone-400 text-xs mb-6">
          <ShieldCheck className="w-4 h-4" />
          Área protegida do responsável
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-6 bg-stone-800' : i < step ? 'w-2 bg-stone-400' : 'w-2 bg-stone-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="font-display text-2xl text-stone-800 text-center mb-1">{STEPS[step]}</h1>
            <p className="text-stone-400 text-sm text-center mb-8">Passo {step + 1} de {STEPS.length}</p>

            <div className="bg-white rounded-3xl border border-stone-100 p-6">
              {step === 0 && (
                <>
                  <Field label="Nome">
                    <Input value={data.nome} onChange={(e) => set('nome')(e.target.value)} className="rounded-xl h-12" />
                  </Field>
                  <Field label="Idade">
                    <Input
                      type="number"
                      value={data.idade}
                      onChange={(e) => set('idade')(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </Field>
                  <Field label="Pessoas importantes na rotina dela">
                    <Textarea
                      value={data.pessoasImportantes}
                      onChange={(e) => set('pessoasImportantes')(e.target.value)}
                      placeholder="Ex: mãe, avó, professora Ana, terapeuta..."
                      className="rounded-xl min-h-[80px]"
                    />
                  </Field>
                  <Field label="Telefone do responsável (para pedidos de ajuda)">
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="(11) 91234-5678"
                      value={data.telefoneResponsavel}
                      onChange={(e) => set('telefoneResponsavel')(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <Field label="Forma de comunicação preferida">
                    <div className="flex flex-wrap gap-2">
                      {COMUNICACAO.map((c) => (
                        <Chip key={c} label={c} active={data.comunicacao === c} onClick={() => set('comunicacao')(c)} />
                      ))}
                    </div>
                  </Field>
                  <Field label="O que costuma incomodar ou sobrecarregar">
                    <div className="flex flex-wrap gap-2">
                      {SENSIBILIDADES.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          active={data.sensibilidades.includes(s)}
                          onClick={() => toggleChip('sensibilidades', s)}
                        />
                      ))}
                    </div>
                  </Field>
                  <Field label="O que ajuda a acalmar">
                    <div className="flex flex-wrap gap-2">
                      {ACALMAR.map((a) => (
                        <Chip key={a} label={a} active={data.acalmar.includes(a)} onClick={() => toggleChip('acalmar', a)} />
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Escola ou trabalho">
                    <Input
                      value={data.escolaTrabalho}
                      onChange={(e) => set('escolaTrabalho')(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Acorda por volta de">
                      <Input
                        type="time"
                        value={data.horaAcordar}
                        onChange={(e) => set('horaAcordar')(e.target.value)}
                        className="rounded-xl h-12"
                      />
                    </Field>
                    <Field label="Dorme por volta de">
                      <Input
                        type="time"
                        value={data.horaDormir}
                        onChange={(e) => set('horaDormir')(e.target.value)}
                        className="rounded-xl h-12"
                      />
                    </Field>
                  </div>
                  <Field label="Alimentação — restrições ou preferências">
                    <Textarea
                      value={data.alimentacao}
                      onChange={(e) => set('alimentacao')(e.target.value)}
                      className="rounded-xl min-h-[70px]"
                    />
                  </Field>
                  <Field label="Medicações ou lembretes (opcional)">
                    <Textarea
                      value={data.medicacoes}
                      onChange={(e) => set('medicacoes')(e.target.value)}
                      placeholder="Só o que for útil pra lembrar — sem detalhes clínicos"
                      className="rounded-xl min-h-[70px]"
                    />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <Field label="Coisas que gosta">
                    <Textarea
                      value={data.gosta}
                      onChange={(e) => set('gosta')(e.target.value)}
                      className="rounded-xl min-h-[70px]"
                    />
                  </Field>
                  <Field label="Coisas que não gosta">
                    <Textarea
                      value={data.naoGosta}
                      onChange={(e) => set('naoGosta')(e.target.value)}
                      className="rounded-xl min-h-[70px]"
                    />
                  </Field>
                  <Field label="Nível de independência no dia a dia">
                    <div className="flex flex-col gap-2">
                      {INDEPENDENCIA.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => set('independencia')(opt.id)}
                          className={`text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors ${
                            data.independencia === opt.id
                              ? 'border-stone-800 bg-stone-800 text-white'
                              : 'border-stone-200 text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Objetivos com o Nantea">
                    <Textarea
                      value={data.objetivos}
                      onChange={(e) => set('objetivos')(e.target.value)}
                      placeholder="Ex: ganhar mais independência na rotina da manhã"
                      className="rounded-xl min-h-[70px]"
                    />
                  </Field>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-stone-400 hover:text-stone-600 disabled:opacity-0 px-2"
          >
            ‹ Voltar
          </button>
          <Button onClick={handleNext} className="h-12 px-8 rounded-full bg-stone-800 hover:bg-stone-900 text-base">
            {isLast ? 'Salvar e continuar' : 'Próximo'}
          </Button>
        </div>
      </div>
    </div>
  );
}
