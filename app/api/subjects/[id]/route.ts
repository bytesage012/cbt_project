import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data: subject, error: subjectErr } = await supabase
    .from('subjects')
    .select('id,name')
    .eq('id', Number(id))
    .single();
  if (subjectErr || !subject) return NextResponse.json({ error: subjectErr?.message || 'Not found' }, { status: 404 });

  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('id,title')
    .eq('subjectId', Number(id));
  if (coursesErr) return NextResponse.json({ error: coursesErr.message }, { status: 500 });

  const courseIds = (courses || []).map((c: any) => c.id);
  let questions: any[] = [];
  if (courseIds.length > 0) {
    const { data: qs, error: qErr } = await supabase.from('questions').select('id,courseId').in('courseId', courseIds);
    if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
    questions = qs || [];
  }

  const coursesWithCount = (courses || []).map((c: any) => ({
    ...c,
    _count: { questions: (questions.filter((q) => q.courseId === c.id) || []).length },
  }));

  return NextResponse.json({ ...subject, courses: coursesWithCount });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await request.json();
  const supabase = await createClient();
  const { data: updated, error } = await supabase.from('subjects').update(data).eq('id', Number(id)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const subjectId = Number(id);
  const supabase = await createClient();

  const { data: courses, error: coursesErr } = await supabase.from('courses').select('id').eq('subjectId', subjectId);
  if (coursesErr) return NextResponse.json({ error: coursesErr.message }, { status: 500 });
  const courseIds = (courses || []).map((c: any) => c.id);

  if (courseIds.length > 0) {
    const { error: qErr } = await supabase.from('questions').delete().in('courseId', courseIds);
    if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  }

  const { error: cErr } = await supabase.from('courses').delete().eq('subjectId', subjectId);
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  const { error: sErr } = await supabase.from('subjects').delete().eq('id', subjectId);
  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
