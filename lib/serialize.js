export const wordInclude = {
  units: { orderBy: { position: 'asc' } },
};

export const listInclude = {
  words: { orderBy: { id: 'asc' }, include: wordInclude },
};

export const activityInclude = {
  wordList: { include: listInclude },
};

export function flattenWord(word) {
  const units = word.units || [];
  return {
    id: word.id,
    english: word.english,
    phonemeString: word.phonemeString || units.map((u) => u.symbol).join(' '),
    phonemes: units.map((u) => u.symbol),
    wordListId: word.wordListId,
  };
}

export function flattenActivity(set) {
  const words = (set.wordList?.words || []).map(flattenWord);
  return {
    ...set,
    words,
    wordListTitle: set.wordList?.title || '',
  };
}

export function unitRows(phonemeString) {
  return phonemeString
    .split(/\s+/)
    .filter(Boolean)
    .map((symbol, position) => ({ symbol, position }));
}
