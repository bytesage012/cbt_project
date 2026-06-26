// app/api/questions/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get('courseId');
  const supabase = await createClient();
  let query = supabase.from('questions').select('*');
  if (courseId) query = query.eq('courseId', Number(courseId));
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase.from('questions').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
