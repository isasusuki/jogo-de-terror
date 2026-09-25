import React, { useState } from 'react';
import { X, Music2, RotateCcw, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface PianoPuzzleModalProps {
  hasCompleteSheet: boolean;
  isPianoSolved: boolean;
  onSolve: () => void;
  onClose: () => void;
}

interface PianoKey {
  note: string;
  label: string;
  isBlack?: boolean;
}

export const PianoPuzzleModal: React.FC<PianoPuzzleModalProps> = ({
  hasCompleteSheet,
  isPianoSolved,
  onSolve,
  onClose,
}) => {
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(isPianoSolved);

  // Target melody: LA - FA - MI - SOL - DO (A4, F4, E4, G4, C4)
  const TARGET_SEQUENCE = ['A4', 'F4', 'E4', 'G4', 'C4'];

  const keys: PianoKey[] = [
    { note: 'C4', label: 'DÓ' },
    { note: 'D4', label: 'RÉ' },
    { note: 'E4', label: 'MI' },
    { note: 'F4', label: 'FÁ' },
    { note: 'G4', label: 'SOL' },
    { note: 'A4', label: 'LÁ' },
    { note: 'B4', label: 'SI' },
    { note: 'C5', label: 'DÓ+' },
  ];

  const handleKeyPress = (note: string) => {
    audioEngine.playPianoNote(note, 2.0, 0.85);

    if (isUnlocked) return;

    const newPlayed = [...playedNotes, note];
    setPlayedNotes(newPlayed);

    // Check if the current tail matches the target sequence
    const tail = newPlayed.slice(-TARGET_SEQUENCE.length);
    if (tail.length === TARGET_SEQUENCE.length) {
      const isMatch = tail.every((n, i) => n === TARGET_SEQUENCE[i]);
      if (isMatch) {
        setIsUnlocked(true);
        audioEngine.playPuzzleSolved();
        setFeedback('Uma harmonia etérea vibra na madeira antiga... O compartimento secreto da tampa se abriu!');
        window.setTimeout(() => {
          onSolve();
        }, 1800);
      } else if (newPlayed.length >= 8) {
        setFeedback('A melodia soou dissonante. Tente novamente.');
      }
    }
  };

  const resetSequence = () => {
    setPlayedNotes([]);
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-xl border border-amber-950/60 bg-[#110e17] p-6 shadow-2xl text-[#f3ede4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/40 pb-3">
          <div className="flex items-center gap-2">
            <Music2 className="text-amber-400" size={22} />
            <div>
              <h3 className="font-gothic text-xl font-bold tracking-wide text-amber-200">
                Piano de Cauda Imperial
              </h3>
              <p className="font-vintage text-sm text-neutral-400">
                Madeira de jacarandá entalhada com motivos fúnebres e marfim envelhecido.
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

        {/* Sheet Music Parchment Display */}
        <div className="my-5 rounded-lg border border-amber-900/50 bg-[#1c1613] p-4 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="font-gothic text-xs uppercase tracking-widest text-amber-400/80">
              {hasCompleteSheet ? 'Partitura Restaurada: Valsa da Chuva' : 'Partitura Rasgada'}
            </span>
            <span className="font-vintage text-xs italic text-neutral-400">
              "Para meu doce Julian, onde quer que tua alma repouse..."
            </span>
          </div>

          <div className="mt-3 flex items-center justify-center rounded border border-amber-950/70 bg-[#251e18] p-3 text-center">
            {hasCompleteSheet ? (
              <div className="space-y-1">
                <div className="font-gothic text-lg font-bold tracking-widest text-amber-300">
                  LÁ &nbsp;—&nbsp; FÁ &nbsp;—&nbsp; MI &nbsp;—&nbsp; SOL &nbsp;—&nbsp; DÓ
                </div>
                <div className="font-vintage text-xs text-neutral-400">
                  (Notas da pauta manuscrita em tinta roxa esmaecida)
                </div>
              </div>
            ) : (
              <div className="font-vintage text-sm text-amber-500/80">
                "Faltam compassos nesta folha rasgada... Procure a outra metade na sala."
              </div>
            )}
          </div>
        </div>

        {/* Current Played Notes Tracker */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-black/40 px-3 py-2 text-xs">
          <div className="flex items-center gap-1.5 font-vintage text-neutral-300">
            <span>Sequência atual:</span>
            {playedNotes.length === 0 ? (
              <span className="italic text-neutral-500">(Toque nas teclas abaixo)</span>
            ) : (
              <div className="flex gap-1.5">
                {playedNotes.slice(-6).map((n, i) => (
                  <span
                    key={i}
                    className="rounded bg-amber-950/80 px-2 py-0.5 font-gothic font-bold text-amber-300"
                  >
                    {keys.find((k) => k.note === n)?.label || n}
                  </span>
                ))}
              </div>
            )}
          </div>
          {playedNotes.length > 0 && !isUnlocked && (
            <button
              onClick={resetSequence}
              className="flex items-center gap-1 text-neutral-400 hover:text-amber-300 transition-colors"
            >
              <RotateCcw size={12} />
              Limpar
            </button>
          )}
        </div>

        {/* Interactive Piano Keys */}
        <div className="relative mx-auto flex h-48 w-full max-w-xl select-none justify-center rounded-b-lg border-b-4 border-amber-950 bg-black p-2 shadow-2xl">
          {keys.map((key) => {
            const isPlayed = playedNotes[playedNotes.length - 1] === key.note;
            return (
              <button
                key={key.note}
                onClick={() => handleKeyPress(key.note)}
                className={`group relative flex flex-1 flex-col justify-end rounded-b-md border border-neutral-700 pb-3 transition-all active:scale-[0.98] ${
                  isPlayed
                    ? 'bg-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                    : 'bg-gradient-to-b from-[#f9f7f1] to-[#e4ded0] hover:bg-[#fffae8]'
                }`}
              >
                <div className="text-center font-gothic text-xs font-bold text-neutral-800 transition-colors group-hover:text-amber-900">
                  {key.label}
                </div>
                <div className="text-center font-vintage text-[10px] text-neutral-500">
                  {key.note}
                </div>
              </button>
            );
          })}
        </div>

        {/* Status / Compartment Reveal */}
        {feedback && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-amber-900/60 bg-amber-950/40 p-3 text-center font-vintage text-sm text-amber-200">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {isUnlocked && (
          <div className="mt-4 rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-3 text-center">
            <div className="font-gothic text-sm font-bold text-emerald-300">
              Compartimento Secreto Aberto!
            </div>
            <p className="mt-1 font-vintage text-xs text-emerald-200">
              Você recolheu a <strong className="text-white">Chave de Coração Alado</strong> e a <strong className="text-white">Aliança de Noivado Antiga</strong> de Julian e Eleonora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
