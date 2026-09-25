import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Eye,
  Key,
  Compass,
  X,
  Search,
} from 'lucide-react';
import { RoomData, Hotspot, InventoryItem, RoomId } from '../types/game';
import { audioEngine } from '../services/audioEngine';

interface RoomViewProps {
  room: RoomData;
  roomImage: string;
  onNavigate: (roomId: RoomId) => void;
  onHotspotClick: (hotspot: Hotspot) => void;
  selectedItem: InventoryItem | null;
  isSpectralActive: boolean;
  unlockedCrypt: boolean;
  pickedItems: Set<string>;
  openedDrawers: Set<string>;
  lightningActive?: boolean;
  onPickupItem: (itemId: string) => void;
  onUnlockDrawer: (drawerId: string) => void;
  inventory: InventoryItem[];
  isInventoryMinimized?: boolean;
}

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  roomImage,
  onNavigate,
  onHotspotClick,
  selectedItem,
  isSpectralActive,
  unlockedCrypt,
  pickedItems,
  openedDrawers,
  lightningActive,
  onPickupItem,
  onUnlockDrawer,
  inventory,
  isInventoryMinimized = false,
}) => {
  // Precision state: highlight all interactive spots
  const [showPrecisionHints, setShowPrecisionHints] = useState<boolean>(true);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [focusedHotspot, setFocusedHotspot] = useState<Hotspot | null>(null);

  // Precision click ripple effect on entire room canvas
  const handleViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    audioEngine.playTapSound();

    const newRipple: ClickRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setRipples((prev) => [...prev.slice(-4), newRipple]);

    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 700);
  };

  const handleSelectHotspot = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playTapSound();
    setFocusedHotspot(hotspot);
    onHotspotClick(hotspot);
  };

  const hasIronKey = inventory.some((i) => i.id === 'iron_key');
  const isMusicDrawerUnlocked = openedDrawers.has('music_drawer');

  return (
    <div
      className={`relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center p-1 sm:p-3 transition-all duration-300 ${
        isInventoryMinimized ? 'h-[calc(100vh-60px)]' : 'h-[calc(100vh-95px)]'
      }`}
    >
      {/* Viewport Frame with Dark Dome Vintage Border */}
      <div
        onClick={handleViewportClick}
        className="relative aspect-[16/9] w-full max-h-full overflow-hidden rounded-xl border-2 border-amber-950/70 bg-black shadow-[0_0_50px_rgba(0,0,0,0.9)] cursor-crosshair select-none"
      >
        {/* Room Background Image */}
        <img
          src={roomImage}
          alt={room.name}
          className={`h-full w-full object-cover transition-all duration-700 pointer-events-none ${
            isSpectralActive ? 'brightness-90 contrast-125 saturate-50 hue-rotate-15' : ''
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Dynamic In-Game Animated Elements (Dark Dome 2D Animation Style) */}
        {room.id === 'living_room' && (
          <>
            {/* Animated Brass Clock Pendulum */}
            <div
              className="pointer-events-none absolute left-[23.2%] top-[56%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-pendulum opacity-80"
              style={{ transformOrigin: 'top center' }}
            >
              <div className="h-10 w-0.5 bg-amber-400/90" />
              <div className="h-4 w-4 rounded-full border border-amber-600 bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </div>

            {/* Animated Fireplace Embers */}
            <div className="pointer-events-none absolute left-[55%] top-[70%] -translate-x-1/2 -translate-y-1/2 flex gap-1 animate-flame">
              <div className="h-5 w-4 rounded-t-full bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300 opacity-75 blur-[1px]" />
              <div className="h-6 w-3 rounded-t-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-200 opacity-80 blur-[0.5px]" />
              <div className="h-4 w-3 rounded-t-full bg-gradient-to-t from-amber-600 via-yellow-400 to-white opacity-85" />
            </div>
          </>
        )}

        {room.id === 'music_room' && (
          <>
            {/* Animated Candelabra Flames */}
            <div className="pointer-events-none absolute left-[22%] top-[48%] -translate-x-1/2 -translate-y-1/2 flex gap-2 animate-candle">
              <div className="h-3 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              <div className="h-3 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              <div className="h-3.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
            </div>

            {/* Eerie Ghost Silhouette at Window during lightning or spectral mode */}
            {(lightningActive || isSpectralActive) && (
              <div className="pointer-events-none absolute left-[75%] top-[28%] -translate-x-1/2 -translate-y-1/2 animate-ghostly transition-opacity duration-300">
                <div className="relative flex flex-col items-center">
                  <div className="h-14 w-10 rounded-t-full bg-black/75 border border-purple-400/40 blur-[1px] shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
                  <div className="h-16 w-14 rounded-b-2xl bg-black/60 blur-[1px]" />
                </div>
              </div>
            )}
          </>
        )}

        {room.id === 'bedroom' && isSpectralActive && (
          <div className="pointer-events-none absolute left-[72%] top-[45%] -translate-x-1/2 -translate-y-1/2 animate-ghostly">
            <div className="rounded-full bg-purple-500/20 p-6 blur-md shadow-[0_0_30px_rgba(168,85,247,0.6)]" />
          </div>
        )}

        {/* Spectral Vision Tint Overlay */}
        {isSpectralActive && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-purple-900/25 mix-blend-color-dodge transition-opacity duration-500" />
        )}

        {/* Ambient Dark Gothic Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.75)_95%)]" />

        {/* Click Feedback Ripples */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            style={{ left: ripple.x, top: ripple.y }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ping"
          >
            <div className="h-7 w-7 rounded-full border border-amber-400/90 bg-amber-300/25" />
          </div>
        ))}

        {/* Interactive Hotspots with High-Precision Bounds */}
        {room.hotspots.map((hotspot) => {
          // If spectral only and spectral mode is inactive, hide
          if (hotspot.spectralOnly && !isSpectralActive) {
            return null;
          }

          // Special condition: crypt passage only visible if unlocked
          if (hotspot.id === 'crypt_passage' && !unlockedCrypt) {
            return null;
          }

          // If pickup is already collected
          if (hotspot.actionType === 'pickup' && hotspot.itemId && pickedItems.has(hotspot.itemId)) {
            return null;
          }

          const isFocused = focusedHotspot?.id === hotspot.id;

          return (
            <button
              key={hotspot.id}
              onClick={(e) => handleSelectHotspot(hotspot, e)}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-lg cursor-pointer transition-all duration-200 focus:outline-none z-20 ${
                isFocused
                  ? 'ring-2 ring-amber-400 bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                  : showPrecisionHints
                  ? hotspot.spectralOnly
                    ? 'border-2 border-purple-400/70 bg-purple-900/25 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'border border-amber-400/40 bg-amber-950/15 hover:border-amber-300 hover:bg-amber-400/20'
                  : 'hover:border hover:border-amber-400/60 hover:bg-amber-400/10'
              }`}
              title={hotspot.title}
            >
              {/* Visible Target Reticle when precision hints are active */}
              {showPrecisionHints && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-gothic font-bold shadow-lg transition-transform group-hover:scale-105 ${
                      hotspot.spectralOnly
                        ? 'border border-purple-400 bg-purple-950/90 text-purple-200'
                        : 'border border-amber-500/80 bg-black/85 text-amber-300'
                    }`}
                  >
                    <Search size={10} className="shrink-0" />
                    <span className="truncate max-w-[120px]">{hotspot.title}</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {/* Focused Object Action Drawer (Dark Dome Inspection Bar) */}
        {focusedHotspot && (
          <div className="absolute bottom-14 left-3 right-3 sm:left-12 sm:right-12 z-30 flex items-center justify-between rounded-xl border-2 border-amber-700/80 bg-[#120d1c]/95 p-3 shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <h4 className="font-gothic text-sm font-bold tracking-wide text-amber-200">
                  {focusedHotspot.title}
                </h4>
              </div>
              <p className="font-vintage text-xs text-neutral-300 mt-1 line-clamp-2">
                {focusedHotspot.description}
              </p>
            </div>

            {/* Contextual Precise Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Fireplace key pickup */}
              {focusedHotspot.id === 'fireplace' && !pickedItems.has('iron_key') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPickupItem('iron_key');
                    setFocusedHotspot(null);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                >
                  <Key size={14} />
                  Pegar Chave de Ferro
                </button>
              )}

              {/* Music drawer unlock or item pickups */}
              {focusedHotspot.id === 'music_drawer' && (
                <>
                  {!isMusicDrawerUnlocked ? (
                    hasIronKey ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnlockDrawer('music_drawer');
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                      >
                        <Key size={14} />
                        Destrancar com Chave de Ferro
                      </button>
                    ) : (
                      <span className="font-vintage text-xs text-amber-400/90 italic">
                        (Trancado com fechadura de lira)
                      </span>
                    )
                  ) : (
                    <div className="flex gap-2">
                      {!pickedItems.has('sheet_music_half_2') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPickupItem('sheet_music_half_2');
                          }}
                          className="rounded-lg bg-amber-700 px-3 py-1.5 font-gothic text-xs font-bold text-amber-100 hover:bg-amber-600 transition-colors"
                        >
                          📜 Pegar Partitura (Direita)
                        </button>
                      )}
                      {!pickedItems.has('solvent_bottle') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPickupItem('solvent_bottle');
                          }}
                          className="rounded-lg bg-amber-700 px-3 py-1.5 font-gothic text-xs font-bold text-amber-100 hover:bg-amber-600 transition-colors"
                        >
                          🧪 Pegar Solvente
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Canopy Bed dusty cloth pickup */}
              {focusedHotspot.id === 'canopy_bed' && !pickedItems.has('dusty_cloth') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPickupItem('dusty_cloth');
                    setFocusedHotspot(null);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                >
                  <Sparkles size={14} />
                  Recolher Lenço de Seda
                </button>
              )}

              {/* Piano Puzzle Trigger */}
              {focusedHotspot.id === 'grand_piano' && (
                <button
                  onClick={() => onHotspotClick(focusedHotspot)}
                  className="rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                >
                  🎹 Sentar e Tocar Piano
                </button>
              )}

              {/* Grandfather Clock Trigger */}
              {focusedHotspot.id === 'grandfather_clock' && (
                <button
                  onClick={() => onHotspotClick(focusedHotspot)}
                  className="rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                >
                  ⏱️ Ajustar Mostrador do Relógio
                </button>
              )}

              {/* Vanity Mirror Trigger */}
              {focusedHotspot.id === 'vanity_mirror' && (
                <button
                  onClick={() => onHotspotClick(focusedHotspot)}
                  className="rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                >
                  🪞 Olhar no Espelho
                </button>
              )}

              {/* Jewelry Box Trigger */}
              {focusedHotspot.id === 'jewelry_box' && (
                <button
                  onClick={() => onHotspotClick(focusedHotspot)}
                  className="rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                >
                  🔐 Manipular Travas da Caixa
                </button>
              )}

              {/* Crypt Altar Trigger */}
              {focusedHotspot.id === 'crypt_altar' && (
                <button
                  onClick={() => onHotspotClick(focusedHotspot)}
                  className="rounded-lg bg-amber-600 px-3.5 py-2 font-gothic text-xs font-bold text-black hover:bg-amber-500 transition-colors shadow-lg"
                >
                  ⚰️ Examinar Sarcófago Central
                </button>
              )}

              {/* Close Drawer Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusedHotspot(null);
                }}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                title="Fechar detalhes"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Arrows (Dark Dome style) */}
        {room.connectedRooms.left && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(room.connectedRooms.left!);
            }}
            className="group absolute left-3 top-1/2 -translate-y-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-3 text-amber-200 backdrop-blur-sm hover:border-amber-500 hover:bg-black hover:text-amber-100 transition-all shadow-xl"
            title="Ir para a esquerda"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {room.connectedRooms.right && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(room.connectedRooms.right!);
            }}
            className="group absolute right-3 top-1/2 -translate-y-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-3 text-amber-200 backdrop-blur-sm hover:border-amber-500 hover:bg-black hover:text-amber-100 transition-all shadow-xl"
            title="Ir para a direita"
          >
            <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {room.connectedRooms.forward && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(room.connectedRooms.forward!);
            }}
            className="group absolute top-3 left-1/2 -translate-x-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-2.5 text-amber-200 backdrop-blur-sm hover:border-amber-500 hover:bg-black hover:text-amber-100 transition-all shadow-xl"
            title="Avançar pelo corredor"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {room.connectedRooms.back && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(room.connectedRooms.back!);
            }}
            className="group absolute bottom-3 left-1/2 -translate-x-1/2 z-30 rounded-full border border-amber-900/60 bg-black/75 p-2.5 text-amber-200 backdrop-blur-sm hover:border-amber-500 hover:bg-black hover:text-amber-100 transition-all shadow-xl"
            title="Retornar ao aposento anterior"
          >
            <ChevronDown size={24} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Current Room Title Overlay & Precision Toggle Button */}
        <div className="pointer-events-none absolute top-3 left-4 flex flex-col z-30">
          <div className="font-gothic text-base sm:text-lg font-bold tracking-wider text-amber-100 drop-shadow-md">
            {room.name}
          </div>
          <div className="font-vintage text-xs text-amber-300/80 drop-shadow">
            {room.subtitle}
          </div>
        </div>

        {/* Precision Hints Toggle (Right Top Corner) */}
        <div className="absolute top-3 right-4 z-30 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPrecisionHints(!showPrecisionHints);
            }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-gothic transition-all shadow-lg ${
              showPrecisionHints
                ? 'border-amber-500/80 bg-amber-950/90 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'border-neutral-800 bg-black/70 text-neutral-400 hover:text-amber-200'
            }`}
            title="Alternar realce de precisão em todos os objetos interagíveis"
          >
            <Compass size={14} className={showPrecisionHints ? 'text-amber-400' : ''} />
            <span className="hidden sm:inline">
              {showPrecisionHints ? 'Modo Precisão (ON)' : 'Revelar Objetos'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
