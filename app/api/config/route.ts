import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type ConfigInput = { key: string; value: string };

export async function GET() {
  const configs = await prisma.config.findMany();
  return NextResponse.json(configs);
}

export async function POST(request: Request) {
  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });
  const upserted = await prisma.config.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(upserted);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });
  await prisma.config.delete({ where: { key } });
  return NextResponse.json({ deleted: true });
}
