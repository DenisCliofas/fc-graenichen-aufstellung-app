import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Player, Trainer, Lineup, PositionKey, TeamSettings } from '../../types';
import { FormationConfig, getStarterOrder } from '../../formations';
import './PresentationView.css';
import logoSvg from '../../assets/logo.svg';
import { useAnthem } from '../../hooks/useAnthem';
import { avatarSrc } from '../../utils/avatar';

interface Props {
  players: Player[];
  trainers: Trainer[];
  lineup: Lineup;
  settings: TeamSettings;
  formation: FormationConfig;
}

type MainPhase = 'intro' | 'starters' | 'substitutes' | 'end';
type SpotState = 'entering' | 'showing' | 'exiting';

export default function PresentationView({ players, trainers, lineup, settings, formation }: Props) {
  const { t } = useTranslation();
  const [mainPhase, setMainPhase] = useState<MainPhase>('intro');
  const [spotIdx, setSpotIdx] = useState(-1);
  const [spotState, setSpotState] = useState<SpotState>('entering');
  const [placed, setPlaced] = useState<Set<PositionKey>>(new Set());
  const [arrivingPos, setArrivingPos] = useState<PositionKey | null>(null);
  const [allPlaced, setAllPlaced] = useState(false);
  const [key, setKey] = useState(0);
  const [musicOn, setMusicOn] = useState(false);

  const anthem = useAnthem();

  // Build field positions and label map from formation
  const fieldPos: Record<string, [number, number]> = {};
  formation.rows.flat().forEach(p => { fieldPos[p.key] = p.fieldPos; });

  const starterOrder = getStarterOrder(formation);

  const posLabelMap: Record<string, string> = {};
  formation.rows.flat().forEach(p => { posLabelMap[p.key] = p.labelKey; });

  const starters = starterOrder
    .map(posKey => {
      const id = lineup.starters[posKey];
      const player = id ? players.find(p => p.id === id) : undefined;
      return player ? { posKey, player } : null;
    })
    .filter(Boolean) as { posKey: PositionKey; player: Player }[];

  const subs = lineup.substitutes
    .map(id => players.find(p => p.id === id))
    .filter(Boolean) as Player[];

  useEffect(() => {
    if (mainPhase !== 'intro') return;
    const t = setTimeout(() => {
      if (starters.length > 0) {
        setSpotIdx(0);
        setSpotState('entering');
        setMainPhase('starters');
      } else if (subs.length > 0) {
        setMainPhase('substitutes');
      } else {
        setMainPhase('end');
      }
    }, 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainPhase]);

  useEffect(() => {
    if (mainPhase !== 'starters' || spotIdx < 0 || spotIdx >= starters.length) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const posKey = starters[spotIdx].posKey;

    if (spotState === 'entering') {
      timers.push(setTimeout(() => setSpotState('showing'), 600));
    } else if (spotState === 'showing') {
      timers.push(setTimeout(() => setSpotState('exiting'), 2000));
    } else if (spotState === 'exiting') {
      timers.push(setTimeout(() => setArrivingPos(posKey), 100));
      timers.push(setTimeout(() => {
        setPlaced(prev => new Set([...prev, posKey]));
        setArrivingPos(null);
      }, 500));
      timers.push(setTimeout(() => {
        const nextIdx = spotIdx + 1;
        if (nextIdx < starters.length) {
          setSpotIdx(nextIdx);
          setSpotState('entering');
        } else {
          setSpotIdx(-1);
          setAllPlaced(true);
        }
      }, 900));
    }

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainPhase, spotIdx, spotState]);

  useEffect(() => {
    if (mainPhase !== 'starters' || !allPlaced) return;
    const t = setTimeout(() => {
      setMainPhase(subs.length > 0 ? 'substitutes' : 'end');
    }, 2500);
    return () => clearTimeout(t);
  }, [mainPhase, allPlaced, subs.length]);

  useEffect(() => {
    if (mainPhase !== 'substitutes') return;
    const t = setTimeout(() => setMainPhase('end'), subs.length * 500 + 2500);
    return () => clearTimeout(t);
  }, [mainPhase, subs.length]);

  const handleRestart = useCallback(() => {
    setPlaced(new Set());
    setArrivingPos(null);
    setAllPlaced(false);
    setSpotIdx(-1);
    setSpotState('entering');
    setMainPhase('intro');
    setKey(k => k + 1);
  }, []);

  const logoSrc = settings.logoUrl || logoSvg;
  const [teamPrefix, teamCity] = (() => {
    const parts = settings.teamName.split(' ');
    if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];
    return ['', settings.teamName];
  })();

  const handleMusicToggle = useCallback(() => {
    if (!musicOn) {
      anthem.play();
      setMusicOn(true);
    } else {
      anthem.pause();
      setMusicOn(false);
    }
  }, [musicOn, anthem]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const [shareFeedback, setShareFeedback] = useState('');

  const handleShare = async () => {
    const opponent = lineup.opponent ? ` vs ${lineup.opponent}` : '';
    const date = lineup.matchDate
      ? ' · ' + new Date(lineup.matchDate + 'T12:00:00').toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const shareData = {
      title: t('share_title', { teamName: settings.teamName, opponent }),
      text: t('share_text', { teamName: settings.teamName, opponent, date, shortName: settings.shortName }),
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try { await navigator.share(shareData); } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback(t('share_copied'));
        setTimeout(() => setShareFeedback(''), 2500);
      } catch {
        setShareFeedback('URL: ' + window.location.href);
        setTimeout(() => setShareFeedback(''), 4000);
      }
    }
  };

  return (
    <div className="pres-root" key={key}>

      {/* ===== INTRO ===== */}
      {mainPhase === 'intro' && (
        <div className="pres-phase pres-intro">
          <div className="pres-intro-bg-shapes">
            <div className="pres-shape pres-shape-1" />
            <div className="pres-shape pres-shape-2" />
            <div className="pres-shape pres-shape-3" />
          </div>
          <div className="pres-intro-content">
            <div className="pres-logo-wrap">
              <img src={logoSrc} alt={settings.teamName} className="pres-logo" />
            </div>
            <div className="pres-club-name">
              {teamPrefix && <span className="pres-club-fc">{teamPrefix}</span>}
              <span className="pres-club-city">{teamCity.toUpperCase()}</span>
            </div>
            {(lineup.opponent || lineup.matchDate) && (
              <div className="pres-match-info">
                {lineup.opponent && (
                  <div className="pres-match-vs">
                    <span className="pres-match-label">vs</span>
                    <span className="pres-match-opponent">{lineup.opponent.toUpperCase()}</span>
                  </div>
                )}
                {lineup.matchDate && (
                  <div className="pres-match-date">
                    {new Date(lineup.matchDate + 'T12:00:00').toLocaleDateString('de-CH', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                )}
              </div>
            )}
            <div className="pres-intro-stripe" />
          </div>
        </div>
      )}

      {/* ===== STARTERS: field + spotlight ===== */}
      {mainPhase === 'starters' && (
        <div className="pres-phase pres-starters-phase">
          {/* Portrait football field */}
          <div className="pres-pfield-wrap">
            <div className="pres-pfield">
              <div className="pres-pfield-markings">
                <div className="pres-pfield-border" />
                <div className="pres-pfield-midline" />
                <div className="pres-pfield-midcircle" />
                <div className="pres-pfield-penalty-top" />
                <div className="pres-pfield-penalty-bottom" />
                <div className="pres-pfield-goal-top" />
                <div className="pres-pfield-goal-bottom" />
              </div>

              {starters.map(({ posKey, player }) => {
                const pos = fieldPos[posKey];
                const [top, left] = pos ?? [50, 50];
                const isPlaced = placed.has(posKey);
                const isArriving = arrivingPos === posKey;
                const isCaptain = lineup.captain === player.id;
                return (
                  <div
                    key={posKey}
                    className={`pres-ptoken${isPlaced ? ' is-placed' : ''}${isArriving ? ' is-arriving' : ''}`}
                    style={{ top: `${top}%`, left: `${left}%` }}
                  >
                    <div className="pres-ptoken-circle">
                      <img src={avatarSrc(player.photoUrl)} alt="" />
                      {isCaptain && <div className="pres-captain-badge">C</div>}
                    </div>
                    <div className="pres-ptoken-name">{player.lastName.toUpperCase()}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spotlight overlay */}
          {spotIdx >= 0 && spotIdx < starters.length && (() => {
            const entry = starters[spotIdx];
            return (
              <div className={`pres-spotlight pres-spotlight-${spotState}`}>
                <div className="pres-spotlight-inner">
                  <div className="pres-spot-pos">{t(posLabelMap[entry.posKey] ?? entry.posKey)}</div>
                  <div className="pres-spot-circle">
                    <>
                      <img src={avatarSrc(entry.player.photoUrl)} alt="" />
                      <div className="pres-spot-num-badge">{entry.player.number}</div>
                    </>
                    {lineup.captain === entry.player.id && (
                      <div className="pres-spot-captain-badge">C</div>
                    )}
                  </div>
                  <div className="pres-spot-names">
                    <div className="pres-spot-firstname">{entry.player.firstName}</div>
                    <div className="pres-spot-lastname">{entry.player.lastName.toUpperCase()}</div>
                  </div>
                  {lineup.captain === entry.player.id && (
                    <div className="pres-spot-captain-label">⚽ CAPTAIN</div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ===== SUBSTITUTES ===== */}
      {mainPhase === 'substitutes' && (
        <div className="pres-phase pres-players-phase">
          <div className="pres-field-bg pres-field-bg-dim" />
          <div className="pres-players-content">
            <div className="pres-phase-heading">
              <span className="pres-phase-heading-text">{t('pres_substitutes_heading')}</span>
              <div className="pres-phase-heading-line" />
            </div>
            <div className={`pres-subs-grid${subs.length === 0 ? ' empty' : ''}`}>
              {subs.map((player, i) => (
                <div key={player.id} className="pres-player-card pres-player-card-sub"
                  style={{ animationDelay: `${i * 0.5}s` }}>
                  <div className="pres-card-avatar-wrap">
                    <div className="pres-card-number">
                      <img src={avatarSrc(player.photoUrl)} alt="" className="pres-card-photo" />
                    </div>
                    <div className="pres-card-number-badge">{player.number}</div>
                    {lineup.captain === player.id && (
                      <div className="pres-captain-badge">C</div>
                    )}
                  </div>
                  <div className="pres-card-info">
                    <div className="pres-card-firstname">{player.firstName}</div>
                    <div className="pres-card-lastname">{player.lastName.toUpperCase()}</div>
                  </div>
                </div>
              ))}
              {subs.length === 0 && <div className="pres-empty-msg">{t('pres_no_subs')}</div>}
            </div>
            {lineup.coaches.length > 0 && (
              <div className="pres-coaches">
                <div className="pres-coaches-label">{t('pres_coaches_label')}</div>
                <div className="pres-coaches-list">
                  {lineup.coaches.map((coachId) => {
                    const trainer = trainers.find(t => t.id === coachId);
                    if (!trainer) return null;
                    return (
                      <span key={coachId} className="pres-coach-name">
                        <img src={avatarSrc(trainer.photoUrl)} alt="" className="pres-coach-avatar" />
                        {' '}{trainer.firstName} {trainer.lastName}
                        {trainer.role && <span className="pres-coach-role"> · {trainer.role}</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== END ===== */}
      {mainPhase === 'end' && (
        <div className="pres-phase pres-end">
          <div className="pres-end-bg-shapes">
            <div className="pres-shape pres-shape-1" />
            <div className="pres-shape pres-shape-2" />
          </div>
          <div className="pres-end-content">
            <div className="pres-end-logo"><img src={logoSrc} alt={settings.teamName} /></div>
            <div className="pres-end-hopp">HOPP</div>
            <div className="pres-end-club">{settings.teamName.toUpperCase()}!</div>
            <div className="pres-end-emojis">💛 🖤 💛 🖤 💛</div>
            <div className="pres-end-tagline">{t('pres_end_tagline')}</div>
          </div>
        </div>
      )}

      {/* ===== CONTROLS ===== */}
      <div className="pres-controls">
        <button className="pres-ctrl-btn" onClick={handleRestart}>⟳ <span>{t('btn_restart')}</span></button>
        <button className="pres-ctrl-btn" onClick={handleFullscreen}>⛶ <span>{t('btn_fullscreen')}</span></button>
        <button
          className={`pres-ctrl-btn pres-ctrl-music${musicOn ? ' active' : ''}`}
          onClick={handleMusicToggle}
          title={musicOn ? t('btn_music') : t('btn_music')}
        >
          {musicOn ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}}>
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}}>
              <line x1="2" y1="2" x2="22" y2="22"/>
              <path d="M9 18V5l12-2v13"/><path d="M6 15.7A3 3 0 0 0 6 21a3 3 0 0 0 2.83-4"/>
              <path d="M18 13.7A3 3 0 0 0 18 19a3 3 0 0 0 2.83-4"/>
            </svg>
          )}
          {' '}<span>{t('btn_music')}</span>
        </button>
        <button className="pres-ctrl-btn pres-ctrl-share" onClick={handleShare}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}}>
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          {' '}<span>{t('btn_share')}</span>
        </button>
      </div>
      {shareFeedback && <div className="pres-share-toast">{shareFeedback}</div>}
    </div>
  );
}