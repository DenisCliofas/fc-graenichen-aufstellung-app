import { Player, LineupStarters, PositionKey, POSITION_LABELS, POSITION_SHORT } from '../../types';
import './FieldView.css';

interface PositionSlotProps {
  posKey: PositionKey;
  playerId?: string;
  players: Player[];
  onClick: (posKey: PositionKey) => void;
  onClear: (posKey: PositionKey) => void;
}

function PositionSlot({ posKey, playerId, players, onClick, onClear }: PositionSlotProps) {
  const player = playerId ? players.find(p => p.id === playerId) : undefined;
  const label = POSITION_SHORT[posKey];
  const fullLabel = POSITION_LABELS[posKey];

  return (
    <div className={`position-slot${player ? ' filled' : ' empty'}`} title={fullLabel}>
      {player ? (
        <div className="slot-filled">
          <div className="slot-avatar">
            {player.photoUrl ? (
              <img src={player.photoUrl} alt="" className="slot-avatar-img" />
            ) : (
              <span className="slot-number">{player.number}</span>
            )}
          </div>
          <div className="slot-player-name">
            {player.firstName.charAt(0)}. {player.lastName.toUpperCase()}
          </div>
          <div className="slot-pos-badge">{label}</div>
          <button
            className="slot-clear-btn"
            onClick={(e) => { e.stopPropagation(); onClear(posKey); }}
            aria-label="Spieler entfernen"
          >
            ✕
          </button>
        </div>
      ) : (
        <button className="slot-empty-btn" onClick={() => onClick(posKey)}>
          <span className="slot-pos-label">{label}</span>
          <span className="slot-add-icon">+</span>
        </button>
      )}
    </div>
  );
}

interface Props {
  starters: LineupStarters;
  players: Player[];
  onSlotClick: (posKey: PositionKey) => void;
  onSlotClear: (posKey: PositionKey) => void;
}

export default function FieldView({ starters, players, onSlotClick, onSlotClear }: Props) {
  return (
    <div className="field-container">
      <div className="field">
        {/* Field markings */}
        <div className="field-center-circle" />
        <div className="field-center-line" />
        <div className="field-penalty-top" />
        <div className="field-penalty-bottom" />
        <div className="field-label">AUFSTELLUNG</div>

        {/* Formation 1-3-3: GK → 3 defenders (libero slightly higher) → 3 midfielders */}
        <div className="field-row field-row-mid">
          <PositionSlot posKey="leftWing" playerId={starters.leftWing} players={players}
            onClick={onSlotClick} onClear={onSlotClear} />
          <PositionSlot posKey="striker" playerId={starters.striker} players={players}
            onClick={onSlotClick} onClear={onSlotClear} />
          <PositionSlot posKey="rightWing" playerId={starters.rightWing} players={players}
            onClick={onSlotClick} onClear={onSlotClear} />
        </div>

        <div className="field-row field-row-defense">
          <PositionSlot posKey="leftDefense" playerId={starters.leftDefense} players={players}
            onClick={onSlotClick} onClear={onSlotClear} />
          <PositionSlot posKey="centerDefense" playerId={starters.centerDefense} players={players}
            onClick={onSlotClick} onClear={onSlotClear} />
          <PositionSlot posKey="rightDefense" playerId={starters.rightDefense} players={players}
            onClick={onSlotClick} onClear={onSlotClear} />
        </div>

        <div className="field-row field-row-gk">
          <PositionSlot posKey="goalkeeper" playerId={starters.goalkeeper} players={players}
            onClick={onSlotClick} onClear={onSlotClear} />
        </div>
      </div>
    </div>
  );
}
