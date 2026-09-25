import React from 'react';
import { RotateCcw, Heart, Ghost } from 'lucide-react';
import { IMAGES } from '../data/gameData';

interface EndingCutsceneProps {
  endingType: 'REDEMPTION' | 'DENIAL';
  portraitImage?: string;
  onRestart: () => void;
}

export const EndingCutscene: React.FC<EndingCutsceneProps> = ({ endingType, portraitImage, onRestart }) => {
  const brideImg = portraitImage || IMAGES.portraitBride;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-amber-900/60 bg-gradient-to-b from-[#181124] to-[#0a070f] p-8 text-center text-[#f3ede4] shadow-[0_0_60px_rgba(0,0,0,0.95)]">
        {endingType === 'REDEMPTION' ? (
          <div className="space-y-6">
            {/* Bride Portrait with Glow */}
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-amber-400/80 shadow-[0_0_35px_rgba(251,191,36,0.4)]">
              <img
                src={brideImg}
                alt="Eleonora em paz"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-amber-500/10 mix-blend-screen" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <Heart size={20} className="fill-amber-400/30" />
                <span className="font-gothic text-xs font-bold uppercase tracking-widest">
                  Final Verdadeiro — A Ascensão dos Amantes
                </span>
                <Heart size={20} className="fill-amber-400/30" />
              </div>
              <h2 className="font-gothic text-3xl font-extrabold tracking-wide text-amber-100">
                O Abraço na Eternidade
              </h2>
            </div>

            <div className="space-y-3 font-vintage text-base leading-relaxed text-amber-200/90 max-w-lg mx-auto">
              <p>
                Ao segurar a mão fria de Eleonora, o peso de cem anos de culpa e esquecimento finalmente se desvanece.
              </p>
              <p className="italic">
                "Você descansou no meu peito, Julian... Agora podemos caminhar sob a luz que nunca mais se apagará."
              </p>
              <p>
                As paredes de pedra da Mansão Ravenwood desfazem-se em cinzas de rosas e notas límpidas de piano. Você não fugiu da morte — você a transformou em reencontro.
              </p>
            </div>

            <div className="pt-4 border-t border-amber-950/60">
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-gothic text-sm font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
              >
                <RotateCcw size={16} />
                Jogar Novamente
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-red-900 bg-red-950/40 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              <Ghost size={54} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="font-gothic text-xs font-bold uppercase tracking-widest text-red-400">
                Final Trágico — O Ciclo da Negação
              </span>
              <h2 className="font-gothic text-3xl font-extrabold tracking-wide text-neutral-100">
                Prisioneiro do Próprio Luto
              </h2>
            </div>

            <div className="space-y-3 font-vintage text-base leading-relaxed text-neutral-300 max-w-lg mx-auto">
              <p>
                Você corre desesperadamente até as grades de ferro do portão, forçando as correntes frias com mãos que já não têm carne.
              </p>
              <p className="italic text-red-300/80">
                O relógio distante soa três badaladas roucas: 03:45.
              </p>
              <p>
                A escuridão engole sua visão. A chuva retorna com força violenta sobre o telhado... E você desperta mais uma vez no chão da sala de estar, sem lembrar o próprio nome.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <button
                onClick={onRestart}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-800 px-6 py-3 font-gothic text-sm font-bold text-neutral-200 hover:bg-neutral-700 transition-colors shadow-lg"
              >
                <RotateCcw size={16} />
                Reiniciar o Ciclo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
