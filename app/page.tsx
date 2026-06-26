import React from "react";
import Header from "@/components/Header";
import SubjectCard from "@/components/SubjectCard";
import AddSubjectForm from "@/components/AddSubjectForm";

type Subject = {
  id: string;
  name: string;
  description: string;
  _count: { courses: number };
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CBT Prep Hub — Choose a Subject",
  description: "Select a subject to browse courses and start practising exam questions.",
};

export default async function HomePage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subjects`);
  let subjects: Subject[] = [];
  try {
    const payload = await res.json();
    if (Array.isArray(payload)) {
      subjects = payload;
    } else {
      console.error('api/subjects returned non-array:', payload);
      subjects = [];
    }
  } catch (err) {
    console.error('Failed to parse /api/subjects response', err);
    subjects = [];
  }

  return (
    <>
      <main className="flex-1 bg-navy px-4 sm:px-6 py-8 sm:py-12 md:px-10 lg:px-16">

        {/* Hero */}
        <section className="mb-16 max-w-3xl mx-auto text-center">
          <p className="section-label justify-center mb-5" style={{ gap: "0.75rem" }}>
            <span style={{ flex: "none", background: "none" }}>Your Exam Platform</span>
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl md:text-6xl font-bold tracking-tight text-offwhite mb-5 leading-[1.08]">
            Study smarter,{" "}
            <span
              className="text-gold"
              style={{
                textShadow: "0 0 40px rgba(201,168,76,0.35)",
              }}
            >
              pass faster.
            </span>
          </h1>
          <p className="text-muted-bright text-lg leading-relaxed max-w-xl mx-auto">
            Pick a subject, work through real exam-style questions, and track your progress — all in one focused workspace.
          </p>

          {/* Quick stats bar */}
          {subjects.length > 0 && (
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 rounded-xl bg-navy-surface border border-navy-border">
              <div className="text-center">
                <p className="text-xl font-bold text-offwhite">{subjects.length}</p>
                <p className="text-2xs text-muted uppercase tracking-wide mt-0.5">Subjects</p>
              </div>
              <div className="w-px h-8 bg-navy-border" />
              <div className="text-center">
                <p className="text-xl font-bold text-offwhite">
                  {subjects.reduce((sum, s) => sum + s._count.courses, 0)}
                </p>
                <p className="text-2xs text-muted uppercase tracking-wide mt-0.5">Courses</p>
              </div>
              <div className="w-px h-8 bg-navy-border" />
              <div className="text-center">
                <p className="text-xl font-bold text-gold">∞</p>
                <p className="text-2xs text-muted uppercase tracking-wide mt-0.5">Practice</p>
              </div>
            </div>
          )}
        </section>

        {/* Section header */}
        {subjects.length > 0 && (
          <div className="max-w-6xl mx-auto mb-6">
            <p className="section-label">
              <span>All Subjects</span>
            </p>
          </div>
        )}

        {/* Subjects grid */}
        {subjects.length === 0 ? (
          <div className="max-w-sm mx-auto text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gold/8 border border-gold/15 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <p className="text-offwhite font-semibold text-lg mb-2">No subjects yet</p>
            <p className="text-muted text-sm leading-relaxed">Create your first subject to start organising your study materials.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {subjects.map((s, i) => (
              <div key={s.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-slide-up">
                <SubjectCard
                  id={s.id}
                  name={s.name}
                  description={s.description}
                  _count={s._count}
                />
              </div>
            ))}
          </div>
        )}

        {/* Add Subject */}
        <AddSubjectForm />
      </main>
    </>
  );
}
