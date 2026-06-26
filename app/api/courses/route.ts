// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('courses').select('*, subject(*)');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const { title, subjectId } = await req.json();
  if (!title || !subjectId) return NextResponse.json({ error: 'title and subjectId required' }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from('courses').insert({ title, subjectId: Number(subjectId) }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id query param required' }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from('courses').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
