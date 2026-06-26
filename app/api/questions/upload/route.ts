// app/api/questions/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    courseId: Number(q.courseId),
  }));
  const supabase = await createClient();
  const { data: inserted, error } = await supabase.from('questions').insert(data).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inserted: (inserted || []).length });
}
