import React, { useState } from 'react';
import { X, Lock, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface JewelryBoxPuzzleModalProps {
  isSolved: boolean;
  onSolve: () => void;
  onClose: () => void;
}

interface SymbolOption {
  id: string;
  name: string;
  icon: string;
}

export const JewelryBoxPuzzleModal: React.FC<JewelryBoxPuzzleModalProps> = ({
  isSolved,
  onSolve,
  onClose,
}) => {
  const SYMBOLS: SymbolOption[] = [
    { id: 'rose', name: 'Rosa Negra', icon: '🌹' },
    { id: 'goblet', name: 'Cálice de Prata', icon: '🍷' },
    { id: 'raven', name: 'Corvo Noturno', icon: '🦅' },
    { id: 'skull', name: 'Crânio de Marfim', icon: '💀' },
    { id: 'key', name: 'Chave Quebrada', icon: '🗝️' },
  ];

  // Target combination: Rosa -> Cálice -> Corvo -> Crânio (indices 0, 1, 2, 3)
  const [dials, setDials] = useState<number[]>([2, 4, 1, 0]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(isSolved);

  const rotateDial = (dialIndex: number, direction: 'up' | 'down') => {
    if (unlocked) return;
    audioEngine.playClockTick();
    setDials((prev) => {
      const next = [...prev];
      if (direction === 'up') {
        next[dialIndex] = (next[dialIndex] + 1) % SYMBOLS.length;
      } else {
        next[dialIndex] = next[dialIndex] === 0 ? SYMBOLS.length - 1 : next[dialIndex] - 1;
      }
      return next;
    });
    setFeedback(null);
  };

  const handleUnlock = () => {
    // Check if dials match target [0, 1, 2, 3]
    if (dials[0] === 0 && dials[1] === 1 && dials[2] === 2 && dials[3] === 3) {
      setUnlocked(true);
      audioEngine.playLockUnlock();
      audioEngine.playPuzzleSolved();
      setFeedback('As travas de latão deslizam suavemente... A tampa se ergue!');
      window.setTimeout(() => {
        onSolve();
      }, 1600);
    } else {
      audioEngine.playHeartbeat();
      setFeedback('O mecanismo interno permaneceu rígido e travado.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-xl border border-amber-950/70 bg-[#141018] p-6 shadow-2xl text-[#f3ede4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/40 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="text-amber-400" size={20} />
            <div>
              <h3 className="font-gothic text-xl font-bold tracking-wide text-amber-200">
                Caixa de Joias Mecânica
              </h3>
              <p className="font-vintage text-sm text-neutral-400">
                Entalhada em ébano com quatro cilindros giratórios de latão.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Poetic Clue */}
        <div className="my-5 rounded-lg border border-amber-900/40 bg-[#1c141a] p-4 text-center font-vintage text-sm italic text-amber-200/90 shadow-inner">
          <p className="leading-relaxed">
            "Primeiro a <strong className="text-amber-300 not-italic">Rosa</strong> de nosso primeiro voto no jardim,<br />
            Depois o <strong className="text-amber-300 not-italic">Cálice</strong> de vinho jurado na noite fria,<br />
            Então o <strong className="text-amber-300 not-italic">Corvo</strong> que grasnou sobre o telhado,<br />
            E por fim o <strong className="text-amber-300 not-italic">Crânio</strong>, guardião do sono eterno."
          </p>
        </div>

        {/* 4 Dials */}
        <div className="my-6 grid grid-cols-4 gap-3">
          {dials.map((symbolIdx, index) => {
            const sym = SYMBOLS[symbolIdx];
            return (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg border border-amber-900/50 bg-[#201824] p-2.5 shadow"
              >
                <button
                  onClick={() => rotateDial(index, 'up')}
                  disabled={unlocked}
                  className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-amber-200 disabled:opacity-30 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>

                <div className="my-2 flex h-16 w-16 items-center justify-center rounded-md border border-amber-700/40 bg-[#100c14] text-3xl shadow-inner">
                  <span>{sym.icon}</span>
                </div>

                <div className="font-gothic text-[11px] font-semibold text-amber-300/80 truncate w-full text-center">
                  {sym.name}
                </div>

                <button
                  onClick={() => rotateDial(index, 'down')}
                  disabled={unlocked}
                  className="mt-1 rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-amber-200 disabled:opacity-30 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-4">
          <button
            onClick={handleUnlock}
            disabled={unlocked}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700/80 py-2.5 font-gothic text-sm font-bold text-amber-100 hover:bg-amber-600 disabled:opacity-50 transition-colors shadow-lg"
          >
            <Lock size={16} />
            Alinhar Segredo dos Cilindros
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="mt-3 rounded-lg border border-amber-900/40 bg-black/60 p-2.5 text-center font-vintage text-sm text-amber-300">
            {feedback}
          </div>
        )}

        {unlocked && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-3 text-emerald-200 font-vintage text-sm">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <span>
              Você obteve o <strong className="text-white">Ponteiro dos Minutos</strong> e a <strong className="text-white">Lente de Vidência Oculta</strong>!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
