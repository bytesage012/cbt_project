import { createClient } from "@/lib/supabase/server";
import CoursePageClient from "@/components/CoursePageClient";

type Course = {
  id: number;
  title: string;
  subjectId: number;
};

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

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id,title,subjectId")
    .eq("id", Number(id))
    .single();

  if (courseError || !course) {
    return (
      <main className="flex-1 bg-navy px-6 py-10 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-offwhite">Course not found</h2>
          <p className="text-muted mt-2">The requested course does not exist or could not be loaded.</p>
        </div>
      </main>
    );
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("courseId", Number(id));

  return (
    <CoursePageClient
      course={course as Course}
      initialQuestions={Array.isArray(questions) ? questions : []}
      courseId={id}
    />
  );
}
