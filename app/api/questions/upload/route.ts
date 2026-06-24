// app/api/questions/upload/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { questions } = await request.json();
  if (!Array.isArray(questions)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const data = questions.map((q: any) => ({
    prompt: q.prompt,
    options: JSON.stringify(q.options),
    answer: q.answer,
    difficulty: q.difficulty,
    courseId: q.courseId,
  }));
  const result = await prisma.question.createMany({ data });
  return NextResponse.json({ inserted: result.count });
}
