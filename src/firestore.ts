import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Player, Trainer, Lineup } from './types';

const COLLECTION = 'roster';

export function savePlayersToFirestore(players: Player[]): void {
  setDoc(doc(db, COLLECTION, 'players'), { data: players }).catch(console.error);
}

export function saveTrainersToFirestore(trainers: Trainer[]): void {
  setDoc(doc(db, COLLECTION, 'trainers'), { data: trainers }).catch(console.error);
}

export function saveLineupToFirestore(lineup: Lineup): void {
  setDoc(doc(db, COLLECTION, 'lineup'), { data: lineup }).catch(console.error);
}

export type RosterSnapshot = {
  players: Player[];
  trainers: Trainer[];
  lineup: Lineup | null;
};

export function subscribeToRoster(callback: (snapshot: RosterSnapshot) => void): () => void {
  let players: Player[] = [];
  let trainers: Trainer[] = [];
  let lineup: Lineup | null = null;
  let loaded = { players: false, trainers: false, lineup: false };

  function notify() {
    if (loaded.players && loaded.trainers && loaded.lineup) {
      callback({ players, trainers, lineup });
    }
  }

  const unsubPlayers = onSnapshot(doc(db, COLLECTION, 'players'), snap => {
    players = snap.exists() ? (snap.data().data as Player[]) : [];
    loaded.players = true;
    notify();
  });

  const unsubTrainers = onSnapshot(doc(db, COLLECTION, 'trainers'), snap => {
    trainers = snap.exists() ? (snap.data().data as Trainer[]) : [];
    loaded.trainers = true;
    notify();
  });

  const unsubLineup = onSnapshot(doc(db, COLLECTION, 'lineup'), snap => {
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
