import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data: session, error: sessionErr } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const { data: answers, error: answersErr } = await supabase
    .from('exam_answers')
    .select('*, questions(*)')
    .eq('exam_session_id', Number(id));

  if (answersErr) return NextResponse.json({ error: answersErr.message }, { status: 500 });

  return NextResponse.json({ session, answers: answers || [] });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const { questionId, selectedAnswer, timeSpent } = body;

  if (!questionId || selectedAnswer === undefined) {
    return NextResponse.json({ error: 'Missing questionId or selectedAnswer' }, { status: 400 });
  }

  const supabase = await createClient();

  // Get correct answer
  const { data: question, error: qErr } = await supabase
    .from('questions')
    .select('answer')
    .eq('id', questionId)
    .single();

  if (qErr || !question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

  const isCorrect = question.answer === selectedAnswer;

  // Save answer
  const { data: answer, error } = await supabase
    .from('exam_answers')
    .insert({
      exam_session_id: Number(id),
      question_id: questionId,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      time_spent_seconds: timeSpent || 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ answer, isCorrect }, { status: 201 });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();

  // Get session with answers to calculate score
  const { data: answers, error: answersErr } = await supabase
    .from('exam_answers')
    .select('is_correct')
    .eq('exam_session_id', Number(id));

  if (answersErr) return NextResponse.json({ error: answersErr.message }, { status: 500 });

  const correct = answers?.filter((a: any) => a.is_correct).length || 0;
  const percentage = answers?.length ? Math.round((correct / answers.length) * 100) : 0;

  // Complete session
  const { data: session, error } = await supabase
    .from('exam_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      score: percentage,
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ session, score: percentage, correct, total: answers?.length || 0 });
}
