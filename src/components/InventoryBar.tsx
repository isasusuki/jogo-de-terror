import React, { useState } from 'react';
import {
  Book,
  Eye,
  EyeOff,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { InventoryItem } from '../types/game';

interface InventoryBarProps {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  onSelectItem: (item: InventoryItem | null) => void;
  onInspectItem: (item: InventoryItem) => void;
  onCombineItems: (itemA: InventoryItem, itemB: InventoryItem) => void;
  isSpectralActive: boolean;
  onToggleSpectral: () => void;
  hasSpectralLens: boolean;
  onOpenJournal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const InventoryBar: React.FC<InventoryBarProps> = ({
  items,
  selectedItem,
  onSelectItem,
  onInspectItem,
  onCombineItems,
  isSpectralActive,
  onToggleSpectral,
  hasSpectralLens,
  onOpenJournal,
  isMuted,
  onToggleMute,
  isMinimized,
  onToggleMinimize,
}) => {
  const [isCompact, setIsCompact] = useState<boolean>(false);

  const handleSlotClick = (item: InventoryItem) => {
    if (!selectedItem) {
      onSelectItem(item);
    } else if (selectedItem.id === item.id) {
      onSelectItem(null); // deselect
    } else {
      // Attempt combination
      if (
        selectedItem.canCombineWith === item.id ||
        item.canCombineWith === selectedItem.id
      ) {
        onCombineItems(selectedItem, item);
      } else {
        // Change selection
        onSelectItem(item);
      }
    }
  };

  const getItemEmoji = (item: InventoryItem) => {
    if (item.id.includes('key')) return '🗝️';
    if (item.id.includes('music') || item.id.includes('sheet')) return '📜';
    if (item.id.includes('ring')) return '💍';
    if (item.id.includes('cloth')) return '🧣';
    if (item.id.includes('solvent')) return '🧪';
    if (item.id.includes('clock')) return '⏱️';
    if (item.id.includes('lens')) return '🔮';
    return '✨';
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
        isMinimized ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
    >
      {/* Floating Retract / Expand Tab */}
      <div className="flex justify-center pointer-events-none">
        <button
          onClick={onToggleMinimize}
          className="pointer-events-auto flex items-center gap-1.5 rounded-t-lg border-t border-x border-amber-800/70 bg-[#15101d] px-4 py-1 text-[11px] font-gothic font-bold text-amber-200 hover:bg-[#20182b] hover:text-amber-100 transition-colors shadow-2xl backdrop-blur-md"
          title={isMinimized ? 'Expandir barra de inventário' : 'Recolher/Ocultar barra de inventário'}
        >
          {isMinimized ? (
            <>
              <ChevronUp size={13} className="text-amber-400" />
              <span>Abrir Inventário ({items.length})</span>
            </>
          ) : (
            <>
              <ChevronDown size={13} className="text-amber-400" />
              <span>Ocultar Barra Inferior</span>
            </>
          )}
        </button>
      </div>

      {/* Main Inventory Panel */}
      <div
        className={`border-t border-amber-950/80 bg-gradient-to-t from-[#09070d] via-[#100d17] to-[#14101e] px-3 shadow-2xl backdrop-blur-md transition-all ${
          isCompact ? 'py-1.5' : 'py-2.5'
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 sm:gap-3">
          {/* Left Utilities: Journal & Spectral Vision */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenJournal}
              className={`flex items-center gap-1.5 rounded-lg border border-amber-900/60 bg-[#1c1524] text-xs font-gothic text-amber-200 hover:bg-amber-950 hover:border-amber-700 transition-all shadow ${
                isCompact ? 'px-2 py-1' : 'px-3 py-2'
              }`}
              title="Abrir Diário de Pistas"
            >
              <Book size={isCompact ? 14 : 16} className="text-amber-400" />
              <span className="hidden sm:inline">Diário</span>
            </button>

            {hasSpectralLens && (
              <button
                onClick={onToggleSpectral}
                className={`flex items-center gap-1.5 rounded-lg border text-xs font-gothic transition-all shadow ${
                  isCompact ? 'px-2 py-1' : 'px-3 py-2'
                } ${
                  isSpectralActive
                    ? 'border-purple-500 bg-purple-950/80 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
                    : 'border-neutral-800 bg-[#140e1f] text-neutral-300 hover:border-purple-800 hover:text-purple-300'
                }`}
                title="Lente de Vidência Oculta"
              >
                {isSpectralActive ? (
                  <Eye size={isCompact ? 14 : 16} />
                ) : (
                  <EyeOff size={isCompact ? 14 : 16} />
                )}
                <span className="hidden sm:inline">
                  {isSpectralActive ? 'Visão Espectral' : 'Lente Oculta'}
                </span>
              </button>
            )}
          </div>

          {/* Center: Inventory Slots */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 max-w-[50vw] sm:max-w-none">
            {items.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div key={item.id} className="relative group shrink-0">
                  <button
                    onClick={() => handleSlotClick(item)}
                    className={`relative flex items-center justify-center rounded-lg border transition-all shadow-md ${
                      isCompact ? 'h-9 w-9 text-lg' : 'h-11 w-11 text-xl sm:h-12 sm:w-12 sm:text-2xl'
                    } ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/90 shadow-[0_0_14px_rgba(245,158,11,0.5)] scale-105'
                        : 'border-amber-950/70 bg-[#191322] hover:border-amber-800 hover:bg-[#221a2e]'
                    }`}
                    title={item.name}
                  >
                    <span>{getItemEmoji(item)}</span>
                  </button>

                  {/* Inspect button overlay on hover/select */}
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectItem(item);
                      }}
                      className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-500 text-black shadow-md hover:bg-amber-400 transition-colors"
                      title="Examinar detalhes do item"
                    >
                      <Search size={9} strokeWidth={3} />
                    </button>
                  )}
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="font-vintage text-xs italic text-neutral-500 py-1 px-3">
                (Inventário vazio — examine a sala)
              </div>
            )}
          </div>

          {/* Right: Selected item indicator, Compact mode toggle & Audio */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {selectedItem && (
              <div className="hidden xl:flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-1 text-xs border border-amber-950">
                <Sparkles size={11} className="text-amber-400" />
                <span className="font-vintage text-amber-200 truncate max-w-[100px]">
                  {selectedItem.name}
                </span>
              </div>
            )}

            {/* Toggle Compact Slot Size */}
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-[#140e1d] text-neutral-400 hover:bg-neutral-800 hover:text-amber-200 transition-colors"
              title={isCompact ? 'Modo de Ícones Normais' : 'Modo Compacto (Diminuir Altura)'}
            >
              {isCompact ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            </button>

            <button
              onClick={onToggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-[#140e1d] text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              title={isMuted ? 'Desmutar Trilha e Sons' : 'Mutar Áudio'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
