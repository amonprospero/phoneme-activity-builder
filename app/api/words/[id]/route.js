import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { validateWordPayload } from '../../../../lib/validate';

export async function PUT(request, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  try {
    const body = await request.json();
    const { errors, english, phonemeString } = validateWordPayload(body);
    if (errors.length) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }
    const word = await prisma.word.update({
      where: { id },
      data: { english, phonemeString },
    });
    return NextResponse.json(word);
  } catch {
    return NextResponse.json({ error: 'Word not found.' }, { status: 404 });
  }
}

export async function DELETE(_request, { params }) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  try {
    await prisma.word.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Word not found.' }, { status: 404 });
  }
}
