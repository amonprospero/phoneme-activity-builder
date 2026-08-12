'use client';

import { useTheme } from '../../components/ThemeProvider';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <p className={styles.desc}>
        Interface preferences. Theme choice is saved in a cookie so it stays when you come back.
      </p>

      <div className="panel" style={{ maxWidth: 420 }}>
        <div className="form-group">
          <label>Colour theme</label>
          <div className={styles.themeRow}>
            <button
              type="button"
              className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
              onClick={() => setTheme('light')}
            >
              Light mode
            </button>
            <button
              type="button"
              className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dark mode
            </button>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 20 }}>
          <label>Current theme</label>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>
            {theme === 'light' ? 'Light' : 'Dark'} (stored in cookie named “theme”)
          </p>
        </div>

        <p className={styles.note}>
          More layout options can be added later. For Assessment 1 we keep it simple so the UI
          stays clear for teachers.
        </p>
      </div>
    </div>
  );
}
