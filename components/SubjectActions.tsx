"use client";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import CourseCard from "@/components/CourseCard";

type Course = {
  id: string;
  title: string;
  _count: { questions: number };
};

type SubjectActionsProps = {
  subjectId: string;
  subjectName: string;
  courses: Course[];
};

export default function SubjectActions({ subjectId, subjectName, courses }: SubjectActionsProps) {
  const router = useRouter();

  const deleteSubject = async () => {
    await fetch(`/api/subjects/${subjectId}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  const deleteCourse = async (courseId: string) => {
    await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Courses grid with per-card delete */}
      {courses.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {courses.map((c, i) => (
            <div key={c.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-slide-up">
              <CourseCard
                id={c.id}
                name={c.title}
                description=""
                _count={c._count}
                onDelete={() => deleteCourse(c.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Delete subject — always shown at the bottom */}
      <div className="pt-4 border-t border-navy-border flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <p className="text-sm text-muted flex-1">
          Permanently remove <span className="text-offwhite font-medium">{subjectName}</span> and all its courses and questions.
        </p>
        <DeleteButton label={subjectName} onConfirm={deleteSubject} />
      </div>
    </div>
  );
}
