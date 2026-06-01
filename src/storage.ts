import { Player, Trainer, Lineup, TeamSettings, DEFAULT_SETTINGS } from './types';
import { DEMO_PLAYERS, DEMO_TRAINERS } from './demoData';

const key = (teamSlug: string, name: string) => `fcg_${teamSlug}_${name}`;

export function savePlayers(teamSlug: string, players: Player[]): void {
  localStorage.setItem(key(teamSlug, 'players'), JSON.stringify(players));
}

export function loadPlayers(teamSlug: string): Player[] {
  const raw = localStorage.getItem(key(teamSlug, 'players'));
  if (!raw) return DEMO_PLAYERS;
  try {
    const parsed = JSON.parse(raw) as Player[];
    return parsed.length > 0 ? parsed : DEMO_PLAYERS;
  } catch {
    return DEMO_PLAYERS;
  }
}

export function saveTrainers(teamSlug: string, trainers: Trainer[]): void {
  localStorage.setItem(key(teamSlug, 'trainers'), JSON.stringify(trainers));
}

export function loadTrainers(teamSlug: string): Trainer[] {
  const raw = localStorage.getItem(key(teamSlug, 'trainers'));
  if (!raw) return DEMO_TRAINERS;
  try {
    const parsed = JSON.parse(raw) as Trainer[];
    return parsed.length > 0 ? parsed : DEMO_TRAINERS;
  } catch {
    return DEMO_TRAINERS;
  }
}

export function saveLineup(teamSlug: string, lineup: Lineup): void {
  localStorage.setItem(key(teamSlug, 'lineup'), JSON.stringify(lineup));
}

export function loadLineup(teamSlug: string, trainerIds: string[] = []): Lineup {
  const raw = localStorage.getItem(key(teamSlug, 'lineup'));
  if (!raw) return { starters: {}, substitutes: [], absent: [], coaches: trainerIds };
  try {
    const parsed = JSON.parse(raw) as Lineup;
    const hasValidCoach = parsed.coaches?.some(id => trainerIds.includes(id));
    if (!parsed.coaches || parsed.coaches.length === 0 || !hasValidCoach) {
      parsed.coaches = trainerIds;
    }
    return parsed;
  } catch {
    return { starters: {}, substitutes: [], absent: [], coaches: trainerIds };
  }
}

export function saveSettings(teamSlug: string, settings: TeamSettings): void {
  localStorage.setItem(key(teamSlug, 'settings'), JSON.stringify(settings));
}

export function loadSettings(teamSlug: string): TeamSettings {
  const raw = localStorage.getItem(key(teamSlug, 'settings'));
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
