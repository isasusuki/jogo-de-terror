export type RoomId = 'living_room' | 'music_room' | 'bedroom' | 'crypt';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  inspectText: string;
  icon: string; // Lucide icon name or emoji representation
  canCombineWith?: string;
  combinesInto?: string;
  combineResultName?: string;
}

export interface Hotspot {
  id: string;
  title: string;
  description?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  requiresItem?: string;
  actionType: 'examine' | 'pickup' | 'puzzle' | 'navigate' | 'use_item';
  targetRoom?: RoomId;
  targetPuzzle?: 'clock' | 'piano' | 'jewelry_box' | 'mirror' | 'crypt_tomb' | 'gramophone';
  itemId?: string;
  conditionMet?: boolean;
  spectralOnly?: boolean;
}

export interface RoomData {
  id: RoomId;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  hotspots: Hotspot[];
  connectedRooms: {
    left?: RoomId;
    right?: RoomId;
    forward?: RoomId;
    back?: RoomId;
  };
}

export interface JournalNote {
  id: string;
  title: string;
  date: string;
  content: string;
  discoveredAt: string;
  category: 'memoria' | 'pista' | 'poema';
}

export type GameStage = 
  | 'INTRO'
  | 'EXPLORING'
  | 'CLOCK_UNLOCKED'
  | 'PIANO_SOLVED'
  | 'MIRROR_CLEANED'
  | 'JEWELRY_SOLVED'
  | 'CRYPT_REVEALED'
  | 'PLOT_TWIST_REVEALED'
  | 'ENDING_REDEMPTION'
  | 'ENDING_DENIAL';
