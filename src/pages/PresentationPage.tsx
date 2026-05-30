import { useNavigate } from 'react-router-dom';
import { loadPlayers, loadTrainers, loadLineup } from '../storage';
import PresentationView from '../components/PresentationView/PresentationView';

export default function PresentationPage() {
  const navigate = useNavigate();
  const trainers = loadTrainers();
  const players = loadPlayers();
  const lineup = loadLineup(trainers.map(t => t.id));

  return (
    <PresentationView
      players={players}
      trainers={trainers}
      lineup={lineup}
      onBack={() => navigate('/editor')}
    />
  );
}
