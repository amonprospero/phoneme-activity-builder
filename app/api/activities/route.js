import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { validateActivityPayload } from '../../../lib/validate';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const where = type ? { activityType: type } : {};
  const sets = await prisma.activitySet.findMany({
    where,
    include: { words: { orderBy: { id: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(sets);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = validateActivityPayload(body);
    if (errors.length) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }
    const created = await prisma.activitySet.create({
      data: {
        title: String(body.title).trim(),
        activityType: body.activityType,
        difficulty: body.difficulty || 'medium',
        showHints: body.showHints !== false,
        maxGuesses: Number(body.maxGuesses || 6),
        gridRows: Number(body.gridRows || 10),
        gridCols: Number(body.gridCols || 10),
        notes: String(body.notes || ''),
      },
      include: { words: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not create activity set.' }, { status: 500 });
  }
}
