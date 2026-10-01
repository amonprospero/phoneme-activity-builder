import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

const KINDS = ['PAGE_VIEW', 'TIME_ON_PAGE', 'GENERATE_SUCCESS', 'GENERATE_FAIL', 'ALERT'];

export async function POST(request) {
  try {
    const body = await request.json();
    const kind = String(body.kind || '').toUpperCase();
    if (!KINDS.includes(kind)) {
      return NextResponse.json({ error: 'Unknown event kind.' }, { status: 400 });
    }
    const event = await prisma.usageEvent.create({
      data: {
        kind,
        activityType: String(body.activityType || ''),
        path: String(body.path || ''),
        durationMs: Number(body.durationMs || 0),
        note: String(body.note || '').slice(0, 200),
        activitySetId: body.activitySetId ? Number(body.activitySetId) : null,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not store event.' }, { status: 500 });
  }
}
