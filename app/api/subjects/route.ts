import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('subjects').select('id, name, courses(id)');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const subjects = (data || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    _count: { courses: (s.courses || []).length },
  }));
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from('subjects').insert({ name }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
