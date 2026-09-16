import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { status: 'ok', service: 'phoneme-activity-builder', database: 'connected' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'degraded', service: 'phoneme-activity-builder', database: 'error', message: error.message },
      { status: 200 }
    );
  }
}
