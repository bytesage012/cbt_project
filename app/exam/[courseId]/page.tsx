import { createClient } from "@/lib/supabase/server";
import ExamPageClient from "@/components/ExamPageClient";
import ReviewPageClient from "@/components/ReviewPageClient";

type Question = {
  id: number;
  prompt: string;
  options: string;
  answer?: string | null;
  difficulty: string;
  explanation?: string | null;
  courseId: number;
};

export const dynamic = "force-dynamic";

export default async function ExamPage({ params, searchParams }: { params: Promise<{ courseId: string }>; searchParams?: Promise<{ review?: string }> }) {
  const { courseId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  if (resolvedSearchParams.review === "1") {
    return <ReviewPageClient courseId={Number(courseId)} />;
  }
  const id = Number(courseId);
  const supabase = await createClient();
  const { data: questions } = await supabase.from("questions").select("*").eq("courseId", id);

  return (
    <ExamPageClient
      courseId={id}
      initialQuestions={Array.isArray(questions) ? questions : []}
    />
  );
}
