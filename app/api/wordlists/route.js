import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { listInclude, flattenWord } from '../../../lib/serialize';

export async function GET() {
  const lists = await prisma.wordList.findMany({
    include: listInclude,
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(
    lists.map((list) => ({
      ...list,
      words: list.words.map(flattenWord),
    }))
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    if (title.length < 2) {
      return NextResponse.json({ error: 'Word list title must be at least 2 characters.' }, { status: 400 });
    }
    const list = await prisma.wordList.create({
      data: { title, notes: String(body.notes || '') },
      include: listInclude,
    });
    return NextResponse.json({ ...list, words: [] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not create word list.' }, { status: 500 });
  }
}
