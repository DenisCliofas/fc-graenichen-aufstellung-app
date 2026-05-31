import { useState } from 'react';
import { Player, Trainer, Lineup, LineupStarters, PositionKey, POSITION_LABELS } from '../../types';
import FieldView from '../FieldView/FieldView';
import PlayerSelectModal from '../PlayerSelectModal/PlayerSelectModal';
import { avatarSrc } from '../../utils/avatar';
import './LineupConfigurator.css';

interface Props {
  players: Player[];
  trainers: Trainer[];
  lineup: Lineup;
  onUpdateLineup: (lineup: Lineup) => void;
  onStartPresentation: () => void;
}

export default function LineupConfigurator({ players, trainers, lineup, onUpdateLineup, onStartPresentation }: Props) {
  const [modalContext, setModalContext] = useState<
    | { type: 'starter'; posKey: PositionKey }
    | { type: 'substitute'; slotIndex: number }
    | { type: 'captain' }
    | null
  >(null);

  // Collect all assigned player IDs
  const getAllAssignedIds = (): Set<string> => {
    const ids = new Set<string>();
    Object.values(lineup.starters).forEach(id => { if (id) ids.add(id); });
    lineup.substitutes.forEach(id => ids.add(id));
    lineup.absent.forEach(id => ids.add(id));
    return ids;
  };

  // For modal: exclude slot's current occupant from "assigned" so it can be re-selected
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
        starters: { ...lineup.starters, [modalContext.posKey]: playerId } as LineupStarters,
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
    if (assignedIds.has(playerId) && !lineup.absent.includes(playerId)) return; // already in starters/subs

    if (lineup.absent.includes(playerId)) {
      onUpdateLineup({ ...lineup, absent: lineup.absent.filter(id => id !== playerId) });
    } else {
      // Remove from starters/subs if present
      const newStarters = { ...lineup.starters };
      (Object.keys(newStarters) as PositionKey[]).forEach(k => {
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
    if (!confirm('Aufstellung zurücksetzen? Alle Zuweisungen werden gelöscht.')) return;
    onUpdateLineup({ starters: {}, substitutes: [], absent: [], coaches: lineup.coaches });
  };

  const sortedPlayers = [...players].sort((a, b) => a.number - b.number);
  const assignedIds = getAllAssignedIds();

  return (
    <div className="lineup-configurator">
      <h2 className="section-heading">Aufstellung konfigurieren</h2>

      <div className="lineup-layout">
        {/* Field */}
        <div className="lineup-field-col">
          <FieldView
            starters={lineup.starters}
            players={players}
            onSlotClick={handleSlotClick}
            onSlotClear={handleSlotClear}
          />
        </div>

        {/* Side Panel */}
        <div className="lineup-side-col">
          {/* Substitutes */}
          <div className="lineup-section card">
            <h3 className="lineup-section-title">
              Ersatzspieler
              <span className="lineup-count">{lineup.substitutes.length}/6</span>
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
                        <span className="sub-slot-num">Bank {i + 1}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Absent */}
          <div className="lineup-section card">
            <h3 className="lineup-section-title">Abwesend</h3>
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
                      title={isAbsent ? 'Als anwesend markieren' : 'Als abwesend markieren'}
                    >
                      <span className="absent-number">{player.number}</span>
                      <span className="absent-name">{player.firstName} {player.lastName}</span>
                      {isAbsent && <span className="absent-badge">✗ Abwesend</span>}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Coaches */}
          <div className="lineup-section card">
            <h3 className="lineup-section-title">Trainer</h3>
            {trainers.length === 0 ? (
              <span className="empty-coaches">Keine Trainer erfasst. Bitte zuerst Trainer hinzufügen.</span>
            ) : (
              <div className="absent-list">
                {trainers.map(trainer => {
                  const isSelected = lineup.coaches.includes(trainer.id);
                  return (
                    <button
                      key={trainer.id}
                      className="absent-player-btn trainer-toggle-btn"
                      onClick={() => toggleCoach(trainer.id)}
                      title={isSelected ? 'Aus Aufstellung entfernen' : 'Zur Aufstellung hinzufügen'}
                    >
                      <img src={avatarSrc(trainer.photoUrl)} alt="" className="coach-avatar-thumb" />
                      <span className="absent-name">
                        {trainer.firstName} {trainer.lastName}
                        {trainer.role && <span className="coach-role-tag"> · {trainer.role}</span>}
                      </span>
                      <span className={isSelected ? 'trainer-badge trainer-badge-dabei' : 'trainer-badge trainer-badge-nicht'}>
                        {isSelected ? '✓ Dabei' : '✗ Nicht dabei'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Captain */}
          <div className="lineup-section card">
            <h3 className="lineup-section-title">Captain</h3>
            {(() => {
              const allLineupIds = [
                ...Object.values(lineup.starters).filter(Boolean) as string[],
                ...lineup.substitutes,
              ];
              const lineupPlayers = sortedPlayers.filter(p => allLineupIds.includes(p.id));
              const captain = lineup.captain ? players.find(p => p.id === lineup.captain) : undefined;
              if (lineupPlayers.length === 0) {
                return <span className="empty-coaches">Spieler der Aufstellung hinzufügen, um einen Captain zu wählen.</span>;
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
                      <button className="sub-clear-btn" onClick={() => onUpdateLineup({ ...lineup, captain: undefined })} title="Captain abwählen">✕</button>
                    </div>
                  ) : (
                    <span className="empty-coaches">Kein Captain gewählt.</span>
                  )}
                  <button
                    className="btn btn-secondary captain-pick-btn"
                    onClick={() => setModalContext({ type: 'captain' })}
                  >
                    {captain ? '✏ Captain ändern' : '+ Captain wählen'}
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
            <label className="match-info-label">Gegner</label>
            <input
              className="form-input"
              type="text"
              placeholder="z.B. FC Suhr"
              value={lineup.opponent ?? ''}
              onChange={e => onUpdateLineup({ ...lineup, opponent: e.target.value })}
            />
          </div>
          <div className="match-info-field">
            <label className="match-info-label">Datum</label>
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
            ↺ Aufstellung zurücksetzen
          </button>
          <button className="btn btn-primary btn-lg" onClick={onStartPresentation}>
            ▶ Präsentation starten
          </button>
        </div>
      </div>

      {/* Modal */}
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
          title={
            modalContext.type === 'starter'
              ? POSITION_LABELS[modalContext.posKey]
              : modalContext.type === 'substitute'
              ? `Ersatzspieler Bank ${modalContext.slotIndex + 1}`
              : 'Captain wählen'
          }
        />
      )}
    </div>
  );
}
