import { Player, Trainer, Lineup } from './types';
import { DEMO_PLAYERS, DEMO_TRAINERS } from './demoData';

const PLAYERS_KEY = 'fcg_players';
const TRAINERS_KEY = 'fcg_trainers';
const LINEUP_KEY = 'fcg_lineup';

export function savePlayers(players: Player[]): void {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function loadPlayers(): Player[] {
  const raw = localStorage.getItem(PLAYERS_KEY);
  if (!raw) return DEMO_PLAYERS;
  try {
    const parsed = JSON.parse(raw) as Player[];
    return parsed.length > 0 ? parsed : DEMO_PLAYERS;
  } catch {
    return DEMO_PLAYERS;
  }
}

export function saveTrainers(trainers: Trainer[]): void {
  localStorage.setItem(TRAINERS_KEY, JSON.stringify(trainers));
}

export function loadTrainers(): Trainer[] {
  const raw = localStorage.getItem(TRAINERS_KEY);
  if (!raw) return DEMO_TRAINERS;
  try {
    const parsed = JSON.parse(raw) as Trainer[];
    return parsed.length > 0 ? parsed : DEMO_TRAINERS;
  } catch {
    return DEMO_TRAINERS;
  }
}

export function saveLineup(lineup: Lineup): void {
  localStorage.setItem(LINEUP_KEY, JSON.stringify(lineup));
}

export function loadLineup(trainerIds: string[] = []): Lineup {
  const raw = localStorage.getItem(LINEUP_KEY);
  if (!raw) return { starters: {}, substitutes: [], absent: [], coaches: trainerIds };
  try {
    const parsed = JSON.parse(raw) as Lineup;
    // Default to all trainers if coaches is empty OR contains stale non-ID values
    const hasValidCoach = parsed.coaches?.some(id => trainerIds.includes(id));
    if (!parsed.coaches || parsed.coaches.length === 0 || !hasValidCoach) {
      parsed.coaches = trainerIds;
    }
    return parsed;
  } catch {
    return { starters: {}, substitutes: [], absent: [], coaches: trainerIds };
  }
}
