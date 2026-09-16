import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { validateActivityPayload } from '../../../../lib/validate';

export async function GET(_request, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  const set = await prisma.activitySet.findUnique({
    where: { id },
    include: { words: { orderBy: { id: 'asc' } } },
  });
  if (!set) return NextResponse.json({ error: 'Activity set not found.' }, { status: 404 });
  return NextResponse.json(set);
}

export async function PUT(request, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  try {
    const body = await request.json();
    const errors = validateActivityPayload(body, { partial: true });
    if (errors.length) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }
    const data = {};
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.activityType !== undefined) data.activityType = body.activityType;
    if (body.difficulty !== undefined) data.difficulty = body.difficulty;
    if (body.showHints !== undefined) data.showHints = Boolean(body.showHints);
    if (body.maxGuesses !== undefined) data.maxGuesses = Number(body.maxGuesses);
    if (body.gridRows !== undefined) data.gridRows = Number(body.gridRows);
    if (body.gridCols !== undefined) data.gridCols = Number(body.gridCols);
    if (body.notes !== undefined) data.notes = String(body.notes);
    const updated = await prisma.activitySet.update({
      where: { id },
      data,
      include: { words: { orderBy: { id: 'asc' } } },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Could not update activity set.' }, { status: 404 });
  }
}

export async function DELETE(_request, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  try {
    await prisma.activitySet.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Activity set not found.' }, { status: 404 });
  }
}
