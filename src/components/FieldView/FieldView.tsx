import { useTranslation } from 'react-i18next';
import { Player, LineupStarters, PositionKey } from '../../types';
import { FormationConfig, PositionDef } from '../../formations';
import { avatarSrc } from '../../utils/avatar';
import './FieldView.css';

interface PositionSlotProps {
  positionDef: PositionDef;
  playerId?: string;
  players: Player[];
  onClick: (posKey: PositionKey) => void;
  onClear: (posKey: PositionKey) => void;
}

function PositionSlot({ positionDef, playerId, players, onClick, onClear }: PositionSlotProps) {
  const { t } = useTranslation();
  const player = playerId ? players.find(p => p.id === playerId) : undefined;
  const label = positionDef.short;
  const fullLabel = t(positionDef.labelKey);

  return (
    <div className={`position-slot${player ? ' filled' : ' empty'}`} title={fullLabel}>
      {player ? (
        <div className="slot-filled" onClick={() => onClick(positionDef.key)} style={{ cursor: 'pointer' }}>
          <div className="slot-avatar">
            <img src={avatarSrc(player.photoUrl)} alt="" className="slot-avatar-img" />
          </div>
          <div className="slot-player-name">
            {player.firstName.charAt(0)}. {player.lastName.toUpperCase()}
          </div>
          <div className="slot-pos-badge">{label}</div>
          <button
            className="slot-clear-btn"
            onClick={(e) => { e.stopPropagation(); onClear(positionDef.key); }}
            aria-label={t('remove_player')}
          >
            ✕
          </button>
        </div>
      ) : (
        <button className="slot-empty-btn" onClick={() => onClick(positionDef.key)}>
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
  formation: FormationConfig;
  onSlotClick: (posKey: PositionKey) => void;
  onSlotClear: (posKey: PositionKey) => void;
}

export default function FieldView({ starters, players, formation, onSlotClick, onSlotClear }: Props) {
  const { t } = useTranslation();
  const positionedSlots = [...formation.rows]
    .reverse()
    .flatMap((row) => row.map((positionDef) => ({ positionDef, isWide: row.length >= 4 })));

  return (
    <div className="field-container">
      <div className="field field--absolute">
        {/* Field markings */}
        <div className="field-center-circle" />
        <div className="field-center-line" />
        <div className="field-penalty-top" />
        <div className="field-penalty-bottom" />
        <div className="field-label">{t('field_label')}</div>

        {positionedSlots.map(({ positionDef, isWide }) => (
          <div
            key={positionDef.key}
            className={`field-position${isWide ? ' field-position--wide' : ''}`}
            style={{ top: `${positionDef.fieldPos[0]}%`, left: `${positionDef.fieldPos[1]}%` }}
          >
            <PositionSlot
              positionDef={positionDef}
              playerId={starters[positionDef.key]}
              players={players}
              onClick={onSlotClick}
              onClear={onSlotClear}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
