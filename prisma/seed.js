const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function units(phonemeString) {
  return phonemeString.split(/\s+/).filter(Boolean).map((symbol, position) => ({ symbol, position }));
}

function word(english, phonemeString) {
  return {
    english,
    phonemeString,
    units: { create: units(phonemeString) },
  };
}

async function main() {
  const existing = await prisma.activitySet.count();
  if (existing > 0) {
    console.log('Database already has activity sets, skip seed.');
    return;
  }

  const sharedList = await prisma.wordList.create({
    data: {
      title: 'HCE classroom pack',
      notes: 'Reusable list attached to both Wordle and Word Search',
      words: {
        create: [
          word('bed', 'b e d'),
          word('chin', 'tʃ ɪ n'),
          word('jam', 'dʒ æ m'),
          word('thin', 'θ ɪ n'),
          word('ship', 'ʃ ɪ p'),
          word('ring', 'ɹ ɪ ŋ'),
          word('sun', 's ɐ n'),
          word('fan', 'f æ n'),
        ],
      },
    },
  });

  await prisma.activitySet.create({
    data: {
      title: 'Beginner 3-phoneme Wordle',
      activityType: 'WORDLE',
      difficulty: 'easy',
      showHints: true,
      maxGuesses: 6,
      notes: 'Uses the shared HCE classroom pack',
      wordListId: sharedList.id,
    },
  });

  await prisma.activitySet.create({
    data: {
      title: 'Classroom Word Search pack',
      activityType: 'WORDSEARCH',
      difficulty: 'medium',
      showHints: true,
      gridRows: 10,
      gridCols: 10,
      notes: 'Same word list as the Wordle set',
      wordListId: sharedList.id,
    },
  });

  await prisma.usageEvent.createMany({
    data: [
      { kind: 'PAGE_VIEW', path: '/wordle', activityType: 'WORDLE', note: 'seed' },
      { kind: 'PAGE_VIEW', path: '/wordsearch', activityType: 'WORDSEARCH', note: 'seed' },
      { kind: 'GENERATE_SUCCESS', path: '/wordle', activityType: 'WORDLE', note: 'seed' },
      { kind: 'GENERATE_SUCCESS', path: '/wordsearch', activityType: 'WORDSEARCH', note: 'seed' },
      { kind: 'GENERATE_FAIL', path: '/wordle', activityType: 'WORDLE', note: 'seed invalid phonemes' },
      { kind: 'TIME_ON_PAGE', path: '/wordle', activityType: 'WORDLE', durationMs: 22000, note: 'seed' },
      { kind: 'TIME_ON_PAGE', path: '/words', durationMs: 41000, note: 'seed' },
    ],
  });

  console.log('Seeded shared word list plus Wordle and Word Search activities.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
