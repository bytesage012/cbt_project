import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const subjects = await prisma.subject.findMany({
    include: { _count: { select: { courses: true } } },
  });
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  const subject = await prisma.subject.create({
    data: { name },
  });
  return NextResponse.json(subject, { status: 201 });
}
