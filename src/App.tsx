import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import logoSvg from './assets/logo.svg';
import { Player, Trainer, Lineup, AppTab, TeamSettings } from './types';
// formations not needed directly in App - derived in child components
import { loadPlayers, savePlayers, loadTrainers, saveTrainers, loadLineup, saveLineup, loadSettings, saveSettings } from './storage';
import { savePlayersToFirestore, saveTrainersToFirestore, saveLineupToFirestore, saveSettingsToFirestore, subscribeToRoster, subscribeToSettings } from './firestore';
import PlayerManager from './components/PlayerManager/PlayerManager';
import TrainerManager from './components/TrainerManager/TrainerManager';
import LineupConfigurator from './components/LineupConfigurator/LineupConfigurator';
import { applySettings } from './utils/applySettings';
import TeamSettingsEditor from './components/TeamSettings/TeamSettingsEditor';
import PresentationPage from './pages/PresentationPage';
import TeamSetup from './pages/TeamSetup';
import i18n from './i18n/index';

// applySettings imported from utils

function EditorLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { teamSlug = 'default' } = useParams<{ teamSlug: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as AppTab) || 'trainers';
  const [activeTab, setActiveTab] = useState<AppTab>(initialTab);
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers(teamSlug));
  const [trainers, setTrainers] = useState<Trainer[]>(() => loadTrainers(teamSlug));
  const [lineup, setLineup] = useState<Lineup>(() => {
    const loadedTrainers = loadTrainers(teamSlug);
    return loadLineup(teamSlug, loadedTrainers.map(t => t.id));
  });
  const [settings, setSettings] = useState<TeamSettings>(() => {
    const s = loadSettings(teamSlug);
    applySettings(s);
    i18n.changeLanguage(s.language || 'de');
    return s;
  });
  const [cloudSynced, setCloudSynced] = useState(false);
  const [settingsSynced, setSettingsSynced] = useState(false);

  // On first load, fetch from Firestore before enabling cloud writes
  useEffect(() => {
    const unsub = subscribeToRoster(teamSlug, ({ players: fp, trainers: ft, lineup: fl }) => {
      if (fp.length > 0) { setPlayers(fp); savePlayers(teamSlug, fp); }
      if (ft.length > 0) { setTrainers(ft); saveTrainers(teamSlug, ft); }
      if (fl) { setLineup(fl); saveLineup(teamSlug, fl); }
      setCloudSynced(true);
      unsub();
    });
    return unsub;
  }, [teamSlug]);

  useEffect(() => {
    return subscribeToSettings(teamSlug, s => {
      setSettings(s);
      saveSettings(teamSlug, s);
      applySettings(s);
      i18n.changeLanguage(s.language || 'de');
      setSettingsSynced(true);
    });
  }, [teamSlug]);

  useEffect(() => { savePlayers(teamSlug, players); if (cloudSynced) savePlayersToFirestore(teamSlug, players); }, [players, cloudSynced, teamSlug]);
  useEffect(() => { saveTrainers(teamSlug, trainers); if (cloudSynced) saveTrainersToFirestore(teamSlug, trainers); }, [trainers, cloudSynced, teamSlug]);
  useEffect(() => { saveLineup(teamSlug, lineup); if (cloudSynced) saveLineupToFirestore(teamSlug, lineup); }, [lineup, cloudSynced, teamSlug]);

  const handleSaveSettings = useCallback((s: TeamSettings) => {
    const prevCount = settings.playerCount ?? 11;
    const newCount = s.playerCount ?? 11;
    setSettings(s);
    saveSettings(teamSlug, s);
    applySettings(s);
    i18n.changeLanguage(s.language || 'de');
    saveSettingsToFirestore(teamSlug, s);
    if (!settingsSynced) setSettingsSynced(true);
    // Clear starters when player count changes
    if (prevCount !== newCount) {
      setLineup(l => ({ ...l, starters: {}, formationId: undefined }));
    }
  }, [teamSlug, settingsSynced, settings.playerCount]);

  const logoSrc = settings.logoUrl || logoSvg;
  const teamLabel = settings.teamName.toUpperCase();

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <button className={`app-tab${activeTab === 'trainers' ? ' active' : ''}`} onClick={() => setActiveTab('trainers')}>
            {t('app_tab_trainers')}
          </button>
          <button className={`app-tab${activeTab === 'players' ? ' active' : ''}`} onClick={() => setActiveTab('players')}>
            {t('app_tab_players')}
          </button>
          <button className={`app-tab${activeTab === 'lineup' ? ' active' : ''}`} onClick={() => setActiveTab('lineup')}>
            {t('app_tab_lineup')}
          </button>
          <button className={`app-tab${activeTab === 'settings' ? ' active' : ''}`} onClick={() => setActiveTab('settings')}>
            {t('app_tab_settings')}
          </button>
        </div>
      </nav>

      <div className="app-header-banner">
        <span className="app-banner-text">{t('app_title')}</span>
        <a className="app-banner-logo" href="https://www.fcgraenichen.ch" target="_blank" rel="noopener noreferrer">
          <img src={logoSrc} alt={settings.teamName} />
        </a>
        <span className="app-banner-text">{teamLabel}</span>
      </div>

      <main className="app-content">
        {activeTab === 'trainers' && (
          <TrainerManager
            trainers={trainers}
            onUpdateTrainers={(updated) => {
              const newIds = updated.map(t => t.id).filter(id => !trainers.some(t => t.id === id));
              if (newIds.length > 0) {
                setLineup(l => ({ ...l, coaches: [...l.coaches, ...newIds] }));
              }
              setTrainers(updated);
            }}
          />
        )}
        {activeTab === 'players' && (
          <PlayerManager players={players} onUpdatePlayers={setPlayers} />
        )}
        {activeTab === 'lineup' && (
          <LineupConfigurator
            players={players}
            trainers={trainers}
            lineup={lineup}
            playerCount={settings.playerCount ?? 11}
            onUpdateLineup={setLineup}
            onStartPresentation={() => navigate(`/${teamSlug}/presentation`)}
          />
        )}
        {activeTab === 'settings' && (
          <TeamSettingsEditor settings={settings} onSave={handleSaveSettings} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeamSetup />} />
      <Route path="/:teamSlug/editor" element={<EditorLayout />} />
      <Route path="/:teamSlug/presentation" element={<PresentationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
