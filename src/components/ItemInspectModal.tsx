import React from 'react';
import { X, Search } from 'lucide-react';
import { InventoryItem } from '../types/game';

interface ItemInspectModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export const ItemInspectModal: React.FC<ItemInspectModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-xl border border-amber-950/70 bg-[#120f18] p-6 shadow-2xl text-[#f3ede4]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-950/40 pb-3">
          <div className="flex items-center gap-2">
            <Search className="text-amber-400" size={18} />
            <h3 className="font-gothic text-base font-bold text-amber-200">
              Examinando Detalhes
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Item visual badge */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-amber-900/50 bg-gradient-to-b from-[#241a31] to-[#120c1a] shadow-inner text-4xl">
            {item.id.includes('key') ? '🗝️' :
             item.id.includes('music') || item.id.includes('sheet') ? '📜' :
             item.id.includes('ring') ? '💍' :
             item.id.includes('cloth') ? '🧣' :
             item.id.includes('solvent') ? '🧪' :
             item.id.includes('clock') ? '⏱️' :
             item.id.includes('lens') ? '🔮' : '✨'}
          </div>
          <div className="mt-3 font-gothic text-lg font-bold text-amber-100 text-center">
            {item.name}
          </div>
          <div className="font-vintage text-xs italic text-neutral-400 text-center mt-0.5">
            {item.description}
          </div>
        </div>

        {/* Inscription text */}
        <div className="rounded-lg border border-amber-950 bg-[#191322] p-4 text-center font-vintage text-sm leading-relaxed text-amber-200/90 shadow-inner">
          <p>{item.inspectText}</p>
          {item.canCombineWith && (
            <div className="mt-3 border-t border-amber-950 pt-2 text-xs text-amber-400/80 font-gothic">
              Pode ser combinado com outro item do inventário.
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-amber-800/80 py-2.5 font-gothic text-xs font-bold text-amber-100 hover:bg-amber-700 transition-colors shadow"
        >
          Guardar no Inventário
        </button>
      </div>
    </div>
  );
};
