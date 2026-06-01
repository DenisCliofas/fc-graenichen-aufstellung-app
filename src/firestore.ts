import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { db } from './firebase';
import { Player, Trainer, Lineup, TeamSettings } from './types';

function rosterDoc(teamSlug: string, docId: string) {
  return doc(collection(doc(db, 'teams', teamSlug), 'roster'), docId);
}

// Firestore rejects `undefined` — strip it recursively before saving
function stripUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function savePlayersToFirestore(teamSlug: string, players: Player[]): void {
  setDoc(rosterDoc(teamSlug, 'players'), { data: stripUndefined(players) }).catch(console.error);
}

export function saveTrainersToFirestore(teamSlug: string, trainers: Trainer[]): void {
  setDoc(rosterDoc(teamSlug, 'trainers'), { data: stripUndefined(trainers) }).catch(console.error);
}

export function saveLineupToFirestore(teamSlug: string, lineup: Lineup): void {
  setDoc(rosterDoc(teamSlug, 'lineup'), { data: stripUndefined(lineup) }).catch(console.error);
}

export function saveSettingsToFirestore(teamSlug: string, settings: TeamSettings): void {
  setDoc(rosterDoc(teamSlug, 'settings'), { data: stripUndefined(settings) }).catch(console.error);
}

export type RosterSnapshot = {
  players: Player[];
  trainers: Trainer[];
  lineup: Lineup | null;
};

export function subscribeToRoster(teamSlug: string, callback: (snapshot: RosterSnapshot) => void): () => void {
  let players: Player[] = [];
  let trainers: Trainer[] = [];
  let lineup: Lineup | null = null;
  let loaded = { players: false, trainers: false, lineup: false };

  function notify() {
    if (loaded.players && loaded.trainers && loaded.lineup) {
      callback({ players, trainers, lineup });
    }
  }

  const unsubPlayers = onSnapshot(rosterDoc(teamSlug, 'players'), snap => {
    players = snap.exists() ? (snap.data().data as Player[]) : [];
    loaded.players = true;
    notify();
  });

  const unsubTrainers = onSnapshot(rosterDoc(teamSlug, 'trainers'), snap => {
    trainers = snap.exists() ? (snap.data().data as Trainer[]) : [];
    loaded.trainers = true;
    notify();
  });

  const unsubLineup = onSnapshot(rosterDoc(teamSlug, 'lineup'), snap => {
    lineup = snap.exists() ? (snap.data().data as Lineup) : null;
    loaded.lineup = true;
    notify();
  });

  return () => {
    unsubPlayers();
    unsubTrainers();
    unsubLineup();
  };
}

export function subscribeToSettings(teamSlug: string, callback: (settings: TeamSettings) => void): () => void {
  return onSnapshot(rosterDoc(teamSlug, 'settings'), snap => {
    if (snap.exists()) callback(snap.data().data as TeamSettings);
  });
}
