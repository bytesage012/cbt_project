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
  const body: StartExamBody = await req.json();
  const { courseId, mode, durationSeconds, totalQuestions, questionIds } = body;

  if (!courseId || !mode || !durationSeconds || !totalQuestions || !questionIds.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = await createClient();

  // Create exam session
  const { data: session, error } = await supabase
    .from('exam_sessions')
    .insert({
      course_id: courseId,
      mode,
      duration_seconds: durationSeconds,
      total_questions: totalQuestions,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(session, { status: 201 });
}
