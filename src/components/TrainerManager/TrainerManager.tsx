import { useState } from 'react';
import { Trainer } from '../../types';
import PhotoCropper from '../PhotoCropper/PhotoCropper';
import '../PlayerManager/PlayerManager.css';

interface Props {
  trainers: Trainer[];
  onUpdateTrainers: (trainers: Trainer[]) => void;
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  role: '',
  photoUrl: '',
  notes: '',
};

function generateId(): string {
  return 'tr' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function TrainerAvatar({ trainer }: { trainer: Trainer }) {
  if (trainer.photoUrl) {
    return (
      <img
        className="player-avatar player-avatar-photo"
        src={trainer.photoUrl}
        alt={`${trainer.firstName} ${trainer.lastName}`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return (
    <div className="player-avatar player-avatar-number">
      <span>🎽</span>
    </div>
  );
}

export default function TrainerManager({ trainers, onUpdateTrainers }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [cropperTarget, setCropperTarget] = useState<'add' | 'edit' | null>(null);

  const sortedTrainers = [...trainers].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );

  const validateForm = (f: typeof EMPTY_FORM): string => {
    if (!f.firstName.trim()) return 'Vorname ist erforderlich.';
    if (!f.lastName.trim()) return 'Nachname ist erforderlich.';
    return '';
  };

  const handleAddTrainer = () => {
    const err = validateForm(form);
    if (err) { setFormError(err); return; }
    const newTrainer: Trainer = {
      id: generateId(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      role: form.role.trim() || undefined,
      photoUrl: form.photoUrl || undefined,
      notes: form.notes.trim() || undefined,
    };
    onUpdateTrainers([...trainers, newTrainer]);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleStartEdit = (trainer: Trainer) => {
    setEditingId(trainer.id);
    setEditForm({
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      role: trainer.role ?? '',
      photoUrl: trainer.photoUrl ?? '',
      notes: trainer.notes ?? '',
    });
  };

  const handleSaveEdit = (id: string) => {
    const err = validateForm(editForm);
    if (err) return;
    onUpdateTrainers(trainers.map(t =>
      t.id === id
        ? {
            ...t,
            firstName: editForm.firstName.trim(),
            lastName: editForm.lastName.trim(),
            role: editForm.role.trim() || undefined,
            photoUrl: editForm.photoUrl || undefined,
            notes: editForm.notes.trim() || undefined,
          }
        : t
    ));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onUpdateTrainers(trainers.filter(t => t.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="player-manager">
      <h2 className="section-heading">Trainer verwalten</h2>

      <div className="add-player-card card">
        <h3 className="add-player-title">Trainer hinzufügen</h3>
        {formError && <div className="form-error">{formError}</div>}
        <div className="add-player-form">
          <div className="form-group">
            <label className="form-label">Vorname</label>
            <input className="form-input" type="text" placeholder="z.B. Markus"
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddTrainer()} />
          </div>
          <div className="form-group">
            <label className="form-label">Nachname</label>
            <input className="form-input" type="text" placeholder="z.B. Müller"
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddTrainer()} />
          </div>
          <div className="form-group">
            <label className="form-label">Rolle (optional)</label>
            <input className="form-input" type="text" placeholder="z.B. Haupttrainer"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddTrainer()} />
          </div>
          <div className="form-group form-group-wide">
            <label className="form-label">Foto (optional)</label>
            <div className="photo-field">
              {form.photoUrl && <img src={form.photoUrl} alt="" className="photo-thumb" />}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCropperTarget('add')}>
                {form.photoUrl ? '✎ Foto ändern' : '📷 Foto hochladen'}
              </button>
              {form.photoUrl && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setForm(f => ({ ...f, photoUrl: '' }))}>✕</button>
              )}
            </div>
          </div>
          <div className="form-group form-group-wide">
            <label className="form-label">Notizen (optional)</label>
            <input className="form-input" type="text" placeholder="z.B. Torwarttrainer..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="add-player-btn-row">
            <button className="btn btn-primary btn-lg" onClick={handleAddTrainer}>
              + Trainer hinzufügen
            </button>
          </div>
        </div>
      </div>

      <div className="player-count">
        <span className="badge">{trainers.length}</span>
        <span>Trainer im Stab</span>
      </div>

      <div className="player-list">
        {sortedTrainers.length === 0 && (
          <div className="empty-state">Noch keine Trainer vorhanden.</div>
        )}
        {sortedTrainers.map(trainer => (
          <div key={trainer.id} className="player-row card">
            {editingId === trainer.id ? (
              <div className="player-edit-form">
                <TrainerAvatar trainer={trainer} />
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
                    <div className="form-group">
                      <label className="form-label">Rolle</label>
                      <input className="form-input" type="text" value={editForm.role}
                        onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label className="form-label">Foto</label>
                      <div className="photo-field">
                        {editForm.photoUrl && <img src={editForm.photoUrl} alt="" className="photo-thumb" />}
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCropperTarget('edit')}>
                          {editForm.photoUrl ? '✎ Foto ändern' : '📷 Foto hochladen'}
                        </button>
                        {editForm.photoUrl && (
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => setEditForm(f => ({ ...f, photoUrl: '' }))}>✕</button>
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
                    <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(trainer.id)}>✓ Speichern</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Abbrechen</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="player-row-content">
                <TrainerAvatar trainer={trainer} />
                <div className="player-info">
                  <div className="player-name">
                    {trainer.firstName} <strong>{trainer.lastName}</strong>
                  </div>
                  {trainer.role && <div className="player-notes">{trainer.role}</div>}
                  {trainer.notes && <div className="player-notes">{trainer.notes}</div>}
                </div>
                <div className="player-actions">
                  {deleteConfirmId === trainer.id ? (
                    <>
                      <span className="delete-confirm-text">Löschen?</span>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(trainer.id)}>Ja</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirmId(null)}>Nein</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(trainer)}>✎ Bearbeiten</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmId(trainer.id)}>✕ Löschen</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

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
