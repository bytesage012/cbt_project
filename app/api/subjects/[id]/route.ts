import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const subject = await prisma.subject.findUnique({
    where: { id: Number(id) },
    include: { courses: { include: { _count: { select: { questions: true } } } } },
  });
  if (!subject) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(subject);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await request.json();
  const updated = await prisma.subject.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const subjectId = Number(id);

  // Fetch all courses under this subject
  const courses = await prisma.course.findMany({
    where: { subjectId },
    select: { id: true },
  });
  const courseIds = courses.map((c) => c.id);

  // Delete all questions in those courses first
  if (courseIds.length > 0) {
    await prisma.question.deleteMany({ where: { courseId: { in: courseIds } } });
  }

  // Delete all courses
  await prisma.course.deleteMany({ where: { subjectId } });

  // Delete the subject
  await prisma.subject.delete({ where: { id: subjectId } });

  return NextResponse.json({ deleted: true });
}
