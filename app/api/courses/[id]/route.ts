import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data, error } = await supabase.from('courses').select('*, questions(*)').eq('id', Number(id)).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await request.json();
  const supabase = await createClient();
  const { data: updated, error } = await supabase.from('courses').update(data).eq('id', Number(id)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const courseId = Number(id);
  const supabase = await createClient();
  // Delete questions then course
  let res = await supabase.from('questions').delete().eq('courseId', courseId);
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  res = await supabase.from('courses').delete().eq('id', courseId);
  if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
