import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doc, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import i18n from '../i18n/index';
import logoSvg from '../assets/logo.svg';
import './TeamSetup.css';

const LANG_OPTIONS = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function slugExists(slug: string): Promise<boolean> {
  const ref = doc(collection(doc(db, 'teams', slug), 'roster'), 'players');
  const snap = await getDoc(ref);
  return snap.exists();
}

export default function TeamSetup() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('setupLang') || 'de');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const slug = slugify(input);
  const isValid = slug.length >= 2;

  const handleLangChange = (code: string) => {
    setLang(code);
    localStorage.setItem('setupLang', code);
    i18n.changeLanguage(code);
  };

  const handleGo = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      const exists = await slugExists(slug);
      if (exists) {
        navigate(`/${slug}/editor`);
      } else {
        setConfirmNew(true);
      }
    } catch {
      navigate(`/${slug}/editor`);
    } finally {
      setLoading(false);
    }
  };

  const langSwitcher = (
    <div className="setup-lang-switcher">
      {LANG_OPTIONS.map(opt => (
        <button
          key={opt.code}
          className={`setup-lang-btn${lang === opt.code ? ' active' : ''}`}
          onClick={() => handleLangChange(opt.code)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  if (confirmNew) {
    return (
      <div className="setup-root">
        <div className="setup-card">
          <div className="setup-logo">
            <img src={logoSvg} alt="Logo" />
          </div>
          <h1 className="setup-title">{t('setup_title')}</h1>

          <div className="setup-confirm">
            <p className="setup-confirm-text">
              {t('setup_confirm_not_exist', { slug })}
            </p>
            <p className="setup-confirm-sub">
              {t('setup_confirm_check')}
            </p>
          </div>

          <div className="setup-actions">
            <button
              className="btn btn-primary btn-lg setup-btn"
              onClick={() => navigate(`/${slug}/editor?tab=settings`)}
            >
              {t('setup_btn_create_new')}
            </button>
            <button
              className="btn btn-outline btn-lg setup-btn"
              onClick={() => setConfirmNew(false)}
            >
              {t('setup_btn_back')}
            </button>
          </div>

          {langSwitcher}
        </div>
      </div>
    );
  }

  return (
    <div className="setup-root">
      <div className="setup-card">
        <div className="setup-logo">
          <img src={logoSvg} alt="Logo" />
        </div>
        <h1 className="setup-title">{t('setup_title')}</h1>
        <p className="setup-subtitle">{t('setup_subtitle')}</p>

        <div className="form-group">
          <label className="form-label">{t('setup_label_slug')}</label>
          <input
            className="form-input setup-input"
            value={input}
            onChange={e => { setInput(e.target.value); setConfirmNew(false); }}
            placeholder={t('setup_placeholder_slug')}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleGo(); }}
          />
        </div>

        <div className="setup-warning">
          <strong>{t('setup_warning_prefix')}</strong> {t('setup_warning_text')}
        </div>

        <div className="setup-actions">
          <button
            className="btn btn-primary btn-lg setup-btn"
            disabled={!isValid || loading}
            onClick={handleGo}
          >
            {loading ? t('setup_btn_checking') : t('setup_btn_continue')}
          </button>
        </div>

        <p className="setup-hint">{t('setup_hint')}</p>

        {langSwitcher}
      </div>
    </div>
  );
}