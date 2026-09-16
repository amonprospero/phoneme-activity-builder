'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_WORDSEARCH_WORDS } from '../../lib/phonemes';
import styles from './wordsearch.module.css';

function buildWordSearchHtml({ wordLines, rows, cols }) {
  const wordsJson = JSON.stringify(wordLines);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phoneme Word Search</title>
<style>
:root{--primary:#2b5c8f;--bg:#f8fafc;--text:#1e293b;--border:#cbd5e1;--highlight:#fef08a;--found:#bbf7d0;}
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;}
body{background:var(--bg);color:var(--text);padding:16px;display:flex;flex-direction:column;align-items:center;min-height:100vh;}
h1{color:var(--primary);margin-bottom:12px;font-size:1.4rem;}
.wordsearch-grid{display:grid;background:#fff;padding:12px;border-radius:10px;border:1px solid var(--border);gap:2px;margin:0 auto;}
.grid-cell{display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1rem;background:#f8fafc;border:1px solid #e2e8f0;cursor:pointer;user-select:none;aspect-ratio:1;width:36px;height:36px;}
.grid-cell.highlighted{background:var(--highlight)!important;}
.grid-cell.found{background:var(--found)!important;color:#166534;}
.word-list-card{background:#fff;padding:12px;border-radius:10px;border:1px solid var(--border);margin-top:16px;width:100%;max-width:420px;}
.word-items{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}
.word-item{padding:5px 10px;background:#f1f5f9;border-radius:5px;font-weight:500;font-size:0.9rem;}
.word-item.found{text-decoration:line-through;color:#94a3b8;background:#f0fdf4;}
.btn{margin-top:10px;background:#64748b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:600;cursor:pointer;}
</style>
</head>
<body>
<h1>Phoneme Word Search</h1>
<div id="wordsearchGrid" class="wordsearch-grid"></div>
<div class="word-list-card">
  <h3>Word List:</h3>
  <div id="wordDisplayList" class="word-items"></div>
  <button class="btn" id="solveBtn">Show Answers</button>
</div>
<script>
let wordsData = [];
let gridMatrix = [];
let rows = ${rows};
let cols = ${cols};
let solutions = [];
let isSelecting = false;
let startCell = null;
const gridElement = document.getElementById('wordsearchGrid');

const inputLines = ${wordsJson};

function buildPuzzle() {
  wordsData = [];
  let pool = [];
  inputLines.forEach(line => {
    let parts = line.includes(' ') ? line.trim().split(/\s+/) : line.split('');
    let key = parts.join('');
    wordsData.push({ display: key, cleanDisplay: parts.join(' '), units: parts, found: false });
    parts.forEach(p => { if (!pool.includes(p)) pool.push(p); });
  });
  if (pool.length === 0) pool = ['æ','b','d','ɪ','p','s','t'];

  gridMatrix = [];
  for (let r = 0; r < rows; r++) gridMatrix[r] = new Array(cols).fill(null);

  const directions = [
    {dr:0,dc:1},{dr:0,dc:-1},{dr:1,dc:0},{dr:-1,dc:0},
    {dr:1,dc:1},{dr:1,dc:-1},{dr:-1,dc:1},{dr:-1,dc:-1}
  ];
  solutions = [];

  wordsData.forEach(w => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 250) {
      attempts++;
      let d = directions[Math.floor(Math.random() * directions.length)];
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * cols);
      if (canPlace(w.units, r, c, d)) {
        let coords = [];
        for (let i = 0; i < w.units.length; i++) {
          let currR = r + d.dr * i;
          let currC = c + d.dc * i;
          gridMatrix[currR][currC] = w.units[i];
          coords.push({r: currR, c: currC});
        }
        solutions.push({display: w.display, coords});
        placed = true;
      }
    }
  });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!gridMatrix[r][c]) gridMatrix[r][c] = pool[Math.floor(Math.random() * pool.length)];
    }
  }
  renderGrid();
}

function canPlace(units, r, c, d) {
  let len = units.length;
  let endR = r + d.dr * (len - 1);
  let endC = c + d.dc * (len - 1);
  if (endR < 0 || endR >= rows || endC < 0 || endC >= cols) return false;
  for (let i = 0; i < len; i++) {
    let currR = r + d.dr * i;
    let currC = c + d.dc * i;
    if (gridMatrix[currR][currC] && gridMatrix[currR][currC] !== units[i]) return false;
  }
  return true;
}

function renderGrid() {
  gridElement.innerHTML = '';
  gridElement.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';
  gridElement.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = gridMatrix[r][c];
      gridElement.appendChild(cell);
    }
  }
  let listContainer = document.getElementById('wordDisplayList');
  listContainer.innerHTML = '';
  wordsData.forEach(w => {
    let item = document.createElement('div');
    item.className = 'word-item';
    item.id = 'list-' + w.display;
    item.textContent = w.cleanDisplay;
    listContainer.appendChild(item);
  });
}

