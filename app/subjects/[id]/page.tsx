import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import AddCourseForm from "@/components/AddCourseForm";

type Course = {
  id: string;
  name: string;
  description: string;
  _count: { questions: number };
};

type Subject = {
  id: string;
  name: string;
  description: string;
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
    <>
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
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold tracking-tight text-offwhite mb-2 leading-tight">
                {subject.name}
              </h1>
              {subject.description && (
                <p className="text-muted-bright text-base max-w-2xl leading-relaxed">
                  {subject.description}
                </p>
              )}
            </div>
            {/* Stats chips */}
            <div className="flex items-center gap-3 flex-shrink-0">
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

        {/* Courses grid */}
        {subject.courses.length === 0 ? (
          <div className="max-w-sm mx-auto text-center py-24 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gold/8 border border-gold/15 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p className="text-offwhite font-semibold text-lg mb-2">No courses yet</p>
            <p className="text-muted text-sm leading-relaxed">Add your first course to this subject to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
            {subject.courses.map((c, i) => (
              <div key={c.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-slide-up">
                <CourseCard
                  id={c.id}
                  name={c.name}
                  description={c.description}
                  _count={c._count}
                />
              </div>
            ))}
          </div>
        )}

        <AddCourseForm subjectId={subject.id} />
      </main>
    </>
  );
}
