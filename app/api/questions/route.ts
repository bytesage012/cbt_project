// app/api/questions/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getQuestionsTable(supabase: any) {
  const { data, error } = await supabase.from('questions').select('*');
  if (!error) return { data, error: null };
  return await supabase.from('Question').select('*');
}

async function getQuestionsTableWithFilter(supabase: any, courseId: number) {
  let result = await supabase.from('questions').select('*').eq('courseId', courseId);
  if (!result.error) return result;
  result = await supabase.from('Question').select('*').eq('courseId', courseId);
  return result;
}

async function insertQuestion(supabase: any, body: any) {
  let result = await supabase.from('questions').insert(body).select().single();
  if (!result.error) return result;
  result = await supabase.from('Question').insert(body).select().single();
  return result;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get('courseId');
  const supabase = await createClient();

  const result = courseId
    ? await getQuestionsTableWithFilter(supabase, Number(courseId))
    : await getQuestionsTable(supabase);

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  const { data, error } = await insertQuestion(supabase, body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
