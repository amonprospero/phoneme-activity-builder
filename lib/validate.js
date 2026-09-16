const TYPES = ['WORDLE', 'WORDSEARCH'];
const LEVELS = ['easy', 'medium', 'hard'];

export function parsePhonemes(input) {
  if (typeof input !== 'string') return [];
  return input
    .trim()
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function validateActivityPayload(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.title !== undefined) {
    if (!body.title || String(body.title).trim().length < 2) {
      errors.push('Title must be at least 2 characters.');
    }
  }
  if (!partial || body.activityType !== undefined) {
    if (!TYPES.includes(body.activityType)) {
      errors.push('Activity type must be WORDLE or WORDSEARCH.');
    }
  }
  if (body.difficulty !== undefined && !LEVELS.includes(body.difficulty)) {
    errors.push('Difficulty must be easy, medium or hard.');
  }
  if (body.maxGuesses !== undefined) {
    const n = Number(body.maxGuesses);
    if (!Number.isInteger(n) || n < 3 || n > 10) {
      errors.push('Max guesses must be a whole number between 3 and 10.');
    }
  }
  if (body.gridRows !== undefined || body.gridCols !== undefined) {
    const r = Number(body.gridRows ?? 10);
    const c = Number(body.gridCols ?? 10);
    if (!Number.isInteger(r) || !Number.isInteger(c) || r < 6 || c < 6 || r > 16 || c > 16) {
      errors.push('Grid size must be whole numbers between 6 and 16.');
    }
  }
  return errors;
}

export function validateWordPayload(body) {
  const errors = [];
  const english = String(body.english || '').trim();
  const phonemeString = String(body.phonemeString || body.phonemes || '').trim();
  if (!english) errors.push('English word is required.');
  const parts = parsePhonemes(phonemeString);
  if (parts.length < 2) {
    errors.push('Enter at least 2 phonemes, separated by spaces (example: tʃ ɪ n).');
  }
  if (parts.some((p) => p.length > 6)) {
    errors.push('One phoneme looks too long. Separate symbols with spaces.');
  }
  return { errors, english, phonemeString: parts.join(' '), parts };
}