function getPath(cellA, cellB) {
  let r1 = parseInt(cellA.dataset.row);
  let c1 = parseInt(cellA.dataset.col);
  let r2 = parseInt(cellB.dataset.row);
  let c2 = parseInt(cellB.dataset.col);
  let dr = r2 - r1, dc = c2 - c1;
  if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
    let steps = Math.max(Math.abs(dr), Math.abs(dc));
    let stepR = dr === 0 ? 0 : dr / steps;
    let stepC = dc === 0 ? 0 : dc / steps;
    let path = [];
    for (let i = 0; i <= steps; i++) path.push({r: r1 + stepR * i, c: c1 + stepC * i});
    return path;
  }
  return null;
}

function highlightPath(cellA, cellB) {
  let path = getPath(cellA, cellB);
  if (!path) return;
  path.forEach(co => {
    let cell = document.querySelector("[data-row='" + co.r + "'][data-col='" + co.c + "']");
    if (cell) cell.classList.add('highlighted');
  });
}

function clearHighlights() {
  document.querySelectorAll('.grid-cell.highlighted').forEach(c => c.classList.remove('highlighted'));
}

function checkSelection() {
  let highlighted = document.querySelectorAll('.grid-cell.highlighted');
  if (highlighted.length === 0) return;
  let cells = Array.from(highlighted);
  let path = getPath(startCell, cells[cells.length - 1] || startCell);
  if (!path) return;
  let str1 = '', str2 = '';
  path.forEach(co => { str1 += gridMatrix[co.r][co.c]; });
  for (let i = path.length - 1; i >= 0; i--) str2 += gridMatrix[path[i].r][path[i].c];
  wordsData.forEach(w => {
    if (!w.found && (w.display === str1 || w.display === str2)) {
      w.found = true;
      path.forEach(co => {
        let cell = document.querySelector("[data-row='" + co.r + "'][data-col='" + co.c + "']");
        if (cell) cell.classList.add('found');
      });
      let item = document.getElementById('list-' + w.display);
      if (item) item.classList.add('found');
    }
  });
}

gridElement.addEventListener('mousedown', e => {
  if (e.target.classList.contains('grid-cell')) {
    isSelecting = true;
    startCell = e.target;
    clearHighlights();
    e.target.classList.add('highlighted');
  }
});
window.addEventListener('mousemove', e => {
  if (!isSelecting) return;
  const cell = document.elementFromPoint(e.clientX, e.clientY);
  if (cell && cell.classList.contains('grid-cell') && cell.parentNode === gridElement) {
    clearHighlights();
    highlightPath(startCell, cell);
  }
});
window.addEventListener('mouseup', () => {
  if (!isSelecting) return;
  isSelecting = false;
  checkSelection();
  clearHighlights();
});

// touch
gridElement.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY);
  if (cell && cell.classList.contains('grid-cell')) {
    isSelecting = true;
    startCell = cell;
    clearHighlights();
    cell.classList.add('highlighted');
  }
});
window.addEventListener('touchmove', e => {
  if (!isSelecting) return;
  const touch = e.touches[0];
  const cell = document.elementFromPoint(touch.clientX, touch.clientY);
  if (cell && cell.classList.contains('grid-cell') && cell.parentNode === gridElement) {
    clearHighlights();
    highlightPath(startCell, cell);
  }
});
window.addEventListener('touchend', () => {
  if (!isSelecting) return;
  isSelecting = false;
  checkSelection();
  clearHighlights();
});

