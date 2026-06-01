import { TeamSettings } from '../types';

function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function applySettings(s: TeamSettings) {
  const root = document.documentElement;
  root.style.setProperty('--yellow', s.primaryColor);
  root.style.setProperty('--yellow-dark', s.primaryColor + 'cc');

  // Text on primary-colored backgrounds
  const primaryLum = luminance(s.primaryColor);
  const primaryIsLight = primaryLum > 0.179;
  root.style.setProperty('--on-primary', primaryIsLight ? '#111111' : '#ffffff');

  // --black used for all body text: keep dark even if secondary is light
  const secondaryIsLight = luminance(s.secondaryColor) > 0.15;
  root.style.setProperty('--black', secondaryIsLight ? '#111111' : s.secondaryColor);
  root.style.setProperty('--secondary-brand', s.secondaryColor);

  // Surface flips to dark only for very light primaries (near-white) — threshold 0.85
  // Yellow (#FFD400) ≈ 0.72 → stays white. Pure white = 1.0 → dark mode.
  if (primaryLum > 0.85) {
    root.style.setProperty('--surface', '#1a1a1a');
    root.style.setProperty('--surface-raised', '#242424');
    root.style.setProperty('--on-surface', '#f0f0f0');
    root.style.setProperty('--border-color-themed', '#333333');
  } else {
    root.style.setProperty('--surface', '#ffffff');
    root.style.setProperty('--surface-raised', '#ffffff');
    root.style.setProperty('--on-surface', '#111111');
    root.style.setProperty('--border-color-themed', '#e0e0e0');
  }
}
