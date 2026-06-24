"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BulkUploader from "@/components/BulkUploader";
import QuestionTable from "@/components/QuestionTable";
import QuestionForm from "@/components/QuestionForm";
import type { Question } from "@/lib/types";

type Course = {
  id: string;
  title: string;
  subjectId: number;
};

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function CoursePage({ params }: { params: { id: string } }) {
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [showForm, setShowForm]         = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | undefined>();
  const [showUploader, setShowUploader] = useState(false);
  const [course, setCourse]             = useState<Course | null>(null);

  useEffect(() => {
    const load = async () => {
      const [cRes, qRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${params.id}`),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions?courseId=${params.id}`),
      ]);
      setCourse(await cRes.json());
      setQuestions(await qRes.json());
    };
    load();
  }, [params.id]);

  const refresh = async () => {
    const qRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions?courseId=${params.id}`);
    setQuestions(await qRes.json());
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    refresh();
  };

  const handleEdit = (q: Question) => {
    setEditQuestion(q);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditQuestion(undefined); };

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
          <span className="text-offwhite-dim font-medium truncate max-w-[200px]">
            {course?.title ?? "Course"}
          </span>
        </nav>

        {/* Heading + actions */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-offwhite mb-1 leading-tight">
              {course?.title ?? "Loading…"}
            </h1>
            <p className="text-muted text-sm">
              <span className="text-gold font-semibold">{questions.length}</span>{" "}
              question{questions.length !== 1 ? "s" : ""} in this course
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn-ghost text-sm"
              onClick={() => { setEditQuestion(undefined); setShowForm(true); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Question
            </button>
            <button className="btn-secondary text-sm" onClick={() => setShowUploader(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </button>
            <a href={`/exam/${params.id}`} className="btn-primary text-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start Exam
            </a>
          </div>
        </div>

        {/* Question table */}
        <QuestionTable questions={questions} onDelete={handleDelete} onEdit={handleEdit} />
      </main>

      {/* Modal: Question form */}
      {showForm && (
        <div className="fixed inset-0 bg-navy/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-navy-surface border border-navy-border rounded-xl p-6 w-full max-w-lg animate-scale-in shadow-modal">
            <QuestionForm
              courseId={params.id}
              question={editQuestion}
              onSuccess={() => { closeForm(); refresh(); }}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {/* Modal: Bulk uploader */}
      {showUploader && (
        <div className="fixed inset-0 bg-navy/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-navy-surface border border-navy-border rounded-xl p-6 w-full max-w-lg animate-scale-in shadow-modal">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-offwhite">Upload Questions</h2>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-offwhite hover:bg-white/8 transition-all duration-150"
                onClick={() => setShowUploader(false)}
                aria-label="Close"
              >
                <XIcon />
              </button>
            </div>
            <BulkUploader
              courseId={params.id}
              onSuccess={() => { setShowUploader(false); refresh(); }}
            />
          </div>
        </div>
      )}
    </>
  );
}
