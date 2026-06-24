import React from "react";
import Link from "next/link";
import AddCourseForm from "@/components/AddCourseForm";
import SubjectActions from "@/components/SubjectActions";

type Course = {
  id: number;
  title: string;
  subjectId: number;
  _count: { questions: number };
};

type Subject = {
  id: number;
  name: string;
  courses: Course[];
};

export const dynamic = "force-dynamic";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subjects/${id}`);
  const subject: Subject = await res.json();

  const totalQuestions = subject.courses.reduce((sum, c) => sum + c._count.questions, 0);

  return (
    <main className="flex-1 bg-navy px-6 py-10 md:px-10 lg:px-16">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-8 animate-fade-in">
        <Link href="/" className="hover:text-gold transition-colors duration-150 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-border"><path d="M9 18l6-6-6-6"/></svg>
        <span className="text-offwhite-dim font-medium">{subject.name}</span>
      </nav>

      {/* Heading block */}
      <div className="mb-10 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-offwhite mb-2 leading-tight">
              {subject.name}
            </h1>
          </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0 flex-shrink-0">
            <div className="px-4 py-2 rounded-lg bg-navy-surface border border-navy-border text-center">
              <p className="text-lg font-bold text-offwhite">{subject.courses.length}</p>
              <p className="text-[0.6875rem] text-muted uppercase tracking-wide">Courses</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-navy-surface border border-navy-border text-center">
              <p className="text-lg font-bold text-gold">{totalQuestions}</p>
              <p className="text-[0.6875rem] text-muted uppercase tracking-wide">Questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section label */}
      {subject.courses.length > 0 && (
        <div className="mb-5">
          <p className="section-label"><span>Courses</span></p>
        </div>
      )}

      {/* Courses grid + delete — client interactive */}
      <SubjectActions
        subjectId={String(subject.id)}
        subjectName={subject.name}
        courses={subject.courses.map((c) => ({
          id: String(c.id),
          title: c.title,
          _count: c._count,
        }))}
      />

      <AddCourseForm subjectId={String(subject.id)} />
    </main>
  );
}
