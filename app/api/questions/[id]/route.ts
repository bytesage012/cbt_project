// app/api/questions/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getQuestionTable(supabase: any, id: number) {
  let result = await supabase.from('questions').select('*').eq('id', id).single();
  if (!result.error) return result;
  return await supabase.from('Question').select('*').eq('id', id).single();
}

async function updateQuestionTable(supabase: any, id: number, data: any) {
  let result = await supabase.from('questions').update(data).eq('id', id).select().single();
  if (!result.error) return result;
  return await supabase.from('Question').update(data).eq('id', id).select().single();
}

async function deleteQuestionTable(supabase: any, id: number) {
  let result = await supabase.from('questions').delete().eq('id', id);
  if (!result.error) return result;
  return await supabase.from('Question').delete().eq('id', id);
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data, error } = await getQuestionTable(supabase, Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data: any = await request.json();
  const supabase = await createClient();
  const { data: updated, error } = await updateQuestionTable(supabase, Number(id), data);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { error } = await deleteQuestionTable(supabase, Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
