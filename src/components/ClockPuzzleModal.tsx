import React, { useState } from 'react';
import { X, Check, HelpCircle } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface ClockPuzzleModalProps {
  hasMinuteHand: boolean;
  isClockUnlocked: boolean;
  onSolve: () => void;
  onClose: () => void;
}

export const ClockPuzzleModal: React.FC<ClockPuzzleModalProps> = ({
  hasMinuteHand,
  isClockUnlocked,
  onSolve,
  onClose,
}) => {
  const [placedMinuteHand, setPlacedMinuteHand] = useState(isClockUnlocked || false);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const rotateHour = (direction: 'cw' | 'ccw') => {
    audioEngine.playClockTick();
    setHour((prev) => {
      if (direction === 'cw') return prev === 12 ? 1 : prev + 1;
      return prev === 1 ? 12 : prev - 1;
    });
  };

  const rotateMinute = (direction: 'cw' | 'ccw') => {
    if (!placedMinuteHand) {
      setFeedback('O mostrador não tem o ponteiro dos minutos!');
      return;
    }
    audioEngine.playClockTick();
    setMinute((prev) => {
      if (direction === 'cw') return (prev + 5) % 60;
      return prev === 0 ? 55 : prev - 5;
    });
  };

  const handlePlaceHand = () => {
    if (hasMinuteHand) {
      audioEngine.playLockUnlock();
      setPlacedMinuteHand(true);
      setFeedback('Você encaixou o ponteiro de bronze dos minutos com firmeza.');
    } else {
      setFeedback('Você precisa encontrar o ponteiro de bronze dos minutos.');
    }
  };

  const handleVerify = () => {
    if (!placedMinuteHand) {
      setFeedback('O relógio ainda está incompleto.');
      return;
    }

    // Correct time is 03:45
    if (hour === 3 && minute === 45) {
      audioEngine.playClockChime();
      audioEngine.playPuzzleSolved();
      setFeedback('O pêndulo vibra intensamente! Três badaladas ecoam pelas paredes.');
      window.setTimeout(() => {
        onSolve();
      }, 1500);
    } else {
      audioEngine.playHeartbeat();
      setFeedback(`O mecanismo estala, mas nada acontece. (${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} não é a hora do evento).`);
    }
  };

  // Degrees calculation for clock hands
  const hourDeg = (hour % 12) * 30 + (minute / 60) * 30;
  const minuteDeg = minute * 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-xl border border-amber-900/40 bg-[#120f18] p-6 shadow-2xl text-[#f3ede4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div>
            <h3 className="font-gothic text-xl font-bold tracking-wide text-amber-200">
              O Relógio do Tempo Estagnado
            </h3>
            <p className="font-vintage text-sm text-neutral-400">
              Um pêndulo vitoriano imóvel há um século.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Clock Face Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-4 border-amber-800/60 bg-gradient-to-b from-[#2a2233] to-[#120f17] shadow-inner">
            {/* Roman Numerals */}
            {[
              { num: 'XII', deg: 0 },
              { num: 'I', deg: 30 },
              { num: 'II', deg: 60 },
              { num: 'III', deg: 90 },
              { num: 'IV', deg: 120 },
              { num: 'V', deg: 150 },
              { num: 'VI', deg: 180 },
              { num: 'VII', deg: 210 },
              { num: 'VIII', deg: 240 },
              { num: 'IX', deg: 270 },
              { num: 'X', deg: 300 },
              { num: 'XI', deg: 330 },
            ].map(({ num, deg }) => (
              <span
                key={num}
                className="absolute font-gothic text-xs font-bold text-amber-300/80"
                style={{
                  transform: `rotate(${deg}deg) translateY(-105px) rotate(-${deg}deg)`,
                }}
              >
                {num}
              </span>
            ))}

            {/* Hour hand */}
            <div
              className="absolute bottom-1/2 left-1/2 h-20 w-1.5 origin-bottom -translate-x-1/2 rounded-full bg-amber-400 shadow-md transition-transform duration-300"
              style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
            >
              <div className="absolute -top-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-amber-300" />
            </div>

            {/* Minute hand (only if placed) */}
            {placedMinuteHand ? (
              <div
                className="absolute bottom-1/2 left-1/2 h-28 w-1 origin-bottom -translate-x-1/2 rounded-full bg-amber-200/90 shadow-md transition-transform duration-300"
                style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
              >
                <div className="absolute -top-2.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-amber-100" />
              </div>
            ) : (
              <div className="absolute font-vintage text-xs text-amber-500/70">
                (Falta o ponteiro)
              </div>
            )}

            {/* Center brass pin */}
            <div className="absolute h-5 w-5 rounded-full border border-amber-600 bg-amber-400 shadow" />
          </div>

          {/* Current reading */}
          <div className="mt-4 font-gothic text-lg text-amber-300 tracking-wider">
            {hour.toString().padStart(2, '0')}:
            {placedMinuteHand ? minute.toString().padStart(2, '0') : '--'}
          </div>
        </div>

        {/* Hand Adjustment Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-neutral-900/60 p-2.5 border border-amber-950">
            <span className="font-vintage text-sm text-neutral-300">Ajustar Ponteiro das Horas:</span>
            <div className="flex gap-2">
              <button
                onClick={() => rotateHour('ccw')}
                className="rounded bg-neutral-800 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-neutral-700 transition-colors"
              >
                -1h
              </button>
              <button
                onClick={() => rotateHour('cw')}
                className="rounded bg-neutral-800 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-neutral-700 transition-colors"
              >
                +1h
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-neutral-900/60 p-2.5 border border-amber-950">
            <span className="font-vintage text-sm text-neutral-300">Ajustar Ponteiro dos Minutos:</span>
            <div className="flex gap-2">
              <button
                onClick={() => rotateMinute('ccw')}
                disabled={!placedMinuteHand}
                className="rounded bg-neutral-800 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-neutral-700 disabled:opacity-40 transition-colors"
              >
                -5 min
              </button>
              <button
                onClick={() => rotateMinute('cw')}
                disabled={!placedMinuteHand}
                className="rounded bg-neutral-800 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-neutral-700 disabled:opacity-40 transition-colors"
              >
                +5 min
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          {!placedMinuteHand && (
            <button
              onClick={handlePlaceHand}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-700/60 bg-amber-950/40 py-2.5 font-vintage text-sm text-amber-200 hover:bg-amber-900/60 transition-colors"
            >
              <Check size={16} />
              Encaixar Ponteiro de Bronze
            </button>
          )}

          <button
            onClick={handleVerify}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700/80 py-2.5 font-gothic text-sm font-bold text-amber-100 hover:bg-amber-600 transition-colors shadow-lg"
          >
            Destravar Pêndulo Mecânico
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="mt-3 rounded-lg border border-amber-900/40 bg-black/60 p-2.5 text-center font-vintage text-sm text-amber-300">
            {feedback}
          </div>
        )}

        {/* Clue helper */}
        <div className="mt-4 flex items-center gap-2 border-t border-amber-950/80 pt-3 text-xs text-neutral-400 font-vintage">
          <HelpCircle size={14} className="text-amber-500 shrink-0" />
          <span>
            Pista: Que hora estava marcada pelo vapor d'água na janela durante os relâmpagos?
          </span>
        </div>
      </div>
    </div>
  );
};
