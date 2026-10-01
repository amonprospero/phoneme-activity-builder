'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [health, setHealth] = useState(null);
  const [msg, setMsg] = useState('');

  async function refresh() {
    const [summary, h] = await Promise.all([
      fetch('/api/metrics/summary').then((r) => r.json()),
      fetch('/health').then((r) => r.json()),
    ]);
    setData(summary);
    setHealth(h);
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 8000);
    return () => clearInterval(t);
  }, []);

  async function simulate() {
    setMsg('Adding simulated records...');
    await fetch('/api/simulate', { method: 'POST' });
    await refresh();
    setMsg('Simulated activity set and usage events saved.');
  }

  if (!data) return <p>Loading dashboard…</p>;

  return (
    <div>
      <h1>Operations dashboard</h1>
      <p>
        This page reads stored activity sets and usage events. It is the reporting view
        for Assessment 3. Numbers refresh every few seconds.
      </p>

      <div className={styles.actions}>
        <button type="button" className="btn" onClick={simulate}>
          Add simulated records
        </button>
        <button type="button" className="btn btn-secondary" onClick={refresh}>
          Refresh metrics
        </button>
        <a className="btn btn-secondary" href="/health">Open /health</a>
      </div>
      {msg && <p className={`${styles.alert} ${styles.ok}`}>{msg}</p>}

      <h2>Health and alerts</h2>
      <p className={`${styles.alert} ${health?.status === 'ok' ? styles.ok : styles.warning}`}>
        Health: {health?.status || 'unknown'} · database {health?.database || 'n/a'}
      </p>
      {(data.alerts || []).length === 0 && (
        <p className={`${styles.alert} ${styles.ok}`}>No operational warnings right now.</p>
      )}
      {(data.alerts || []).map((a, i) => (
        <p key={i} className={`${styles.alert} ${a.level === 'error' ? styles.error : styles.warning}`}>
          {a.message}
        </p>
      ))}

      <h2>Usage statistics</h2>
      <div className={styles.grid}>
        <div className={styles.card}><h3>Wordle sets</h3><div className={styles.value}>{data.wordleSets}</div></div>
        <div className={styles.card}><h3>Word Search sets</h3><div className={styles.value}>{data.searchSets}</div></div>
        <div className={styles.card}><h3>Saved words</h3><div className={styles.value}>{data.wordCount}</div></div>
        <div className={styles.card}><h3>Most used type</h3><div className={styles.value}>{data.mostUsedActivity}</div></div>
        <div className={styles.card}><h3>Successful HTML</h3><div className={styles.value}>{data.successCount}</div></div>
        <div className={styles.card}><h3>Failed HTML</h3><div className={styles.value}>{data.failedCount}</div></div>
        <div className={styles.card}><h3>Avg time on page</h3><div className={styles.value}>{data.avgTimeOnPageSec}s</div></div>
        <div className={styles.card}><h3>Empty sets</h3><div className={styles.value}>{data.emptySets}</div></div>
      </div>

      <h2>Recent events</h2>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Kind</th>
              <th>Path</th>
              <th>Type</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {(data.recentEvents || []).map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.createdAt).toLocaleString()}</td>
                <td>{e.kind}</td>
                <td>{e.path}</td>
                <td>{e.activityType || '—'}</td>
                <td>{e.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
