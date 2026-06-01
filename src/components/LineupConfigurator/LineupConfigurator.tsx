import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player, Trainer, Lineup, PositionKey } from '../../types';
import { ALL_FORMATIONS, getFormation, getDefaultFormationForCount } from '../../formations';
import FieldView from '../FieldView/FieldView';
import PlayerSelectModal from '../PlayerSelectModal/PlayerSelectModal';
import { avatarSrc } from '../../utils/avatar';
import './LineupConfigurator.css';

interface Props {
  players: Player[];
  trainers: Trainer[];
  lineup: Lineup;
  playerCount: 7 | 9 | 11;
  onUpdateLineup: (lineup: Lineup) => void;
  onStartPresentation: () => void;
}

export default function LineupConfigurator({ players, trainers, lineup, playerCount, onUpdateLineup, onStartPresentation }: Props) {
  const { t } = useTranslation();
  const [modalContext, setModalContext] = useState<
    | { type: 'starter'; posKey: PositionKey }
    | { type: 'substitute'; slotIndex: number }
    | { type: 'captain' }
    | null
  >(null);

  // Derive formation from lineup or default for player count
  const availableFormations = ALL_FORMATIONS.filter(f => f.playerCount === playerCount);
  const formation = lineup.formationId
    ? getFormation(lineup.formationId)
    : getDefaultFormationForCount(playerCount);

  const handleFormationChange = (formationId: string) => {
    if (formationId === formation.id) return;
    onUpdateLineup({ ...lineup, formationId, starters: {} });
  };

  const getAllAssignedIds = (): Set<string> => {
    const ids = new Set<string>();
    Object.values(lineup.starters).forEach(id => { if (id) ids.add(id); });
    lineup.substitutes.forEach(id => ids.add(id));
    lineup.absent.forEach(id => ids.add(id));
    return ids;
  };

  const getAssignedForModal = (): Set<string> => {
    const ids = getAllAssignedIds();
    if (modalContext?.type === 'starter') {
      const current = lineup.starters[modalContext.posKey];
      if (current) ids.delete(current);
    } else if (modalContext?.type === 'substitute') {
      const current = lineup.substitutes[modalContext.slotIndex];
      if (current) ids.delete(current);
    }
    return ids;
  };

  const handleSlotClick = (posKey: PositionKey) => {
    setModalContext({ type: 'starter', posKey });
  };

  const handleSlotClear = (posKey: PositionKey) => {
    onUpdateLineup({
      ...lineup,
      starters: { ...lineup.starters, [posKey]: undefined },
    });
  };

  const handleSubSlotClick = (slotIndex: number) => {
    setModalContext({ type: 'substitute', slotIndex });
  };

  const handleSubSlotClear = (slotIndex: number) => {
    const subs = [...lineup.substitutes];
    subs.splice(slotIndex, 1);
    onUpdateLineup({ ...lineup, substitutes: subs });
  };

  const handlePlayerSelect = (playerId: string) => {
    if (!modalContext) return;
    if (modalContext.type === 'starter') {
      onUpdateLineup({
        ...lineup,
        starters: { ...lineup.starters, [modalContext.posKey]: playerId },
      });
    } else if (modalContext.type === 'substitute') {
      const subs = [...lineup.substitutes];
      subs[modalContext.slotIndex] = playerId;
      onUpdateLineup({ ...lineup, substitutes: subs });
    } else if (modalContext.type === 'captain') {
      onUpdateLineup({ ...lineup, captain: playerId });
    }
    setModalContext(null);
  };

  const toggleAbsent = (playerId: string) => {
    const assignedIds = getAllAssignedIds();
    if (assignedIds.has(playerId) && !lineup.absent.includes(playerId)) return;

    if (lineup.absent.includes(playerId)) {
      onUpdateLineup({ ...lineup, absent: lineup.absent.filter(id => id !== playerId) });
    } else {
      const newStarters = { ...lineup.starters };
      Object.keys(newStarters).forEach(k => {
        if (newStarters[k] === playerId) newStarters[k] = undefined;
      });
      const newSubs = lineup.substitutes.filter(id => id !== playerId);
      onUpdateLineup({
        ...lineup,
        starters: newStarters,
        substitutes: newSubs,
        absent: [...lineup.absent, playerId],
      });
    }
  };

  const toggleCoach = (trainerId: string) => {
    if (lineup.coaches.includes(trainerId)) {
      onUpdateLineup({ ...lineup, coaches: lineup.coaches.filter(id => id !== trainerId) });
    } else {
      onUpdateLineup({ ...lineup, coaches: [...lineup.coaches, trainerId] });
    }
  };

  const handleReset = () => {
    if (!confirm(t('confirm_reset_lineup'))) return;
    onUpdateLineup({ starters: {}, substitutes: [], absent: [], coaches: lineup.coaches });
  };

  const getModalTitle = () => {
    if (!modalContext) return '';
    if (modalContext.type === 'starter') {
      const allPos = formation.rows.flat();
      const posDef = allPos.find(p => p.key === modalContext.posKey);
      return posDef ? t(posDef.labelKey) : modalContext.posKey;
    }
    if (modalContext.type === 'substitute') return t('substitute_title', { num: modalContext.slotIndex + 1 });
    return t('captain_modal_title');
  };

  const sortedPlayers = [...players].sort((a, b) => a.number - b.number);
  const assignedIds = getAllAssignedIds();

  return (
    <div className="lineup-configurator">
      <div className="lineup-top-bar">
        <h2 className="section-heading">{t('lineup_configure')}</h2>
        <div className="formation-picker">
          {availableFormations.map(f => (
            <button
              key={f.id}
              type="button"
              className={`formation-btn${formation.id === f.id ? ' active' : ''}`}
              onClick={() => handleFormationChange(f.id)}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="lineup-layout">
        <div className="lineup-field-col">
          <FieldView
            starters={lineup.starters}
            players={players}
            formation={formation}
            onSlotClick={handleSlotClick}
            onSlotClear={handleSlotClear}
          />
        </div>

        <div className="lineup-side-col">
          <div className="lineup-section card">
            <h3 className="lineup-section-title">
              {t('lineup_substitutes')}
              <span className="lineup-count">{t('lineup_count_subs', { count: lineup.substitutes.length })}</span>
            </h3>
            <div className="subs-grid">
              {Array.from({ length: 6 }, (_, i) => {
                const playerId = lineup.substitutes[i];
                const player = playerId ? players.find(p => p.id === playerId) : undefined;
                return (
                  <div key={i} className={`sub-slot${player ? ' filled' : ''}`}>
                    {player ? (
                      <div className="sub-slot-filled" onClick={() => handleSubSlotClick(i)} style={{ cursor: 'pointer' }}>
                        <div className="sub-avatar">
                          <img src={avatarSrc(player.photoUrl)} alt="" className="sub-avatar-img" />
                        </div>
                        <span className="sub-name">
                          {player.firstName.charAt(0)}. {player.lastName.toUpperCase()}
                        </span>
                        <button className="sub-clear-btn" onClick={(e) => { e.stopPropagation(); handleSubSlotClear(i); }}>✕</button>
                      </div>
                    ) : (
                      <button
                        className="sub-slot-btn"
                        onClick={() => handleSubSlotClick(i)}
                        disabled={lineup.substitutes.length >= 6 && i >= lineup.substitutes.length}
                      >
                        <span>+</span>
                        <span className="sub-slot-num">{t('sub_slot_label', { num: i + 1 })}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lineup-section card">
            <h3 className="lineup-section-title">{t('lineup_absent')}</h3>
            <div className="absent-list">
              {sortedPlayers
                .filter(player => {
                  const isAssigned = assignedIds.has(player.id) && !lineup.absent.includes(player.id);
                  return !isAssigned;
                })
                .map(player => {
                  const isAbsent = lineup.absent.includes(player.id);
                  return (
                    <button
                      key={player.id}
                      className={`absent-player-btn${isAbsent ? ' absent' : ''}`}
                      onClick={() => toggleAbsent(player.id)}
                      title={isAbsent ? t('absent_mark_present') : t('absent_mark_absent')}
                    >
                      <span className="absent-number">{player.number}</span>
                      <span className="absent-name">{player.firstName} {player.lastName}</span>
                      {isAbsent && <span className="absent-badge">{t('absent_badge')}</span>}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="lineup-section card">
            <h3 className="lineup-section-title">{t('lineup_coaches')}</h3>
            {trainers.length === 0 ? (
              <span className="empty-coaches">{t('coaches_empty')}</span>
            ) : (
              <div className="absent-list">
                {trainers.map(trainer => {
                  const isSelected = lineup.coaches.includes(trainer.id);
                  return (
                    <button
                      key={trainer.id}
                      className="absent-player-btn trainer-toggle-btn"
                      onClick={() => toggleCoach(trainer.id)}
                      title={isSelected ? t('coach_remove_title') : t('coach_add_title')}
                    >
                      <img src={avatarSrc(trainer.photoUrl)} alt="" className="coach-avatar-thumb" />
                      <span className="absent-name">
                        {trainer.firstName} {trainer.lastName}
                        {trainer.role && <span className="coach-role-tag"> · {trainer.role}</span>}
                      </span>
                      <span className={isSelected ? 'trainer-badge trainer-badge-dabei' : 'trainer-badge trainer-badge-nicht'}>
                        {isSelected ? t('coach_in_lineup') : t('coach_not_in_lineup')}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lineup-section card">
            <h3 className="lineup-section-title">{t('lineup_captain')}</h3>
            {(() => {
              const allLineupIds = [
                ...Object.values(lineup.starters).filter(Boolean) as string[],
                ...lineup.substitutes,
              ];
              const lineupPlayers = sortedPlayers.filter(p => allLineupIds.includes(p.id));
              const captain = lineup.captain ? players.find(p => p.id === lineup.captain) : undefined;
              if (lineupPlayers.length === 0) {
                return <span className="empty-coaches">{t('captain_empty_lineup')}</span>;
              }
              return (
                <div className="captain-picker">
                  {captain ? (
                    <div className="captain-current">
                      <div className="captain-avatar">
                        <img src={avatarSrc(captain.photoUrl)} alt="" />
                        <div className="captain-c-badge">C</div>
                      </div>
                      <span className="captain-name">{captain.firstName} {captain.lastName.toUpperCase()}</span>
                      <button className="sub-clear-btn" onClick={() => onUpdateLineup({ ...lineup, captain: undefined })} title={t('captain_deselect')}>✕</button>
                    </div>
                  ) : (
                    <span className="empty-coaches">{t('captain_not_selected')}</span>
                  )}
                  <button
                    className="btn btn-secondary captain-pick-btn"
                    onClick={() => setModalContext({ type: 'captain' })}
                  >
                    {captain ? t('captain_change') : t('captain_pick')}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="lineup-actions">
        <div className="lineup-match-info">
          <div className="match-info-field">
            <label className="match-info-label">{t('label_opponent')}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t('placeholder_opponent')}
              value={lineup.opponent ?? ''}
              onChange={e => onUpdateLineup({ ...lineup, opponent: e.target.value })}
            />
          </div>
          <div className="match-info-field">
            <label className="match-info-label">{t('label_date')}</label>
            <input
              className="form-input"
              type="date"
              value={lineup.matchDate ?? ''}
              onChange={e => onUpdateLineup({ ...lineup, matchDate: e.target.value })}
            />
          </div>
        </div>
        <div className="lineup-action-btns">
          <button className="btn btn-secondary" onClick={handleReset}>
            {t('btn_reset_lineup')}
          </button>
          <button className="btn btn-primary btn-lg" onClick={onStartPresentation}>
            {t('btn_start_presentation')}
          </button>
        </div>
      </div>

      {modalContext && (
        <PlayerSelectModal
          players={
            modalContext.type === 'captain'
              ? sortedPlayers.filter(p => [
                  ...Object.values(lineup.starters).filter(Boolean) as string[],
                  ...lineup.substitutes,
                ].includes(p.id))
              : players
          }
          assignedIds={modalContext.type === 'captain' ? new Set() : getAssignedForModal()}
          onSelect={handlePlayerSelect}
          onClose={() => setModalContext(null)}
          title={getModalTitle()}
        />
      )}
    </div>
  );
}
