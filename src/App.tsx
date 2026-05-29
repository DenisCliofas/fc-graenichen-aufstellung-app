import { useState, useEffect } from 'react';
import './App.css';
import logoSvg from './assets/logo.svg';
import { Player, Trainer, Lineup, AppTab } from './types';
import { loadPlayers, savePlayers, loadTrainers, saveTrainers, loadLineup, saveLineup } from './storage';
import PlayerManager from './components/PlayerManager/PlayerManager';
import TrainerManager from './components/TrainerManager/TrainerManager';
import LineupConfigurator from './components/LineupConfigurator/LineupConfigurator';
import PresentationView from './components/PresentationView/PresentationView';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('trainers');
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers());
  const [trainers, setTrainers] = useState<Trainer[]>(() => loadTrainers());
  const [lineup, setLineup] = useState<Lineup>(() => {
    const loadedTrainers = loadTrainers();
    return loadLineup(loadedTrainers.map(t => t.id));
  });

  useEffect(() => { savePlayers(players); }, [players]);
  useEffect(() => { saveTrainers(trainers); }, [trainers]);
  useEffect(() => { saveLineup(lineup); }, [lineup]);

  if (activeTab === 'presentation') {
    return (
      <PresentationView
        players={players}
        trainers={trainers}
        lineup={lineup}
        onBack={() => setActiveTab('lineup')}
      />
    );
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <button className={`app-tab${activeTab === 'trainers' ? ' active' : ''}`} onClick={() => setActiveTab('trainers')}>
            Trainer
          </button>
          <button className={`app-tab${activeTab === 'players' ? ' active' : ''}`} onClick={() => setActiveTab('players')}>
            Spieler
          </button>
          <button className={`app-tab${activeTab === 'lineup' ? ' active' : ''}`} onClick={() => setActiveTab('lineup')}>
            Aufstellung
          </button>
        </div>
      </nav>

      <div className="app-header-banner">
        <span className="app-banner-text">AUFSTELLUNGS-APP</span>
        <a className="app-banner-logo" href="https://www.fcgraenichen.ch" target="_blank" rel="noopener noreferrer">
          <img src={logoSvg} alt="FC Gränichen" />
        </a>
        <span className="app-banner-text">FC GRÄNICHEN 1907</span>
      </div>

      <main className="app-content">
        {activeTab === 'trainers' && (
          <TrainerManager
            trainers={trainers}
            onUpdateTrainers={(updated) => {
              // Auto-select any newly added trainer in the lineup
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
            onUpdateLineup={setLineup}
            onStartPresentation={() => setActiveTab('presentation')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
