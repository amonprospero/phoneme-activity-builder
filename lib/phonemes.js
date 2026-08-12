// HCE Phoneme data for Wordle keyboard and hints
// Based on the provided HCE_Wordle_Phoneme_Corpus

export const PHONEME_KEYBOARD = [
  ['p', 't', 'k'],
  ['b', 'd', 'g'],
  ['n', 'm', 'ŋ'],
  ['f', 's', 'θ', 'ʃ'],
  ['v', 'z', 'ð', 'ʒ'],
  ['l', 'ɹ', 'w', 'j'],
  ['h', 'tʃ', 'dʒ'],
  ['iː', 'ɪ', 'e', 'eː'],
  ['æ', 'ɐ', 'ɐː', 'ɜː'],
  ['ʉː', 'ɔ', 'oː', 'ʊ'],
  ['æɪ', 'ɑe', 'oɪ', 'əʉ'],
  ['æɔ', 'ɪə', 'ə'],
];

// Simple English letter equivalence for hover hints
// Format: phoneme -> short label for button / description
export const PHONEME_HINTS = {
  'p': 'P (as in pin)',
  't': 'T (as in tin)',
  'k': 'K (as in kin)',
  'b': 'B (as in bin)',
  'd': 'D (as in din)',
  'g': 'G (as in give)',
  'n': 'N (as in no)',
  'm': 'M (as in me)',
  'ŋ': 'NG (as in sing)',
  'f': 'F (as in fan)',
  's': 'S (as in sun)',
  'θ': 'TH (as in thin)',
  'ʃ': 'SH (as in ship)',
  'v': 'V (as in van)',
  'z': 'Z (as in zip)',
  'ð': 'TH (as in then)',
  'ʒ': 'ZH (as in measure)',
  'l': 'L (as in log)',
  'ɹ': 'R (as in ring)',
  'w': 'W (as in win)',
  'j': 'Y (as in yes)',
  'h': 'H (as in hat)',
  'tʃ': 'CH (as in chin)',
  'dʒ': 'J (as in jam)',
  'iː': 'EE (as in see)',
  'ɪ': 'I (as in sit)',
  'e': 'E (as in bed)',
  'eː': 'AIR (as in hair)',
  'æ': 'A (as in bad)',
  'ɐ': 'U (as in bud)',
  'ɐː': 'AR (as in bark)',
  'ɜː': 'ER (as in bird)',
  'ʉː': 'OO (as in boot)',
  'ɔ': 'O (as in log)',
  'oː': 'OR (as in fork)',
  'ʊ': 'U (as in book)',
  'æɪ': 'AY (as in bait)',
  'ɑe': 'I (as in bike)',
  'oɪ': 'OY (as in boil)',
  'əʉ': 'O (as in boat)',
  'æɔ': 'OW (as in cloud)',
  'ɪə': 'EAR (as in beard)',
  'ə': 'UH (schwa)',
};

// Sample 3-phoneme words from corpus for default / demo
export const SAMPLE_WORDS_3 = [
  { phonemes: ['b', 'e', 'd'], english: 'bed' },
  { phonemes: ['b', 'ɪ', 'd'], english: 'bid' },
  { phonemes: ['b', 'æ', 'd'], english: 'bad' },
  { phonemes: ['tʃ', 'ɪ', 'n'], english: 'chin' },
  { phonemes: ['dʒ', 'æ', 'm'], english: 'jam' },
  { phonemes: ['θ', 'ɪ', 'n'], english: 'thin' },
  { phonemes: ['ʃ', 'ɪ', 'p'], english: 'ship' },
  { phonemes: ['ɹ', 'ɪ', 'ŋ'], english: 'ring' },
  { phonemes: ['f', 'æ', 'n'], english: 'fan' },
  { phonemes: ['s', 'ɐ', 'n'], english: 'sun' },
];

export const SAMPLE_WORDS_4 = [
  { phonemes: ['s', 't', 'ɔ', 'p'], english: 'stop' },
  { phonemes: ['f', 'ɹ', 'ɔ', 'ɡ'], english: 'frog' },
  { phonemes: ['k', 'l', 'æ', 'p'], english: 'clap' },
  { phonemes: ['d', 'ɹ', 'ɐ', 'm'], english: 'drum' },
  { phonemes: ['t', 'ɹ', 'æɪ', 'n'], english: 'train' },
];

export const SAMPLE_WORDS_5 = [
  { phonemes: ['s', 't', 'æ', 'm', 'p'], english: 'stamp' },
  { phonemes: ['p', 'l', 'æ', 'n', 't'], english: 'plant' },
  { phonemes: ['d', 'ɹ', 'ɪ', 'ŋ', 'k'], english: 'drink' },
  { phonemes: ['s', 'p', 'ɹ', 'ɪ', 'ŋ'], english: 'spring' },
];

// Default for Word Search demo (from the provided HTML)
export const DEFAULT_WORDSEARCH_WORDS = [
  'tʃ ɪ n',
  'b æɪ t',
  'dʒ æ m',
  'b æ d',
  'b ʉː t',
  'l ɔ ɡ',
  'ɹ ɪ ŋ',
  'f æ n',
  'v æ n',
  's ɐ n',
];