let showSol = false;
document.getElementById('solveBtn').addEventListener('click', () => {
  showSol = !showSol;
  solutions.forEach(s => {
    s.coords.forEach(co => {
      let cell = document.querySelector("[data-row='" + co.r + "'][data-col='" + co.c + "']");
      if (cell) cell.style.backgroundColor = showSol ? '#fbcfe8' : '';
    });
  });
});

buildPuzzle();
</script>
</body>
</html>`;
}

export default function WordSearchPage() {
  const [wordText, setWordText] = useState(DEFAULT_WORDSEARCH_WORDS.join('\n'));
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [msg, setMsg] = useState('');
  const [savedSets, setSavedSets] = useState([]);
  const [chosenSet, setChosenSet] = useState('');

  useEffect(() => {
    fetch('/api/activities?type=WORDSEARCH')
      .then((r) => r.json())
      .then((data) => setSavedSets(Array.isArray(data) ? data : []))
      .catch(() => setSavedSets([]));
  }, []);

  const loadFromDatabase = () => {
    const set = savedSets.find((s) => String(s.id) === String(chosenSet));
    if (!set || !set.words || set.words.length === 0) {
      setMsg('Select a saved Word Search set that has words.');
      return;
    }
    setWordText(set.words.map((w) => w.phonemeString).join('\n'));
    setRows(set.gridRows);
    setCols(set.gridCols);
    setMsg(`Loaded ${set.words.length} words from “${set.title}”.`);
  };

  const handleGenerate = () => {
    const lines = wordText.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      setMsg('Please enter at least one phoneme word (one per line).');
      return;
    }
    if (lines.length > 12) {
      setMsg('Please keep the list around 5–10 words for this assessment.');
      return;
    }
    const r = Number(rows) || 10;
    const c = Number(cols) || 10;
    const html = buildWordSearchHtml({ wordLines: lines, rows: r, cols: c });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phoneme-wordsearch.html';
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Word Search HTML downloaded! Open in browser to play.');
  };

  return (
    <div className={styles.page}>
      <h1>Word Search Builder</h1>
      <p className={styles.intro}>
        Enter phoneme words (one per line, symbols separated by space). Generate a downloadable
        HTML word-search puzzle that students can solve by dragging over the cells.
      </p>

      <div className="two-col">
        <div className="panel">
          <div className="form-group">
            <label htmlFor="savedSet">Load from saved Word Search set</label>
            <select
              id="savedSet"
              value={chosenSet}
              onChange={(e) => setChosenSet(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">— choose a saved set —</option>
              {savedSets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.words.length} words)
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-secondary" style={{ marginTop: 8, fontSize: '0.85rem', padding: '6px 10px' }} onClick={loadFromDatabase}>
              Load words from database
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="words">Words (one phoneme sequence per line)</label>
            <textarea
              id="words"
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
              rows={10}
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.95rem' }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rows">Rows</label>
              <input id="rows" type="number" min={5} max={15} value={rows} onChange={(e) => setRows(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="form-group">
              <label htmlFor="cols">Cols</label>
              <input id="cols" type="number" min={5} max={15} value={cols} onChange={(e) => setCols(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <button type="button" className="btn btn-block" onClick={handleGenerate}>
            GENERATE HTML
          </button>
          {msg && <p className={styles.msg}>{msg}</p>}
        </div>

        <div className="panel">
          <h3 style={{ color: 'var(--primary)', marginBottom: 10 }}>How it works</h3>
          <ul className={styles.helpList}>
            <li>Each line becomes one hidden word made of phoneme symbols.</li>
            <li>Words are placed in random directions (including diagonal).</li>
            <li>Empty cells are filled with random phonemes from the same pool.</li>
            <li>Students drag across cells to select a word; matching words turn green.</li>
            <li>“Show Answers” button reveals the placement for teachers.</li>
          </ul>
          <p style={{ marginTop: 14, fontSize: '0.9rem', color: 'var(--muted)' }}>
            Default list uses sample HCE words from the corpus (chin, bait, jam, etc.).
            You can edit or replace them before generating.
          </p>
        </div>
      </div>
    </div>
  );
}
