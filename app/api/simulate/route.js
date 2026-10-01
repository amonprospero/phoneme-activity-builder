import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST() {
  const sample = [
    { english: 'bed', phonemeString: 'b e d', units: { create: [{ symbol: 'b', position: 0 }, { symbol: 'e', position: 1 }, { symbol: 'd', position: 2 }] } },
    { english: 'fan', phonemeString: 'f æ n', units: { create: [{ symbol: 'f', position: 0 }, { symbol: 'æ', position: 1 }, { symbol: 'n', position: 2 }] } },
    { english: 'thin', phonemeString: 'θ ɪ n', units: { create: [{ symbol: 'θ', position: 0 }, { symbol: 'ɪ', position: 1 }, { symbol: 'n', position: 2 }] } },
  ];

  const list = await prisma.wordList.create({
    data: {
      title: `Simulated list ${Date.now()}`,
      notes: 'Dashboard simulate button',
      words: { create: sample },
    },
  });

  const set = await prisma.activitySet.create({
    data: {
      title: `Simulated set ${Date.now()}`,
      activityType: Math.random() > 0.5 ? 'WORDLE' : 'WORDSEARCH',
      difficulty: 'medium',
      showHints: true,
      notes: 'Created by the simulate-records button',
      wordListId: list.id,
    },
  });

  await prisma.usageEvent.createMany({
    data: [
      { kind: 'PAGE_VIEW', path: '/dashboard', activityType: set.activityType, note: 'simulated' },
      { kind: 'GENERATE_SUCCESS', path: '/wordle', activityType: set.activityType, activitySetId: set.id, note: 'simulated' },
      { kind: 'TIME_ON_PAGE', path: '/wordle', activityType: set.activityType, durationMs: 18000 + Math.floor(Math.random() * 20000), note: 'simulated' },
    ],
  });

  return NextResponse.json({ ok: true, set, list }, { status: 201 });
}
