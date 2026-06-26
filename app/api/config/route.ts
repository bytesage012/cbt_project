import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type ConfigInput = { key: string; value: string };

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('config').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from('config').upsert({ key, value }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from('config').delete().eq('key', key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
