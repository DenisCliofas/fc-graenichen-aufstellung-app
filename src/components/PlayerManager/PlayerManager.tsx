import { useState } from 'react';
import { Player } from '../../types';
import PhotoCropper from '../PhotoCropper/PhotoCropper';
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
  if (player.photoUrl) {
    return (
      <img
        className="player-avatar player-avatar-photo"
        src={player.photoUrl}
        alt={`${player.firstName} ${player.lastName}`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }
  return (
    <div className="player-avatar player-avatar-number">
      <span>{player.number}</span>
    </div>
  );
}

export default function PlayerManager({ players, onUpdatePlayers }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  // 'add' | 'edit' | null — which form is opening the cropper
  const [cropperTarget, setCropperTarget] = useState<'add' | 'edit' | null>(null);

  const sortedPlayers = [...players].sort((a, b) => a.number - b.number);

  const validateForm = (f: typeof EMPTY_FORM): string => {
    if (!f.firstName.trim()) return 'Vorname ist erforderlich.';
    if (!f.lastName.trim()) return 'Nachname ist erforderlich.';
    const num = parseInt(f.number);
    if (isNaN(num) || num < 1 || num > 99) return 'Nummer muss zwischen 1 und 99 liegen.';
    return '';
  };

  const handleAddPlayer = () => {
    const err = validateForm(form);
    if (err) { setFormError(err); return; }
    const numVal = parseInt(form.number);
    if (players.some(p => p.number === numVal)) {
      setFormError(`Nummer ${numVal} ist bereits vergeben.`);
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
      <h2 className="section-heading">Spieler verwalten</h2>

      {/* Add Player Form */}
      <div className="add-player-card card">
        <h3 className="add-player-title">Spieler hinzufügen</h3>
        {formError && <div className="form-error">{formError}</div>}
        <div className="add-player-form">
          <div className="form-group">
            <label className="form-label">Vorname</label>
            <input
              className="form-input"
              type="text"
              placeholder="z.B. Luca"
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nachname</label>
            <input
              className="form-input"
              type="text"
              placeholder="z.B. Müller"
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nummer</label>
            <input
              className="form-input"
              type="number"
              placeholder="1–99"
              min={1}
              max={99}
              value={form.number}
              onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
            />
          </div>
          <div className="form-group form-group-wide">
            <label className="form-label">Foto (optional)</label>
            <div className="photo-field">
              {form.photoUrl && (
                <img src={form.photoUrl} alt="" className="photo-thumb" />
              )}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCropperTarget('add')}>
                {form.photoUrl ? '✎ Foto ändern' : '📷 Foto hochladen'}
              </button>
              {form.photoUrl && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setForm(f => ({ ...f, photoUrl: '' }))}>
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="form-group form-group-wide">
            <label className="form-label">Notizen (optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="z.B. Torhüter, Kapitän..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="add-player-btn-row">
            <button className="btn btn-primary btn-lg" onClick={handleAddPlayer}>
              + Spieler hinzufügen
            </button>
          </div>
        </div>
      </div>

      {/* Player Count */}
      <div className="player-count">
        <span className="badge">{players.length}</span>
        <span>Spieler im Kader</span>
      </div>

      {/* Player List */}
      <div className="player-list">
        {sortedPlayers.length === 0 && (
          <div className="empty-state">Noch keine Spieler vorhanden. Füge oben Spieler hinzu.</div>
        )}
        {sortedPlayers.map(player => (
          <div key={player.id} className="player-row card">
            {editingId === player.id ? (
              <div className="player-edit-form">
                <PlayerAvatar player={player} />
                <div className="edit-fields">
                  <div className="edit-fields-row">
                    <div className="form-group">
                      <label className="form-label">Vorname</label>
                      <input className="form-input" type="text" value={editForm.firstName}
                        onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nachname</label>
                      <input className="form-input" type="text" value={editForm.lastName}
                        onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                    <div className="form-group form-group-num">
                      <label className="form-label">Nr.</label>
                      <input className="form-input" type="number" min={1} max={99} value={editForm.number}
                        onChange={e => setEditForm(f => ({ ...f, number: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label className="form-label">Foto</label>
                      <div className="photo-field">
                        {editForm.photoUrl && <img src={editForm.photoUrl} alt="" className="photo-thumb" />}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCropperTarget('edit')}>
                          {editForm.photoUrl ? '✎ Foto ändern' : '📷 Foto hochladen'}
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
                    <label className="form-label">Notizen</label>
                    <input className="form-input" type="text" value={editForm.notes}
                      onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <div className="edit-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(player.id)}>
                      ✓ Speichern
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                      Abbrechen
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
                      <span className="delete-confirm-text">Löschen?</span>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(player.id)}>
                        Ja
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirmId(null)}>
                        Nein
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(player)}>
                        ✎ Bearbeiten
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmId(player.id)}>
                        ✕ Löschen
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
