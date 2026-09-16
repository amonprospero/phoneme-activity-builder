const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.activitySet.count();
  if (existing > 0) {
    console.log('Database already has activity sets, skip seed.');
    return;
  }

  await prisma.activitySet.create({
    data: {
      title: 'Beginner 3-phoneme Wordle',
      activityType: 'WORDLE',
      difficulty: 'easy',
      showHints: true,
      maxGuesses: 6,
      notes: 'Sample set from the HCE corpus',
      words: {
        create: [
          { english: 'bed', phonemeString: 'b e d' },
          { english: 'chin', phonemeString: 'tʃ ɪ n' },
          { english: 'jam', phonemeString: 'dʒ æ m' },
          { english: 'thin', phonemeString: 'θ ɪ n' },
          { english: 'ship', phonemeString: 'ʃ ɪ p' },
          { english: 'ring', phonemeString: 'ɹ ɪ ŋ' },
        ],
      },
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
      notes: 'Drag-select phoneme words',
      words: {
        create: [
          { english: 'bed', phonemeString: 'b e d' },
          { english: 'sun', phonemeString: 's ɐ n' },
          { english: 'fan', phonemeString: 'f æ n' },
          { english: 'ship', phonemeString: 'ʃ ɪ p' },
          { english: 'chin', phonemeString: 'tʃ ɪ n' },
        ],
      },
    },
  });

  console.log('Seeded sample Wordle and Word Search sets.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
