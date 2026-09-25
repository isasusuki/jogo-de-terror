import React, { useState } from 'react';
import { X, Sparkles, HeartHandshake, Skull, BookOpen } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface CryptTombModalProps {
  hasWeddingRing: boolean;
  onEndingChosen: (ending: 'REDEMPTION' | 'DENIAL') => void;
  onClose: () => void;
}

export const CryptTombModal: React.FC<CryptTombModalProps> = ({
  hasWeddingRing,
  onEndingChosen,
  onClose,
}) => {
  const [placedRing, setPlacedRing] = useState(false);
  const [step, setStep] = useState<'inspect' | 'reveal' | 'choice'>('inspect');

  const handlePlaceRing = () => {
    if (!hasWeddingRing) return;
    setPlacedRing(true);
    audioEngine.playLockUnlock();
    audioEngine.playHeartbeat();

    window.setTimeout(() => {
      audioEngine.playPuzzleSolved();
      audioEngine.setTension(1);
      setStep('reveal');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg">
      <div className="relative w-full max-w-xl rounded-xl border border-amber-900/60 bg-[#120d18] p-6 shadow-2xl text-[#f3ede4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/40 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="text-amber-400" size={20} />
            <div>
              <h3 className="font-gothic text-xl font-bold tracking-wide text-amber-200">
                O Sarcófago Central dos Ravenwood
              </h3>
              <p className="font-vintage text-sm text-neutral-400">
                Mármore negro esculpido e protegido por selos de chumbo.
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

        {/* Content based on step */}
        {step === 'inspect' && (
          <div className="my-6 space-y-4">
            <div className="rounded-lg border border-amber-950/70 bg-[#1c1524] p-5 text-center font-vintage text-sm leading-relaxed text-neutral-300">
              <p>
                Sobre o mármore frio do caixão, há uma cavidade circular com uma inscrição em relevo:
              </p>
              <p className="mt-2 font-gothic text-xs tracking-widest text-amber-300 uppercase">
                "Aquele que jurou amar na vida e na morte deve devolver a aliança para que o selo da verdade se parta."
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {hasWeddingRing ? (
                <button
                  onClick={handlePlaceRing}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700/80 py-3 font-gothic text-sm font-bold text-amber-100 hover:bg-amber-600 transition-colors shadow-lg"
                >
                  <Sparkles size={16} />
                  Depositar a Aliança de Noivado no Selo
                </button>
              ) : (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 text-center font-vintage text-xs text-neutral-400">
                  Você precisa da aliança de ouro encontrada no compartimento do piano.
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'reveal' && (
          <div className="my-6 space-y-5 animate-fadeIn">
            {/* The Plot Twist Plaque */}
            <div className="rounded-lg border-2 border-amber-500/80 bg-gradient-to-b from-[#2a1c35] to-[#120a1c] p-6 text-center shadow-[0_0_30px_rgba(217,119,6,0.3)]">
              <div className="font-gothic text-xs tracking-widest text-amber-400 uppercase">
                A Inscrição de Bronze Polida
              </div>
              <div className="mt-3 font-gothic text-2xl font-black tracking-wider text-amber-100">
                AQUI DESCANSA EM PAZ
              </div>
              <div className="mt-1 font-gothic text-xl font-bold tracking-widest text-red-400">
                JULIAN RAVENWOOD
              </div>
              <div className="font-vintage text-sm text-neutral-400 mt-1">
                14 de Novembro de 1862 &nbsp;—&nbsp; 14 de Novembro de 1892
              </div>
              <div className="mt-3 font-vintage text-xs italic text-amber-200/90 border-t border-amber-900/50 pt-2">
                "O jovem noivo que sucumbiu na noite da tempestade para tentar salvar sua amada."
              </div>
            </div>

            {/* Twist dialogue */}
            <div className="rounded-lg border border-purple-900/50 bg-[#1d122b]/80 p-4 font-vintage text-sm leading-relaxed text-purple-200">
              <p className="font-gothic text-xs font-bold uppercase text-amber-300 mb-1">
                O Despertar da Memória:
              </p>
              <p>
                As memórias voltam como um raio atravessando sua alma:
                <strong className="text-white"> você não é um invasor tentando salvar uma noiva aprisionada... Você é Julian.</strong>
              </p>
              <p className="mt-2">
                Você morreu há mais de cem anos. Eleonora não foi assassinada por monstros; ela sobreviveu e passou o resto de sua longa vida velando sua memória nesta mesma mansão. O vulto feminino que chorava na janela era o espírito de Eleonora já idosa, esperando que sua alma finalmente aceitasse o descanso.
              </p>
            </div>

            <button
              onClick={() => setStep('choice')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-700/80 py-3 font-gothic text-sm font-bold text-amber-100 hover:bg-amber-600 transition-colors shadow-lg"
            >
              Enfrentar o Destino da Alma
            </button>
          </div>
        )}

        {step === 'choice' && (
          <div className="my-6 space-y-4">
            <div className="text-center">
              <h4 className="font-gothic text-lg font-bold text-amber-200">
                A Escolha de Julian
              </h4>
              <p className="font-vintage text-sm text-neutral-300 mt-1">
                O espírito translúcido de Eleonora estende a mão para você com lágrimas de alívio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => onEndingChosen('REDEMPTION')}
                className="group flex flex-col items-center rounded-xl border border-amber-500/50 bg-gradient-to-b from-[#241a33] to-[#120d1c] p-4 text-center hover:border-amber-400 hover:bg-[#2e2142] transition-all shadow-lg"
              >
                <HeartHandshake className="text-amber-400 group-hover:scale-110 transition-transform mb-2" size={28} />
                <span className="font-gothic text-sm font-bold text-amber-200">
                  Aceitar a Paz Eterna
                </span>
                <span className="font-vintage text-xs text-neutral-400 mt-1">
                  Segurar a mão de Eleonora e cruzar o portal juntos para a eternidade.
                </span>
              </button>

              <button
                onClick={() => onEndingChosen('DENIAL')}
                className="group flex flex-col items-center rounded-xl border border-neutral-700 bg-neutral-900/80 p-4 text-center hover:border-red-500/50 hover:bg-red-950/30 transition-all shadow-lg"
              >
                <Skull className="text-neutral-400 group-hover:text-red-400 group-hover:scale-110 transition-transform mb-2" size={28} />
                <span className="font-gothic text-sm font-bold text-neutral-300 group-hover:text-red-300">
                  Negar a Morte
                </span>
                <span className="font-vintage text-xs text-neutral-400 mt-1">
                  Rejeitar a verdade e tentar escapar pelo portão de ferro como mortal.
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
