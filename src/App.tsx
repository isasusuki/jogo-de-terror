/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_ITEMS,
  INITIAL_ROOMS,
  INITIAL_JOURNAL,
  GRAPHIC_SETS,
} from './data/gameData';
import {
  RoomId,
  Hotspot,
  InventoryItem,
  JournalNote,
} from './types/game';
import { audioEngine } from './services/audioEngine';
import { AtmosphereCanvas } from './components/AtmosphereCanvas';
import { RoomView } from './components/RoomView';
import { InventoryBar } from './components/InventoryBar';
import { ClockPuzzleModal } from './components/ClockPuzzleModal';
import { PianoPuzzleModal } from './components/PianoPuzzleModal';
import { JewelryBoxPuzzleModal } from './components/JewelryBoxPuzzleModal';
import { MirrorPsychologicalModal } from './components/MirrorPsychologicalModal';
import { CryptTombModal } from './components/CryptTombModal';
import { JournalModal } from './components/JournalModal';
import { ItemInspectModal } from './components/ItemInspectModal';
import { EndingCutscene } from './components/EndingCutscene';
import { Play, Sparkles, AlertCircle, Palette } from 'lucide-react';

export default function App() {
  // Graphic Style: 'animation' (Dark Dome 2D Animation) or 'classic'
  const [graphicStyle, setGraphicStyle] = useState<'animation' | 'classic'>('animation');

  // Game lifecycle states
  const [gameState, setGameState] = useState<'TITLE' | 'PLAYING' | 'ENDING'>('TITLE');
  const [endingType, setEndingType] = useState<'REDEMPTION' | 'DENIAL' | null>(null);

  // Navigation & Rooms
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>('living_room');
  const [rooms] = useState(INITIAL_ROOMS);

  // Lightning state
  const [lightningActive, setLightningActive] = useState<boolean>(false);

  // Inventory & Tracking
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inspectingItem, setInspectingItem] = useState<InventoryItem | null>(null);
  const [pickedItems, setPickedItems] = useState<Set<string>>(new Set());
  const [openedDrawers, setOpenedDrawers] = useState<Set<string>>(new Set());

  // Spectral Vision & Audio
  const [isSpectralActive, setIsSpectralActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isInventoryMinimized, setIsInventoryMinimized] = useState<boolean>(false);

  // Puzzle progression flags
  const [isClockUnlocked, setIsClockUnlocked] = useState<boolean>(false);
  const [isPianoSolved, setIsPianoSolved] = useState<boolean>(false);
  const [isMirrorCleaned, setIsMirrorCleaned] = useState<boolean>(false);
  const [isJewelrySolved, setIsJewelrySolved] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<
    'clock' | 'piano' | 'jewelry' | 'mirror' | 'crypt' | 'journal' | null
  >(null);

  // Journal notes
  const [journalNotes, setJournalNotes] = useState<JournalNote[]>(INITIAL_JOURNAL);

  // Subtitle / Feedback Toast
  const [dialogueText, setDialogueText] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<number | null>(null);

  const showToast = (text: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setDialogueText(text);
    const timer = window.setTimeout(() => {
      setDialogueText(null);
    }, 4500);
    setToastTimer(timer);
  };

  // Start game from title
  const handleStartGame = () => {
    audioEngine.ensureContext();
    audioEngine.startSoundtrack();
    audioEngine.playDoorCreak();
    setGameState('PLAYING');
    showToast('Você acorda com o som da chuva fustigando as janelas da Mansão Ravenwood...');
  };

  const handleRestartGame = () => {
    setGameState('PLAYING');
    setEndingType(null);
    setCurrentRoomId('living_room');
    setInventory([]);
    setSelectedItem(null);
    setInspectingItem(null);
    setPickedItems(new Set());
    setOpenedDrawers(new Set());
    setIsSpectralActive(false);
    setIsClockUnlocked(false);
    setIsPianoSolved(false);
    setIsMirrorCleaned(false);
    setIsJewelrySolved(false);
    setActiveModal(null);
    setJournalNotes(INITIAL_JOURNAL);
    audioEngine.setTension(1);
    audioEngine.startSoundtrack();
    showToast('O ciclo recomeça na sala de estar...');
  };

  const toggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Hotspot interaction logic
  const handleHotspotClick = (hotspot: Hotspot) => {
    audioEngine.ensureContext();

    // 1. Pickups
    if (hotspot.actionType === 'pickup' && hotspot.itemId) {
      const itemData = INITIAL_ITEMS[hotspot.itemId];
      if (itemData) {
        audioEngine.playItemPickup();
        setInventory((prev) => [...prev, itemData]);
        setPickedItems((prev) => new Set(prev).add(hotspot.itemId!));
        showToast(`Você recolheu: ${itemData.name}.`);

        // Add to journal if relevant
        if (hotspot.itemId.includes('sheet')) {
          addJournalEntry(
            'Partitura da Noiva',
            'Fragmento da melodia favorita de Eleonora para ser tocada no piano de cauda.'
          );
        }
      }
      return;
    }

    // 2. Navigation
    if (hotspot.actionType === 'navigate' && hotspot.targetRoom) {
      audioEngine.playDoorCreak();
      setCurrentRoomId(hotspot.targetRoom);
      return;
    }

    // 3. Item usage requirement (e.g., drawer locked with iron key)
    if (hotspot.actionType === 'use_item') {
      if (hotspot.id === 'music_drawer') {
        if (selectedItem?.id === 'iron_key') {
          audioEngine.playLockUnlock();
          setOpenedDrawers((prev) => new Set(prev).add(hotspot.id));
          setSelectedItem(null);
          showToast('Você girou a Chave de Ferro! A gaveta se abriu revelando a partitura e um frasco químico.');
        } else {
          showToast('A gaveta está emperrada por uma fechadura com brasão de lira. Precisa de uma chave.');
        }
        return;
      }
    }

    // 4. Puzzles
    if (hotspot.actionType === 'puzzle' && hotspot.targetPuzzle) {
      if (hotspot.targetPuzzle === 'clock') {
        setActiveModal('clock');
      } else if (hotspot.targetPuzzle === 'piano') {
        setActiveModal('piano');
      } else if (hotspot.targetPuzzle === 'jewelry_box') {
        setActiveModal('jewelry');
      } else if (hotspot.targetPuzzle === 'mirror') {
        setActiveModal('mirror');
      } else if (hotspot.targetPuzzle === 'crypt_tomb') {
        setActiveModal('crypt');
      }
      return;
    }

    // 5. Plain examine
    if (hotspot.description) {
      if (hotspot.id === 'arched_window') {
        audioEngine.playThunder();
      }
      showToast(hotspot.description);
    }
  };

  const handleDirectPickup = (itemId: string) => {
    const itemData = INITIAL_ITEMS[itemId];
    if (itemData) {
      audioEngine.playItemPickup();
      setInventory((prev) => [...prev, itemData]);
      setPickedItems((prev) => new Set(prev).add(itemId));
      showToast(`Você recolheu com sucesso: ${itemData.name}.`);

      if (itemId.includes('sheet')) {
        addJournalEntry(
          'Partitura da Noiva',
          'Fragmento da melodia favorita de Eleonora para ser tocada no piano de cauda.'
        );
      }
    }
  };

  const handleDirectUnlockDrawer = (drawerId: string) => {
    audioEngine.playLockUnlock();
    setOpenedDrawers((prev) => new Set(prev).add(drawerId));
    setSelectedItem(null);
    showToast('Você girou a Chave de Ferro! O armário se abriu revelando a partitura e o frasco de solvente.');
  };

  // Room navigation via directional arrows
  const handleNavigate = (targetRoomId: RoomId) => {
    // Check if bedroom is locked
    if (targetRoomId === 'bedroom' && currentRoomId === 'living_room') {
      const hasKey = inventory.some((i) => i.id === 'bride_bedroom_key');
      if (!hasKey) {
        showToast('A porta dos Aposentos da Noiva está trancada por uma fechadura de coração alado.');
        return;
      }
    }

    audioEngine.playDoorCreak();
    setCurrentRoomId(targetRoomId);
  };

  const addJournalEntry = (title: string, content: string) => {
    const newNote: JournalNote = {
      id: `note_${Date.now()}`,
      title,
      date: '1892',
      content,
      discoveredAt: rooms[currentRoomId]?.name || 'Mansão',
      category: 'pista',
    };
    setJournalNotes((prev) => [newNote, ...prev]);
  };

  // Item combination handler
  const handleCombineItems = (itemA: InventoryItem, itemB: InventoryItem) => {
    // 1. Combining sheet music halves
    if (
      (itemA.id === 'sheet_music_half_1' && itemB.id === 'sheet_music_half_2') ||
      (itemA.id === 'sheet_music_half_2' && itemB.id === 'sheet_music_half_1')
    ) {
      audioEngine.playPuzzleSolved();
      const combined = INITIAL_ITEMS.sheet_music_complete;
      setInventory((prev) =>
        prev
          .filter((i) => i.id !== 'sheet_music_half_1' && i.id !== 'sheet_music_half_2')
          .concat(combined)
      );
      setSelectedItem(combined);
      showToast('Você juntou as duas metades da partitura! A melodia revelada é: LÁ - FÁ - MI - SOL - DÓ.');
      addJournalEntry(
        'Melodia dos Amantes Restaurada',
        'Notas decifradas da dedicatória: LÁ, FÁ, MI, SOL, DÓ. Toque-as no piano de cauda.'
      );
      return;
    }

    // 2. Combining dusty cloth + solvent
    if (
      (itemA.id === 'dusty_cloth' && itemB.id === 'solvent_bottle') ||
      (itemA.id === 'solvent_bottle' && itemB.id === 'dusty_cloth')
    ) {
      audioEngine.playLockUnlock();
      const combined = INITIAL_ITEMS.moist_cloth;
      setInventory((prev) =>
        prev
          .filter((i) => i.id !== 'dusty_cloth' && i.id !== 'solvent_bottle')
          .concat(combined)
      );
      setSelectedItem(combined);
      showToast('Você embebeu o lenço com o solvente alquímico! Agora é possível limpar o espelho.');
      return;
    }

    showToast('Esses itens não parecem se encaixar.');
  };

  // Puzzle Solved Callbacks
  const handleClockSolved = () => {
    setIsClockUnlocked(true);
    setActiveModal(null);
    audioEngine.playClockChime();
    audioEngine.setTension(2);
    showToast('O relógio bateu 03:45! O painel da parede deslizou, revelando a passagem para a Cripta.');
    addJournalEntry(
      'A Hora da Queda: 03:45',
      'O relógio marcou a hora exata da morte. Uma passagem subterrânea se abriu atrás da lareira.'
    );
  };

  const handlePianoSolved = () => {
    setIsPianoSolved(true);
    // Award wedding ring and bedroom key
    const ring = INITIAL_ITEMS.wedding_ring;
    const key = INITIAL_ITEMS.bride_bedroom_key;
    setInventory((prev) => [...prev, ring, key]);
    showToast('O mecanismo do piano abriu! Você encontrou a Aliança de Noivado e a Chave de Coração Alado.');
    addJournalEntry(
      'Aliança com Rubi (1892)',
      'Gravada com: "Julian & Eleonora — Que nem mesmo a morte cale nosso amor". Destrancou os aposentos dela.'
    );
  };

  const handleJewelrySolved = () => {
    setIsJewelrySolved(true);
    const minuteHand = INITIAL_ITEMS.clock_minute_hand;
    const lens = INITIAL_ITEMS.spectral_lens;
    setInventory((prev) => [...prev, minuteHand, lens]);
    showToast('A caixa de joias abriu! Você recolheu o Ponteiro dos Minutos e a Lente de Vidência Oculta.');
    addJournalEntry(
      'Lente Espectral e Ponteiro',
      'A lente permite ver as almas e marcas ocultas nas paredes da mansão. O ponteiro servirá no relógio.'
    );
  };

  const handleMirrorCleaned = () => {
    setIsMirrorCleaned(true);
    showToast('O reflexo no espelho não possuía rosto... Ele sussurrou que o tempo parou às 03:45!');
    addJournalEntry(
      'O Reflexo Sem Rosto',
      'No espelho da noiva, minha própria silhueta apareceu decapitada de feições. A hora fatal foi 03:45.'
    );
  };

  const handleEndingChosen = (type: 'REDEMPTION' | 'DENIAL') => {
    setActiveModal(null);
    setEndingType(type);
    setGameState('ENDING');
    if (type === 'REDEMPTION') {
      audioEngine.setTension(1);
    } else {
      audioEngine.setTension(3);
    }
  };

  const hasSpectralLens = inventory.some((i) => i.id === 'spectral_lens');
  const hasMinuteHand = inventory.some((i) => i.id === 'clock_minute_hand');
  const hasCompleteSheet = inventory.some((i) => i.id === 'sheet_music_complete');
  const hasMoistCloth = inventory.some((i) => i.id === 'moist_cloth');
  const hasWeddingRing = inventory.some((i) => i.id === 'wedding_ring');

  const currentImages = GRAPHIC_SETS[graphicStyle];

  const handleLightning = () => {
    audioEngine.playThunder();
    setLightningActive(true);
    window.setTimeout(() => {
      setLightningActive(false);
    }, 1200);
  };

  const toggleGraphicStyle = () => {
    audioEngine.playLockUnlock();
    setGraphicStyle((prev) => (prev === 'animation' ? 'classic' : 'animation'));
    showToast(
      graphicStyle === 'animation'
        ? 'Estilo alterado para: Pintura Gótica Clássica'
        : 'Estilo alterado para: Animação Dark Dome 2D'
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#07060b] text-[#e8dfd5] font-ui select-none overflow-hidden">
      {/* Ambient Canvas (Dust particles, lightning, spectral glow) */}
      <AtmosphereCanvas
        isSpectralActive={isSpectralActive}
        onLightningTrigger={handleLightning}
      />

      {/* Top Bar Contract (Brand Zone - Nav/Context - Action) */}
      <header className="relative z-30 flex h-14 items-center justify-between border-b border-amber-950/60 bg-[#0d0914]/90 px-6 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <div className="font-gothic text-base font-bold tracking-wider text-amber-200">
          Mansão Ravenwood
        </div>

        {/* Zone 2: Clean unboxed metadata with typographic separators */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-vintage text-neutral-400">
          <span>{rooms[currentRoomId]?.name || 'Mansão'}</span>
          <span aria-hidden="true">·</span>
          <span>14 de Novembro de 1892</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-500/80">
            {isSpectralActive ? 'Visão do Além Ativa' : 'Tempestade'}
          </span>
        </div>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleGraphicStyle}
            className="flex items-center gap-1.5 rounded-lg border border-amber-950 bg-[#161020] px-3 py-1.5 font-gothic text-xs font-semibold text-amber-200 hover:bg-[#201830] transition-colors whitespace-nowrap"
            title="Alternar entre Animação 2D (Dark Dome) e Pintura Gótica"
          >
            <Palette size={14} className="text-amber-400" />
            <span className="hidden md:inline">
              {graphicStyle === 'animation' ? 'Estilo: Animação 2D' : 'Estilo: Pintura'}
            </span>
          </button>

          <button
            onClick={() => setActiveModal('journal')}
            className="rounded-lg border border-amber-950 bg-[#161020] px-3 py-1.5 font-gothic text-xs font-semibold text-amber-200 hover:bg-[#201830] transition-colors whitespace-nowrap"
          >
            Pistas ({journalNotes.length})
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="relative flex-1 flex flex-col items-center justify-center">
        {gameState === 'TITLE' && (
          <div className="relative z-30 flex max-w-xl flex-col items-center justify-center p-6 text-center animate-fadeIn">
            {/* Title Portrait Frame */}
            <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-amber-800/80 shadow-[0_0_40px_rgba(217,119,6,0.3)]">
              <img
                src={currentImages.portraitBride}
                alt="A Noiva da Janela"
                className="h-full w-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <h1 className="font-gothic text-4xl font-extrabold tracking-wide text-amber-100 text-balance">
              O Segredo da Mansão Ravenwood
            </h1>
            <p className="mt-3 font-vintage text-lg leading-relaxed text-amber-200/90 text-balance">
              Um conto de terror psicológico e romance esquecido. Desvende os enigmas do tempo, da música e do espelho para encarar a verdade que dorme nesta casa.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleStartGame}
                className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-8 py-3.5 font-gothic text-sm font-bold text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition-all"
              >
                <Play size={18} className="fill-black group-hover:translate-x-0.5 transition-transform" />
                Adentrar a Mansão
              </button>

              <button
                onClick={toggleGraphicStyle}
                className="flex items-center gap-2 rounded-xl border border-amber-900/60 bg-[#161020] px-5 py-3.5 font-gothic text-xs font-semibold text-amber-200 hover:bg-[#201830] transition-colors"
              >
                <Palette size={16} className="text-amber-400" />
                <span>{graphicStyle === 'animation' ? 'Modo: Animação 2D' : 'Modo: Pintura Clássica'}</span>
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-vintage text-neutral-400">
              <Sparkles size={14} className="text-amber-500" />
              <span>Jogabilidade e arte 2D inspiradas nos clássicos de mistério de Dark Dome.</span>
            </div>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <>
            <RoomView
              room={rooms[currentRoomId]}
              roomImage={currentImages[currentRoomId === 'living_room' ? 'livingRoom' : currentRoomId === 'music_room' ? 'musicRoom' : currentRoomId === 'bedroom' ? 'bedroom' : 'crypt']}
              onNavigate={handleNavigate}
              onHotspotClick={handleHotspotClick}
              selectedItem={selectedItem}
              isSpectralActive={isSpectralActive}
              unlockedCrypt={isClockUnlocked}
              pickedItems={pickedItems}
              openedDrawers={openedDrawers}
              lightningActive={lightningActive}
              onPickupItem={handleDirectPickup}
              onUnlockDrawer={handleDirectUnlockDrawer}
              inventory={inventory}
              isInventoryMinimized={isInventoryMinimized}
            />

            {/* Inventory Bottom Bar */}
            <InventoryBar
              items={inventory}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              onInspectItem={(item) => setInspectingItem(item)}
              onCombineItems={handleCombineItems}
              isSpectralActive={isSpectralActive}
              onToggleSpectral={() => {
                audioEngine.playLockUnlock();
                setIsSpectralActive(!isSpectralActive);
              }}
              hasSpectralLens={hasSpectralLens}
              onOpenJournal={() => setActiveModal('journal')}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              isMinimized={isInventoryMinimized}
              onToggleMinimize={() => setIsInventoryMinimized(!isInventoryMinimized)}
            />
          </>
        )}

        {/* Narrative / Feedback Toast */}
        {dialogueText && (
          <div className="fixed top-18 z-50 flex max-w-lg items-center gap-2.5 rounded-lg border border-amber-900/80 bg-[#120d1c]/95 px-4 py-2.5 text-center font-vintage text-sm leading-relaxed text-amber-200 shadow-2xl backdrop-blur-md animate-fadeIn">
            <AlertCircle size={16} className="text-amber-400 shrink-0" />
            <span>{dialogueText}</span>
          </div>
        )}
      </main>

      {/* Puzzle & Narrative Modals */}
      {activeModal === 'clock' && (
        <ClockPuzzleModal
          hasMinuteHand={hasMinuteHand}
          isClockUnlocked={isClockUnlocked}
          onSolve={handleClockSolved}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'piano' && (
        <PianoPuzzleModal
          hasCompleteSheet={hasCompleteSheet}
          isPianoSolved={isPianoSolved}
          onSolve={handlePianoSolved}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'jewelry' && (
        <JewelryBoxPuzzleModal
          isSolved={isJewelrySolved}
          onSolve={handleJewelrySolved}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'mirror' && (
        <MirrorPsychologicalModal
          hasMoistCloth={hasMoistCloth}
          isCleaned={isMirrorCleaned}
          onCleaned={handleMirrorCleaned}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'crypt' && (
        <CryptTombModal
          hasWeddingRing={hasWeddingRing}
          onEndingChosen={handleEndingChosen}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'journal' && (
        <JournalModal
          notes={journalNotes}
          onClose={() => setActiveModal(null)}
        />
      )}

      {inspectingItem && (
        <ItemInspectModal
          item={inspectingItem}
          onClose={() => setInspectingItem(null)}
        />
      )}

      {gameState === 'ENDING' && endingType && (
        <EndingCutscene
          endingType={endingType}
          portraitImage={currentImages.portraitBride}
          onRestart={handleRestartGame}
        />
      )}
    </div>
  );
}
