import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, User } from 'lucide-react';
import { getMomMessage, saveMomMessage } from '@/lib/profileStore';

// Cartão da mãe (ou outro responsável) — voz e foto reais, gravadas por ela.
// Isso NUNCA vira a voz ou o rosto do amiguinho de IA: fica sempre marcado
// como uma pessoa real, separado do personagem.
export default function RecadoMamae() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const photoInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const micSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  useEffect(() => {
    const saved = getMomMessage?.();
    if (saved) {
      setPhotoUrl(saved.photoUrl || null);
      setRecordingUrl(saved.recordingUrl || null);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result);
      saveMomMessage({ photoUrl: reader.result, recordingUrl });
    };
    reader.readAsDataURL(file);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        saveMomMessage({ photoUrl, recordingUrl: url });
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
    }
  };

  const deleteRecording = () => {
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    setRecordingUrl(null);
    saveMomMessage({ photoUrl, recordingUrl: null });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-700/70 p-4 mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800 mb-3">
        Pessoa real — não é o amiguinho
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => photoInputRef.current?.click()}
          className="w-14 h-14 rounded-full bg-stone-100 grid place-items-center overflow-hidden flex-shrink-0 hover:bg-stone-200"
          aria-label="Anexar foto da mamãe"
        >
          {photoUrl ? (
            <img src={photoUrl} alt="Foto da mamãe" className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-stone-400" />
          )}
        </button>
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

        <div className="flex-1 min-w-0">
          <div className="font-display text-sm text-stone-800 mb-2">Recado da mamãe</div>

          {!micSupported ? (
            <span className="text-xs text-stone-400">Gravação indisponível neste navegador</span>
          ) : isRecording ? (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleRecording}
                className="w-9 h-9 rounded-full bg-rose-400 text-white grid place-items-center hover:bg-rose-500"
                aria-label="Parar gravação"
              >
                <Square className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-rose-500">Gravando…</span>
            </div>
          ) : recordingUrl ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => new Audio(recordingUrl).play()}
                className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 grid place-items-center hover:bg-stone-200"
                aria-label="Ouvir recado"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={toggleRecording}
                className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 grid place-items-center hover:bg-stone-200"
                aria-label="Regravar recado"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={deleteRecording}
                className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 grid place-items-center hover:bg-stone-200"
                aria-label="Apagar recado"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleRecording}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
            >
              <span className="w-9 h-9 rounded-full bg-stone-100 grid place-items-center">
                <Mic className="w-4 h-4" />
              </span>
              Gravar um recado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
