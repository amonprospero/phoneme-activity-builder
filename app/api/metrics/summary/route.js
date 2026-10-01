import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  const [
    wordleSets,
    searchSets,
    wordCount,
    emptySets,
    success,
    failed,
    timeEvents,
    recentEvents,
  ] = await Promise.all([
    prisma.activitySet.count({ where: { activityType: 'WORDLE' } }),
    prisma.activitySet.count({ where: { activityType: 'WORDSEARCH' } }),
    prisma.word.count(),
    prisma.activitySet.count({ where: { wordList: { words: { none: {} } } } }),
    prisma.usageEvent.count({ where: { kind: 'GENERATE_SUCCESS' } }),
    prisma.usageEvent.count({ where: { kind: 'GENERATE_FAIL' } }),
    prisma.usageEvent.findMany({
      where: { kind: 'TIME_ON_PAGE', durationMs: { gt: 0 } },
      select: { durationMs: true, path: true },
    }),
    prisma.usageEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
  ]);

  const totalMs = timeEvents.reduce((s, e) => s + e.durationMs, 0);
  const avgTimeMs = timeEvents.length ? Math.round(totalMs / timeEvents.length) : 0;

  const mostUsed =
    wordleSets === searchSets
      ? wordleSets === 0
        ? 'none yet'
        : 'equal'
      : wordleSets > searchSets
        ? 'WORDLE'
        : 'WORDSEARCH';

  const alerts = [];
  if (emptySets > 0) {
    alerts.push({
      level: 'warning',
      message: `${emptySets} activity set(s) have no words. Generate will fail until words are added.`,
    });
  }
  if (failed > success && failed > 0) {
    alerts.push({
      level: 'error',
      message: 'Failed generations are higher than successful ones. Check validation on the builders.',
    });
  }
  if (wordleSets + searchSets === 0) {
    alerts.push({
      level: 'warning',
      message: 'No activity sets stored yet.',
    });
  }

  return NextResponse.json({
    health: '/health',
    wordleSets,
    searchSets,
    totalSets: wordleSets + searchSets,
    wordCount,
    emptySets,
    successCount: success,
    failedCount: failed,
    totalGenerated: success + failed,
    avgTimeOnPageSec: Math.round(avgTimeMs / 1000),
    avgTimeOnPageMs: avgTimeMs,
    mostUsedActivity: mostUsed,
    alerts,
    recentEvents,
  });
}
