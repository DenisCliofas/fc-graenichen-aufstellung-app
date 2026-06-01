import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../../types';
import { avatarSrc } from '../../utils/avatar';
import './PlayerSelectModal.css';

interface Props {
  players: Player[];
  assignedIds: Set<string>;
  onSelect: (playerId: string) => void;
  onClose: () => void;
  title?: string;
}

export default function PlayerSelectModal({ players, assignedIds, onSelect, onClose, title }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = players.filter(p => {
    const q = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      String(p.number).includes(q)
    );
  });

  const sortedFiltered = [...filtered].sort((a, b) => a.number - b.number);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">{title ?? t('modal_player_select')}</h3>
          <button className="modal-close" onClick={onClose} aria-label={t('modal_close_label')}>✕</button>
        </div>
        <div className="modal-search">
          <input
            className="form-input modal-search-input"
            type="text"
            placeholder={t('modal_search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-player-list">
          {sortedFiltered.length === 0 && (
            <div className="modal-empty">{t('modal_empty')}</div>
          )}
          {sortedFiltered.map(player => {
            const isAssigned = assignedIds.has(player.id);
            return (
              <button
                key={player.id}
                className={`modal-player-row${isAssigned ? ' assigned' : ''}`}
                onClick={() => !isAssigned && onSelect(player.id)}
                disabled={isAssigned}
              >
                <div className={`modal-avatar${isAssigned ? ' assigned' : ''}`}>
                  <img src={avatarSrc(player.photoUrl)} alt="" className="modal-avatar-img" />
                </div>
                <div className="modal-player-info">
                  <span className="modal-player-name">
                    {player.firstName} <strong>{player.lastName.toUpperCase()}</strong>
                  </span>
                  {player.notes && (
                    <span className="modal-player-notes">{player.notes}</span>
                  )}
                </div>
                {isAssigned && <span className="modal-assigned-badge">{t('modal_assigned_badge')}</span>}
              </button>
            );
          })}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('btn_cancel')}</button>
        </div>
      </div>
    </div>
  );
}
