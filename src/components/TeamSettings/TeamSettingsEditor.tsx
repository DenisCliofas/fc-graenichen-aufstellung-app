import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TeamSettings } from '../../types';
import './TeamSettingsEditor.css';

interface Props {
  settings: TeamSettings;
  onSave: (settings: TeamSettings) => void;
}

export default function TeamSettingsEditor({ settings, onSave }: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<TeamSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof TeamSettings>(key: K, value: TeamSettings[K]) => {
    setSaved(false);
    setDraft(d => ({ ...d, [key]: value }));
  };

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      set('logoUrl', result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="tsed-root">
      <h2 className="section-heading">{t('settings_title')}</h2>

      <div className="tsed-form">
        <div className="tsed-section-label">{t('settings_section_team')}</div>

        <div className="form-group">
          <label className="form-label">{t('settings_teamname')}</label>
          <input
            className="form-input"
            value={draft.teamName}
            onChange={e => set('teamName', e.target.value)}
            placeholder="FC Gränichen"
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('settings_shortname')}</label>
          <input
            className="form-input"
            value={draft.shortName}
            onChange={e => set('shortName', e.target.value)}
            placeholder="FCG"
            maxLength={6}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('settings_website')}</label>
          <input
            className="form-input"
            type="url"
            value={draft.website || ''}
            onChange={e => set('website', e.target.value || undefined)}
            placeholder="https://www.fc-example.ch"
          />
        </div>

        <div className="tsed-section-label">{t('settings_section_colors')}</div>

        <div className="tsed-color-row">
          <div className="form-group tsed-color-group">
            <label className="form-label">{t('settings_primary_color')}</label>
            <div className="tsed-color-input-wrap">
              <input
                type="color"
                className="tsed-color-swatch"
                value={draft.primaryColor}
                onChange={e => set('primaryColor', e.target.value)}
              />
              <input
                className="form-input tsed-color-hex"
                value={draft.primaryColor}
                onChange={e => set('primaryColor', e.target.value)}
                placeholder="#FFD400"
                maxLength={7}
              />
            </div>
          </div>

          <div className="form-group tsed-color-group">
            <label className="form-label">{t('settings_secondary_color')}</label>
            <div className="tsed-color-input-wrap">
              <input
                type="color"
                className="tsed-color-swatch"
                value={draft.secondaryColor}
                onChange={e => set('secondaryColor', e.target.value)}
              />
              <input
                className="form-input tsed-color-hex"
                value={draft.secondaryColor}
                onChange={e => set('secondaryColor', e.target.value)}
                placeholder="#050505"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        <div className="tsed-section-label">{t('settings_section_logo')}</div>

        <div className="tsed-logo-row">
          <div className="tsed-logo-preview" style={{ background: draft.primaryColor }}>
            {draft.logoUrl ? (
              <img src={draft.logoUrl} alt="Logo" />
            ) : (
              <span className="tsed-logo-placeholder">?</span>
            )}
          </div>
          <div className="tsed-logo-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
              {t('settings_logo_upload')}
            </button>
            {draft.logoUrl && (
              <button className="btn btn-danger btn-sm" onClick={() => set('logoUrl', undefined)}>
                {t('settings_logo_remove')}
              </button>
            )}
            <p className="tsed-logo-hint">{t('settings_logo_hint')}</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleLogoUpload}
          />
        </div>

        <div className="tsed-section-label">{t('settings_section_size')}</div>
        <div className="form-group">
          <label className="form-label">{t('settings_player_count')}</label>
          <div className="tsed-size-toggle">
            {([7, 9, 11] as const).map(n => (
              <button
                key={n}
                type="button"
                className={`tsed-size-btn${(draft.playerCount ?? 11) === n ? ' active' : ''}`}
                onClick={() => set('playerCount', n)}
              >
                {n}v{n}
              </button>
            ))}
          </div>
        </div>

        <div className="tsed-section-label">{t('settings_language')}</div>
        <div className="form-group">
          <label className="form-label">{t('settings_language')}</label>
          <select
            className="form-input"
            value={draft.language || 'de'}
            onChange={e => set('language', e.target.value)}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
        </div>

        <div className="tsed-preview-bar" style={{ background: draft.primaryColor, color: draft.secondaryColor }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '3px' }}>
            {draft.teamName.toUpperCase()}
          </span>
        </div>

        <div className="tsed-actions">
          <button className="btn btn-primary btn-lg" onClick={handleSave}>
            {saved ? t('settings_saved') : t('settings_save')}
          </button>
        </div>
      </div>
    </div>
  );
}
