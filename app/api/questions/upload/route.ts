// app/api/questions/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  let body: any;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.questions)) {
    return NextResponse.json({ error: 'Payload must include a questions array' }, { status: 400 });
  }

  type QuestionUploadItem = {
    prompt: string;
    options: string;
    answer: string | null;
    difficulty: string;
    explanation: string | null;
    courseId: number;
  };

  const data: QuestionUploadItem[] = body.questions.map((q: any) => {
    const options = typeof q.options === 'string'
      ? q.options
      : Array.isArray(q.options)
      ? JSON.stringify(q.options)
      : JSON.stringify([]);

    return {
      prompt: String(q.prompt ?? '').trim(),
      options,
      answer: q.answer ?? null,
      difficulty: q.difficulty ?? 'easy',
      explanation: q.explanation ?? null,
      courseId: Number(q.courseId),
    };
  });

  const invalidItem = data.find((item: QuestionUploadItem) => !item.prompt || !item.options || Number.isNaN(item.courseId));
  if (invalidItem) {
    return NextResponse.json({ error: 'One or more uploaded questions are missing required fields or have an invalid courseId' }, { status: 400 });
  }

  const supabase = await createClient();

  async function tryInsert(table: string) {
    return await supabase.from(table).insert(data, { returning: 'minimal' });
  }

  let insertResult = await tryInsert('questions');
  if (insertResult.error) {
    const message = String(insertResult.error.message || 'Unknown upload error');
    if (message.includes('returned row structure does not match the structure of the triggering table')) {
      // Try the alternative table name if the schema may use a different casing.
      insertResult = await tryInsert('Question');
    }
  }

  if (insertResult.error) {
    const message = String(insertResult.error.message || 'Unknown upload error');
    if (message.includes('returned row structure does not match the structure of the triggering table')) {
      let insertedCount = 0;
      for (const row of data) {
        const { error: rowError } = await supabase.from('Question').insert(row, { returning: 'minimal' });
        if (rowError) {
          return NextResponse.json({ error: `Bulk upload failed at row ${insertedCount + 1}: ${rowError.message}` }, { status: 500 });
        }
        insertedCount += 1;
      }
      return NextResponse.json({ inserted: insertedCount });
    }

    return NextResponse.json({ error: message, details: insertResult.error.details ?? null }, { status: 500 });
  }

  return NextResponse.json({ inserted: data.length });
}
