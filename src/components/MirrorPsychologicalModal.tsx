import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface MirrorPsychologicalModalProps {
  hasMoistCloth: boolean;
  isCleaned: boolean;
  onCleaned: () => void;
  onClose: () => void;
}

export const MirrorPsychologicalModal: React.FC<MirrorPsychologicalModalProps> = ({
  hasMoistCloth,
  isCleaned,
  onCleaned,
  onClose,
}) => {
  const [cleaned, setCleaned] = useState(isCleaned);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isHorrorTriggered, setIsHorrorTriggered] = useState(isCleaned);

  const handleCleanMirror = () => {
    if (!hasMoistCloth) {
      setFeedback('A poeira e a fuligem estão incrustadas no vidro há décadas. Você precisa de um lenço com solvente químico para limpá-lo.');
      return;
    }

    setCleaned(true);
    audioEngine.playLockUnlock();

    // Trigger psychological terror after a brief suspense pause
    window.setTimeout(() => {
      audioEngine.playHeartbeat();
      audioEngine.setTension(2);
      setIsHorrorTriggered(true);
      onCleaned();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-xl border border-amber-950/70 bg-[#120e17] p-6 shadow-2xl text-[#f3ede4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/40 pb-3">
          <div>
            <h3 className="font-gothic text-xl font-bold tracking-wide text-amber-200">
              Espelho da Penteadeira Vitoriana
            </h3>
            <p className="font-vintage text-sm text-neutral-400">
              Moldura dourada esculpida com querubins de feições aflitas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mirror Frame & Glass */}
        <div className="my-6 flex justify-center">
          <div className="relative flex h-80 w-64 items-center justify-center overflow-hidden rounded-[50%/40%] border-8 border-amber-900/70 bg-gradient-to-b from-[#1b1522] via-[#241d2f] to-[#0c0911] shadow-[0_0_40px_rgba(0,0,0,0.9)]">
            {/* Mirror reflection states */}
            {!cleaned ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-28 w-28 rounded-full border border-dashed border-amber-900/40 bg-neutral-900/50 backdrop-blur-sm" />
                <div className="mt-4 font-vintage text-xs italic text-neutral-400">
                  A superfície de vidro está completamente opaca por uma crosta espessa de fuligem e tempo.
                </div>
              </div>
            ) : (
              <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
                {/* Eerie reflection */}
                <div className="relative flex flex-col items-center animate-pulse">
                  {/* Faceless silhouette with Victorian collar */}
                  <div className="relative h-28 w-24 rounded-t-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center">
                    <span className="font-gothic text-[11px] tracking-widest text-neutral-500/80">
                      [SEM ROSTO]
                    </span>
                  </div>
                  <div className="h-20 w-36 rounded-t-3xl bg-neutral-950 border-t border-neutral-800 flex items-center justify-center">
                    <span className="text-xl">🥀</span>
                  </div>
                </div>

                {/* Bloody / Ethereal apparition message */}
                {isHorrorTriggered && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center backdrop-blur-[1px]">
                    <div className="font-gothic text-sm font-bold tracking-widest text-red-500 animate-pulse">
                      "JULIAN..."
                    </div>
                    <p className="mt-2 font-vintage text-xs italic text-red-200/90 leading-relaxed">
                      "Por que você procura escapar pelas portas trancadas?<br />
                      Sua carne já se desfez em pó há cem outonos.<br />
                      <strong className="text-amber-300 not-italic">O relógio de pêndulo parou às 03:45.</strong>"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Clean action */}
        {!cleaned ? (
          <div className="space-y-3">
            <button
              onClick={handleCleanMirror}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700/80 py-2.5 font-gothic text-sm font-bold text-amber-100 hover:bg-amber-600 transition-colors shadow-lg"
            >
              <Sparkles size={16} />
              Limpar Espelho com o Lenço Alquímico
            </button>
            {feedback && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-900/50 bg-black/60 p-2.5 text-xs font-vintage text-amber-300">
                <AlertCircle size={15} className="text-amber-500 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-red-950/60 bg-red-950/30 p-3 text-center">
            <div className="font-gothic text-xs font-bold text-red-300 uppercase tracking-widest">
              Revelação Psicológica Registrada
            </div>
            <p className="mt-1 font-vintage text-xs text-red-200/80">
              A frieza no seu peito confirma: algo terrível e inevitável aconteceu com você. O tempo congelou às 03:45.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
