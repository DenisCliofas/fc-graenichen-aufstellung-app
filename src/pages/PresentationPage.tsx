import { useState, useEffect } from 'react';
import { subscribeToRoster } from '../firestore';
import { loadPlayers, loadTrainers, loadLineup } from '../storage';
import { Player, Trainer, Lineup } from '../types';
import PresentationView from '../components/PresentationView/PresentationView';

export default function PresentationPage() {
  const localTrainers = loadTrainers();
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers());
  const [trainers, setTrainers] = useState<Trainer[]>(() => localTrainers);
  const [lineup, setLineup] = useState<Lineup>(() => loadLineup(localTrainers.map(t => t.id)));

  useEffect(() => {
    return subscribeToRoster(({ players, trainers, lineup }) => {
      setPlayers(players);
      setTrainers(trainers);
      if (lineup) setLineup(lineup);
    });
  }, []);

  return (
    <PresentationView
      players={players}
      trainers={trainers}
      lineup={lineup}
    />
  );
}
