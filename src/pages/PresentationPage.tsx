import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subscribeToRoster, subscribeToSettings } from '../firestore';
import { loadPlayers, loadTrainers, loadLineup, loadSettings } from '../storage';
import { Player, Trainer, Lineup, TeamSettings } from '../types';
import { getFormation, getDefaultFormationForCount } from '../formations';
import { applySettings } from '../utils/applySettings';
import PresentationView from '../components/PresentationView/PresentationView';
import i18n from '../i18n/index';

export default function PresentationPage() {
  const { teamSlug = 'default' } = useParams<{ teamSlug: string }>();
  const localTrainers = loadTrainers(teamSlug);
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers(teamSlug));
  const [trainers, setTrainers] = useState<Trainer[]>(() => localTrainers);
  const [lineup, setLineup] = useState<Lineup>(() => loadLineup(teamSlug, localTrainers.map(t => t.id)));
  const [settings, setSettings] = useState<TeamSettings>(() => {
    const s = loadSettings(teamSlug);
    applySettings(s);
    i18n.changeLanguage(s.language || 'de');
    return s;
  });

  useEffect(() => {
    return subscribeToRoster(teamSlug, ({ players, trainers, lineup }) => {
      setPlayers(players);
      setTrainers(trainers);
      if (lineup) setLineup(lineup);
    });
  }, [teamSlug]);

  useEffect(() => {
    return subscribeToSettings(teamSlug, s => {
      setSettings(s);
      applySettings(s);
      i18n.changeLanguage(s.language || 'de');
    });
  }, [teamSlug]);

  return (
    <PresentationView
      players={players}
      trainers={trainers}
      lineup={lineup}
      settings={settings}
      formation={lineup.formationId
        ? getFormation(lineup.formationId)
        : getDefaultFormationForCount(settings.playerCount ?? 11)
      }
    />
  );
}
