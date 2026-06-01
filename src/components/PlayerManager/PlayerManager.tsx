import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../../types';
import PhotoCropper from '../PhotoCropper/PhotoCropper';
import { avatarSrc } from '../../utils/avatar';
import './PlayerManager.css';

interface Props {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  number: '',
  photoUrl: '',
  notes: '',
};

function generateId(): string {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function PlayerAvatar({ player }: { player: Player }) {
  return (
    <img
      className="player-avatar player-avatar-photo"
      src={avatarSrc(player.photoUrl)}
      alt={`${player.firstName} ${player.lastName}`}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

export default function PlayerManager({ players, onUpdatePlayers }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  // 'add' | 'edit' | null — which form is opening the cropper
  const [cropperTarget, setCropperTarget] = useState<'add' | 'edit' | null>(null);

  const sortedPlayers = [...players].sort((a, b) => a.number - b.number);

  const validateForm = (f: typeof EMPTY_FORM): string => {
    if (!f.firstName.trim()) return t('error_firstname_required');
    if (!f.lastName.trim()) return t('error_lastname_required');
    const num = parseInt(f.number);
    if (isNaN(num) || num < 1 || num > 99) return t('error_number_range');
    return '';
  };

  const handleAddPlayer = () => {
    const err = validateForm(form);
    if (err) { setFormError(err); return; }
    const numVal = parseInt(form.number);
    if (players.some(p => p.number === numVal)) {
      setFormError(t('error_number_taken', { num: numVal }));
      return;
    }
    const newPlayer: Player = {
      id: generateId(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      number: numVal,
      photoUrl: form.photoUrl.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };
    onUpdatePlayers([...players, newPlayer]);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleStartEdit = (player: Player) => {
    setEditingId(player.id);
    setEditForm({
      firstName: player.firstName,
      lastName: player.lastName,
      number: String(player.number),
      photoUrl: player.photoUrl ?? '',
      notes: player.notes ?? '',
    });
  };

  const handleSaveEdit = (id: string) => {
    const err = validateForm(editForm);
    if (err) return;
    const numVal = parseInt(editForm.number);
    if (players.some(p => p.number === numVal && p.id !== id)) return;
    onUpdatePlayers(players.map(p =>
      p.id === id
        ? {
            ...p,
            firstName: editForm.firstName.trim(),
            lastName: editForm.lastName.trim(),
            number: numVal,
            photoUrl: editForm.photoUrl.trim() || undefined,
            notes: editForm.notes.trim() || undefined,
          }
        : p
    ));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onUpdatePlayers(players.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="player-manager">
      <h2 className="section-heading">{t('player_manage')}</h2>

      {/* Add Player Form */}
      <div className="add-player-card card">
        <h3 className="add-player-title">{t('player_add_title')}</h3>
        {formError && <div className="form-error">{formError}</div>}
        <div className="add-player-form">
          <div className="form-group">
            <label className="form-label">{t('label_firstname')}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t('placeholder_firstname_player')}
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('label_lastname')}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t('placeholder_lastname_player')}
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('label_number')}</label>
            <input
              className="form-input"
              type="number"
              placeholder={t('placeholder_number')}
              min={1}
              max={99}
              value={form.number}
              onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
            />
          </div>
          <div className="form-group form-group-wide">
            <label className="form-label">{t('label_photo_optional')}</label>
            <div className="photo-field">
              {form.photoUrl && (
                <img src={form.photoUrl} alt="" className="photo-thumb" />
              )}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCropperTarget('add')}>
                {form.photoUrl ? t('photo_change') : t('photo_upload')}
              </button>
              {form.photoUrl && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setForm(f => ({ ...f, photoUrl: '' }))}>
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="form-group form-group-wide">
            <label className="form-label">{t('label_notes_optional')}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t('placeholder_notes_player')}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="add-player-btn-row">
            <button className="btn btn-primary btn-lg" onClick={handleAddPlayer}>
              {t('player_add_btn')}
            </button>
          </div>
        </div>
      </div>

      {/* Player Count */}
      <div className="player-count">
        <span className="badge">{players.length}</span>
        <span>{t('player_count')}</span>
      </div>

      {/* Player List */}
      <div className="player-list">
        {sortedPlayers.length === 0 && (
          <div className="empty-state">{t('player_empty')}</div>
        )}
        {sortedPlayers.map(player => (
          <div key={player.id} className="player-row card">
            {editingId === player.id ? (
              <div className="player-edit-form">
                <PlayerAvatar player={player} />
                <div className="edit-fields">
                  <div className="edit-fields-row">
                    <div className="form-group">
                      <label className="form-label">{t('label_firstname')}</label>
                      <input className="form-input" type="text" value={editForm.firstName}
                        onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('label_lastname')}</label>
                      <input className="form-input" type="text" value={editForm.lastName}
                        onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                    <div className="form-group form-group-num">
                      <label className="form-label">{t('label_number_short')}</label>
                      <input className="form-input" type="number" min={1} max={99} value={editForm.number}
                        onChange={e => setEditForm(f => ({ ...f, number: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label className="form-label">{t('label_photo')}</label>
                      <div className="photo-field">
                        {editForm.photoUrl && <img src={editForm.photoUrl} alt="" className="photo-thumb" />}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCropperTarget('edit')}>
                          {editForm.photoUrl ? t('photo_change') : t('photo_upload')}
                        </button>
                        {editForm.photoUrl && (
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => setEditForm(f => ({ ...f, photoUrl: '' }))}>
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('label_notes')}</label>
                    <input className="form-input" type="text" value={editForm.notes}
                      onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <div className="edit-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(player.id)}>
                      {t('btn_save')}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                      {t('btn_cancel')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="player-row-content">
                <PlayerAvatar player={player} />
                <div className="player-info">
                  <div className="player-name">
                    {player.firstName} <strong>{player.lastName}</strong>
                  </div>
                  {player.notes && <div className="player-notes">{player.notes}</div>}
                </div>
                <div className="player-actions">
                  {deleteConfirmId === player.id ? (
                    <>
                      <span className="delete-confirm-text">{t('confirm_delete')}</span>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(player.id)}>
                        {t('confirm_yes')}
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirmId(null)}>
                        {t('confirm_no')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(player)}>
                        {t('btn_edit')}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmId(player.id)}>
                        {t('btn_delete')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Photo Cropper Modal */}
      {cropperTarget && (
        <PhotoCropper
          existingPhoto={cropperTarget === 'add' ? form.photoUrl || undefined : editForm.photoUrl || undefined}
          onSave={(dataUrl) => {
            if (cropperTarget === 'add') setForm(f => ({ ...f, photoUrl: dataUrl }));
            else setEditForm(f => ({ ...f, photoUrl: dataUrl }));
            setCropperTarget(null);
          }}
          onCancel={() => setCropperTarget(null)}
        />
      )}
    </div>
  );
}
