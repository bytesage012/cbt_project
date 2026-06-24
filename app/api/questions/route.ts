// app/api/questions/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get('courseId');
  const where = courseId ? { courseId: Number(courseId) } : {};
  const questions = await prisma.question.findMany({ where });
  return NextResponse.json(questions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const created = await prisma.question.create({ data: body });
  return NextResponse.json(created, { status: 201 });
}
