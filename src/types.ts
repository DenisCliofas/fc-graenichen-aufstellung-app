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

export type PositionKey = string;

export type LineupStarters = Record<string, string | undefined>;

export type Lineup = {
  starters: LineupStarters;
  substitutes: string[];
  absent: string[];
  coaches: string[];
  captain?: string;
  opponent?: string;
  matchDate?: string;
  formationId?: string;
};

export type TeamSettings = {
  teamName: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  website?: string;
  language?: string;
  playerCount?: 7 | 9 | 11;
};

export const DEFAULT_SETTINGS: TeamSettings = {
  teamName: 'FC Gränichen',
  shortName: 'FCG',
  primaryColor: '#FFD400',
  secondaryColor: '#050505',
  language: 'de',
  playerCount: 11,
};

export type AppTab = 'trainers' | 'players' | 'lineup' | 'settings';
