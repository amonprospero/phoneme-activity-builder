'use client';

import { useEffect, useState } from 'react';
import styles from './words.module.css';

const emptySet = {
  title: '',
  activityType: 'WORDLE',
  difficulty: 'easy',
  showHints: true,
  maxGuesses: 6,
  gridRows: 10,
  gridCols: 10,
  notes: '',
};

export default function WordsPage() {
  const [sets, setSets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptySet);
  const [wordForm, setWordForm] = useState({ english: '', phonemeString: '' });
  const [editingWord, setEditingWord] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function load() {
    const res = await fetch('/api/activities');
    const data = await res.json();
    setSets(data);
    if (selected) {
      const fresh = data.find((s) => s.id === selected.id);
      setSelected(fresh || null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function saveSet(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    const method = selected ? 'PUT' : 'POST';
    const url = selected ? `/api/activities/${selected.id}` : '/api/activities';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        maxGuesses: Number(form.maxGuesses),
        gridRows: Number(form.gridRows),
        gridCols: Number(form.gridCols),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Save failed');
      return;
    }
    setInfo(selected ? 'Activity set updated.' : 'Activity set created.');
    setSelected(data);
    setForm({
      title: data.title,
      activityType: data.activityType,
      difficulty: data.difficulty,
      showHints: data.showHints,
      maxGuesses: data.maxGuesses,
      gridRows: data.gridRows,
      gridCols: data.gridCols,
      notes: data.notes,
    });
    load();
  }

  async function deleteSet(id) {
    if (!confirm('Delete this activity set and all its words?')) return;
    await fetch(`/api/activities/${id}`, { method: 'DELETE' });
    setSelected(null);
    setForm(emptySet);
    setInfo('Activity set deleted.');
    load();
  }

  function pick(set) {
    setSelected(set);
    setError('');
    setForm({
      title: set.title,
      activityType: set.activityType,
      difficulty: set.difficulty,
      showHints: set.showHints,
      maxGuesses: set.maxGuesses,
      gridRows: set.gridRows,
      gridCols: set.gridCols,
      notes: set.notes || '',
    });
  }

  async function saveWord(e) {
    e.preventDefault();
    if (!selected) {
      setError('Save or select an activity set first.');
      return;
    }
    setError('');
    const url = editingWord
      ? `/api/words/${editingWord.id}`
      : `/api/activities/${selected.id}/words`;
    const method = editingWord ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Word save failed');
      return;
    }
    setWordForm({ english: '', phonemeString: '' });
    setEditingWord(null);
    setInfo(editingWord ? 'Word updated.' : 'Word added.');
    load();
  }

  async function deleteWord(id) {
    await fetch(`/api/words/${id}`, { method: 'DELETE' });
    setInfo('Word deleted.');
    load();
  }

  return (
    <div className={styles.wrap}>
      <h1>Word lists and activity sets</h1>
      <p>
        This page talks to the database. You can create, read, update and delete activity
        sets and the phoneme words inside them. Separate phonemes with spaces, even when
        one symbol uses more than one character (example: tʃ ɪ n).
      </p>
      {error && <p className={styles.err}>{error}</p>}
      {info && <p className={styles.ok}>{info}</p>}

      <div className={styles.row}>
        <div className={styles.col}>
          <h2>Saved sets</h2>
          <div className={styles.list}>
            {sets.map((s) => (
              <div key={s.id} className={styles.card}>
                <h3>{s.title}</h3>
                <div className={styles.meta}>
                  {s.activityType} · {s.difficulty} · {s.words.length} words
                </div>
                <div className={styles.actions}>
                  <button className="btn" type="button" onClick={() => pick(s)}>Open</button>
                  <button className="btn btn-secondary" type="button" onClick={() => deleteSet(s.id)}>Delete</button>
                </div>
              </div>
            ))}
            {sets.length === 0 && <p>No sets yet. Create one on the right.</p>}
          </div>
        </div>

        <div className={styles.col}>
          <h2>{selected ? `Edit set #${selected.id}` : 'Create a new set'}</h2>
          <form onSubmit={saveSet} className={styles.card}>
            <label>Title</label>
            <input name="title" value={form.title} onChange={onChange} required />
            <label>Activity type</label>
            <select name="activityType" value={form.activityType} onChange={onChange}>
              <option value="WORDLE">WORDLE</option>
              <option value="WORDSEARCH">WORDSEARCH</option>
            </select>
            <label>Difficulty</label>
            <select name="difficulty" value={form.difficulty} onChange={onChange}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <label>Max guesses (Wordle)</label>
            <input name="maxGuesses" type="number" min="3" max="10" value={form.maxGuesses} onChange={onChange} />
            <label>Grid rows / cols (Word Search)</label>
            <input name="gridRows" type="number" min="6" max="16" value={form.gridRows} onChange={onChange} />
            <input name="gridCols" type="number" min="6" max="16" value={form.gridCols} onChange={onChange} />
            <label>
              <input name="showHints" type="checkbox" checked={form.showHints} onChange={onChange} /> Show hints
            </label>
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={onChange} />
            <div className={styles.btnRow}>
              <button className="btn" type="submit">{selected ? 'Update set' : 'Create set'}</button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setSelected(null);
                  setForm(emptySet);
                }}
              >
                New set
              </button>
            </div>
          </form>

          {selected && (
            <form onSubmit={saveWord} className={styles.card} style={{ marginTop: 16 }}>
              <h3>{editingWord ? 'Edit word' : 'Add word'}</h3>
              <label>English word</label>
              <input
                value={wordForm.english}
                onChange={(e) => setWordForm({ ...wordForm, english: e.target.value })}
                placeholder="chin"
              />
              <label>Phonemes (space separated)</label>
              <input
                value={wordForm.phonemeString}
                onChange={(e) => setWordForm({ ...wordForm, phonemeString: e.target.value })}
                placeholder="tʃ ɪ n"
              />
              <div className={styles.btnRow}>
                <button className="btn" type="submit">{editingWord ? 'Update word' : 'Add word'}</button>
                {editingWord && (
                  <button className="btn btn-secondary" type="button" onClick={() => { setEditingWord(null); setWordForm({ english: '', phonemeString: '' }); }}>
                    Cancel
                  </button>
                )}
              </div>
              <div style={{ marginTop: 12 }}>
                {(selected.words || []).map((w) => (
                  <div key={w.id} className={styles.wordRow}>
                    <span><strong>{w.english}</strong> · {w.phonemeString}</span>
                    <span className={styles.actions}>
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditingWord(w); setWordForm({ english: w.english, phonemeString: w.phonemeString }); }}>Edit</button>
                      <button type="button" className="btn btn-secondary" onClick={() => deleteWord(w.id)}>Delete</button>
                    </span>
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
