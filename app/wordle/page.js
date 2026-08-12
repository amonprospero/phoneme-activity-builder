'use client';

import { useState } from 'react';
import { PHONEME_KEYBOARD, PHONEME_HINTS, SAMPLE_WORDS_3 } from '../../lib/phonemes';
import styles from './wordle.module.css';

function buildWordleHtml({ phonemeArr, english, maxGuesses, showHints }) {
  const phonemeStr = phonemeArr.join(' ');
  const len = phonemeArr.length;
  const hintsJson = JSON.stringify(PHONEME_HINTS);
  const keyboardJson = JSON.stringify(PHONEME_KEYBOARD);
  const targetJson = JSON.stringify(phonemeArr);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phonemele – ${english || phonemeStr}</title>
<style>
:root{--primary:#2b5c8f;--bg:#f8fafc;--card:#fff;--text:#1e293b;--border:#cbd5e1;--correct:#22c55e;--present:#eab308;--absent:#94a3b8;}
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;}
body{background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:16px;}
h1{color:var(--primary);margin:12px 0 4px;font-size:1.5rem;}
.sub{color:#64748b;font-size:0.9rem;margin-bottom:16px;}
.grid{display:grid;gap:6px;margin-bottom:20px;}
.row{display:flex;gap:6px;justify-content:center;}
.cell{width:52px;height:52px;border:2px solid var(--border);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.15rem;background:#fff;user-select:none;}
.cell.correct{background:var(--correct);color:#fff;border-color:var(--correct);}
.cell.present{background:var(--present);color:#fff;border-color:var(--present);}
.cell.absent{background:var(--absent);color:#fff;border-color:var(--absent);}
.cell.filled{border-color:#64748b;}
.kb{max-width:420px;display:flex;flex-direction:column;gap:6px;margin-top:8px;}
.kb-row{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;}
.kb-btn{min-width:36px;padding:8px 6px;border:1px solid var(--border);border-radius:5px;background:#fff;font-size:0.95rem;font-weight:600;cursor:pointer;}
.kb-btn:hover{background:#e2e8f0;}
.kb-btn.wide{min-width:70px;background:var(--primary);color:#fff;border-color:var(--primary);}
.msg{margin:10px 0;font-weight:600;min-height:24px;text-align:center;}
.hint-note{font-size:0.8rem;color:#64748b;margin-top:12px;text-align:center;max-width:400px;}
.english-reveal{margin-top:12px;padding:10px 16px;background:#dcfce7;border-radius:8px;font-weight:600;display:none;}
</style>
</head>
<body>
<h1>PHONEMELE</h1>
<p class="sub">Guess the phoneme word · ${maxGuesses} tries</p>
<div id="grid" class="grid"></div>
<div class="msg" id="msg"></div>
<div class="english-reveal" id="englishBox">English: <span id="engText"></span></div>
<div class="kb" id="keyboard"></div>
${showHints ? '<p class="hint-note">Hover / long-press a key to see English letter hint (e.g. θ → TH as in thin)</p>' : ''}
<script>
const TARGET = ${targetJson};
const MAX = ${maxGuesses};
const SHOW_HINTS = ${showHints ? 'true' : 'false'};
const HINTS = ${hintsJson};
const KEYBOARD = ${keyboardJson};
const ENGLISH = ${JSON.stringify(english || '')};
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
const guesses = Array.from({length: MAX}, () => Array(TARGET.length).fill(''));

const gridEl = document.getElementById('grid');
const msgEl = document.getElementById('msg');
const kbEl = document.getElementById('keyboard');

function renderGrid() {
  gridEl.innerHTML = '';
  for (let r = 0; r < MAX; r++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let c = 0; c < TARGET.length; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell' + (guesses[r][c] ? ' filled' : '');
      cell.id = 'c-' + r + '-' + c;
      cell.textContent = guesses[r][c] || '';
      row.appendChild(cell);
    }
    gridEl.appendChild(row);
  }
}

function renderKeyboard() {
  kbEl.innerHTML = '';
  KEYBOARD.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    row.forEach(ph => {
      const btn = document.createElement('button');
      btn.className = 'kb-btn';
      btn.textContent = ph;
      if (SHOW_HINTS && HINTS[ph]) btn.title = HINTS[ph];
      btn.onclick = () => addPhoneme(ph);
      rowEl.appendChild(btn);
    });
    kbEl.appendChild(rowEl);
  });
  // control row
  const ctrl = document.createElement('div');
  ctrl.className = 'kb-row';
  const enter = document.createElement('button');
  enter.className = 'kb-btn wide';
  enter.textContent = 'ENTER';
  enter.onclick = submitGuess;
  const del = document.createElement('button');
  del.className = 'kb-btn wide';
  del.textContent = 'DELETE';
  del.onclick = deletePhoneme;
  ctrl.appendChild(enter);
  ctrl.appendChild(del);
  kbEl.appendChild(ctrl);
}

function addPhoneme(ph) {
  if (gameOver || currentCol >= TARGET.length) return;
  guesses[currentRow][currentCol] = ph;
  currentCol++;
  renderGrid();
}

function deletePhoneme() {
  if (gameOver || currentCol === 0) return;
  currentCol--;
  guesses[currentRow][currentCol] = '';
  renderGrid();
}

function submitGuess() {
  if (gameOver) return;
  if (currentCol < TARGET.length) {
    msgEl.textContent = 'Please fill all cells';
    return;
  }
  const guess = guesses[currentRow];
  // colour logic
  const targetCopy = [...TARGET];
  const status = Array(TARGET.length).fill('absent');
  // first pass exact
  for (let i = 0; i < TARGET.length; i++) {
    if (guess[i] === targetCopy[i]) {
      status[i] = 'correct';
      targetCopy[i] = null;
    }
  }
  // second pass present
  for (let i = 0; i < TARGET.length; i++) {
    if (status[i] === 'correct') continue;
    const idx = targetCopy.indexOf(guess[i]);
    if (idx !== -1) {
      status[i] = 'present';
      targetCopy[idx] = null;
    }
  }
  for (let i = 0; i < TARGET.length; i++) {
    const cell = document.getElementById('c-' + currentRow + '-' + i);
    cell.classList.add(status[i]);
  }
  if (guess.every((g, i) => g === TARGET[i])) {
    msgEl.textContent = 'Correct! Well done';
    gameOver = true;
    if (ENGLISH) {
      document.getElementById('engText').textContent = ENGLISH;
      document.getElementById('englishBox').style.display = 'block';
    }
    return;
  }
  currentRow++;
  currentCol = 0;
  if (currentRow >= MAX) {
    msgEl.textContent = 'Out of guesses. Answer: ' + TARGET.join(' ');
    gameOver = true;
    if (ENGLISH) {
      document.getElementById('engText').textContent = ENGLISH;
      document.getElementById('englishBox').style.display = 'block';
    }
  } else {
    msgEl.textContent = '';
  }
}

renderGrid();
renderKeyboard();
</script>
</body>
</html>`;
}

export default function WordlePage() {
  const [phonemeInput, setPhonemeInput] = useState('tʃ ɪ n');
  const [english, setEnglish] = useState('chin');
  const [showHints, setShowHints] = useState(true);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [previewMsg, setPreviewMsg] = useState('');

  const handleGenerate = () => {
    const parts = phonemeInput.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) {
      setPreviewMsg('Please enter at least 2 phonemes separated by space.');
      return;
    }
    if (parts.length > 6) {
      setPreviewMsg('Maximum 6 phonemes for this assessment.');
      return;
    }
    const html = buildWordleHtml({
      phonemeArr: parts,
      english: english.trim(),
      maxGuesses: Number(maxGuesses) || 6,
      showHints,
    });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phonemele-${(english || parts.join('')).replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setPreviewMsg('HTML file downloaded! Open it in any browser to play.');
  };

  const loadSample = () => {
    const sample = SAMPLE_WORDS_3[Math.floor(Math.random() * SAMPLE_WORDS_3.length)];
    setPhonemeInput(sample.phonemes.join(' '));
    setEnglish(sample.english);
    setPreviewMsg('Sample word loaded.');
  };

  return (
    <div className={styles.page}>
      <h1>Wordle Builder (Phonemele)</h1>
      <p className={styles.intro}>
        Configure one phoneme-based Wordle game. Students guess the sequence of phoneme symbols.
        Click Generate to download a single playable HTML file.
      </p>

      <div className="two-col">
        <div className="panel">
          <div className="form-group">
            <label htmlFor="phonemeWord">Phoneme Word (space-separated)</label>
            <input
              id="phonemeWord"
              type="text"
              value={phonemeInput}
              onChange={(e) => setPhonemeInput(e.target.value)}
              placeholder="e.g. tʃ ɪ n"
              style={{ width: '100%' }}
            />
            <button type="button" className="btn btn-secondary" style={{ marginTop: 8, fontSize: '0.85rem', padding: '6px 10px' }} onClick={loadSample}>
              Load random sample
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="englishWord">English Word (optional gloss)</label>
            <input
              id="englishWord"
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="e.g. chin"
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label>Show hints (hover on keyboard keys)</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="hints" checked={showHints} onChange={() => setShowHints(true)} />
                Yes
              </label>
              <label>
                <input type="radio" name="hints" checked={!showHints} onChange={() => setShowHints(false)} />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="numGuess">Number of Guesses</label>
            <input
              id="numGuess"
              type="number"
              min={3}
              max={10}
              value={maxGuesses}
              onChange={(e) => setMaxGuesses(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <button type="button" className="btn btn-block" onClick={handleGenerate}>
            GENERATE HTML
          </button>

          {previewMsg && <p className={styles.msg}>{previewMsg}</p>}
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>Preview of keyboard & layout</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 12 }}>
            The generated file will show a grid of {maxGuesses} rows × {phonemeInput.trim().split(/\s+/).filter(Boolean).length || '?'} cells,
            plus this HCE phoneme keyboard. {showHints ? 'Hover tooltips are ON.' : 'Hover tooltips are OFF.'}
          </p>
          <div className={styles.kbPreview}>
            {PHONEME_KEYBOARD.map((row, ri) => (
              <div key={ri} className={styles.kbRow}>
                {row.map((ph) => (
                  <span
                    key={ph}
                    className={styles.kbKey}
                    title={showHints ? PHONEME_HINTS[ph] || '' : ''}
                  >
                    {ph}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 14, fontSize: '0.85rem', color: 'var(--muted)' }}>
            Target word preview: <strong>{phonemeInput || '—'}</strong>
            {english ? `  →  ${english}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
