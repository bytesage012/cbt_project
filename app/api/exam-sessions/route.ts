import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type StartExamBody = {
  courseId: number;
  mode: 'exam' | 'practice';
  durationSeconds: number;
  totalQuestions: number;
  questionIds: number[];
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { courseId, mode, durationSeconds, totalQuestions } = (body as StartExamBody);
  const questionIds = Array.isArray((body as any).questionIds) ? (body as any).questionIds : [];

  if (!courseId || !mode || !durationSeconds || !totalQuestions || questionIds.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from('exam_sessions')
    .insert(
      {
        course_id: courseId,
        mode,
        duration_seconds: durationSeconds,
        total_questions: totalQuestions,
      },
      { returning: 'representation' }
    )
    .select('id, course_id, mode, total_questions, duration_seconds, started_at, completed_at, score, status')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, details: error.details ?? null }, { status: 500 });
  }

  return NextResponse.json(session, { status: 201 });
}
