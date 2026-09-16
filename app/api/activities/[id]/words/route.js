import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { validateWordPayload } from '../../../../../lib/validate';

export async function POST(request, { params }) {
  const activitySetId = Number(params.id);
  if (!activitySetId) return NextResponse.json({ error: 'Invalid activity id.' }, { status: 400 });
  const parent = await prisma.activitySet.findUnique({ where: { id: activitySetId } });
  if (!parent) return NextResponse.json({ error: 'Activity set not found.' }, { status: 404 });
  try {
    const body = await request.json();
    const { errors, english, phonemeString } = validateWordPayload(body);
    if (errors.length) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }
    const word = await prisma.word.create({
      data: { english, phonemeString, activitySetId },
    });
    return NextResponse.json(word, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not add word.' }, { status: 500 });
  }
}
