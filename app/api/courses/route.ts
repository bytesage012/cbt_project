// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const courses = await prisma.course.findMany({ include: { subject: true } });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const { title, subjectId } = await req.json();
  if (!title || !subjectId) {
    return NextResponse.json({ error: 'title and subjectId required' }, { status: 400 });
  }
  const course = await prisma.course.create({
    data: { title, subjectId: Number(subjectId) },
  });
  return NextResponse.json(course, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id query param required' }, { status: 400 });
  }
  await prisma.course.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
