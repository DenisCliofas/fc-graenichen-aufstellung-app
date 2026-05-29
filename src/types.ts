export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  photoUrl?: string;
  notes?: string;
};

export type Trainer = {
  id: string;
  firstName: string;
  lastName: string;
  role?: string;
  photoUrl?: string;
  notes?: string;
};

export type LineupStarters = {
  goalkeeper?: string;
  leftDefense?: string;
  centerDefense?: string;
  rightDefense?: string;
  leftWing?: string;
  striker?: string;
  rightWing?: string;
};

export type Lineup = {
  starters: LineupStarters;
  substitutes: string[];
  absent: string[];
  coaches: string[];
  opponent?: string;
  matchDate?: string; // ISO date string YYYY-MM-DD
};

export type AppTab = 'trainers' | 'players' | 'lineup' | 'presentation';

export type PositionKey = keyof LineupStarters;

export const POSITION_LABELS: Record<PositionKey, string> = {
  goalkeeper: 'Tor',
  leftDefense: 'Verteidiger links',
  centerDefense: 'Libero',
  rightDefense: 'Verteidiger rechts',
  leftWing: 'Mittelfeld links',
  striker: 'Mittelfeld',
  rightWing: 'Mittelfeld rechts',
};

export const POSITION_SHORT: Record<PositionKey, string> = {
  goalkeeper: 'TOR',
  leftDefense: 'VL',
  centerDefense: 'LIB',
  rightDefense: 'VR',
  leftWing: 'ML',
  striker: 'MF',
  rightWing: 'MR',
};
