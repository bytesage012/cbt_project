"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BulkUploader from "@/components/BulkUploader";
import QuestionTable from "@/components/QuestionTable";
import QuestionForm from "@/components/QuestionForm";
import DeleteButton from "@/components/DeleteButton";
import type { Question } from "@/lib/types";

type Course = {
  id: number;
  title: string;
  subjectId: number;
};

type CoursePageClientProps = {
  course: Course;
  initialQuestions: Question[];
  courseId: string;
};

export default function CoursePageClient({ course, initialQuestions, courseId }: CoursePageClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [showForm, setShowForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | undefined>();
  const [showUploader, setShowUploader] = useState(false);

  const refresh = async () => {
    const qRes = await fetch(`/api/questions?courseId=${courseId}`);
    const questionsData = await qRes.json();
    setQuestions(Array.isArray(questionsData) ? questionsData : []);
  };

  const handleDeleteQuestion = async (id: string) => {
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    refresh();
  };

  const handleDeleteCourse = async () => {
    await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    if (course?.subjectId) {
      router.push(`/subjects/${course.subjectId}`);
    } else {
      router.push("/");
    }
    router.refresh();
  };

  const handleEdit = (q: Question) => {
    setEditQuestion(q);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditQuestion(undefined);
  };

  return (
    <>
      <main className="flex-1 bg-navy px-6 py-10 md:px-10 lg:px-16">
        <nav className="flex items-center gap-2 text-sm text-muted mb-8 animate-fade-in">
          <Link href="/" className="hover:text-gold transition-colors duration-150 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-border"><path d="M9 18l6-6-6-6"/></svg>
          <Link href={`/subjects/${course.subjectId}`} className="hover:text-gold transition-colors duration-150">
            Subject
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-border"><path d="M9 18l6-6-6-6"/></svg>
          <span className="text-offwhite-dim font-medium truncate max-w-[200px]">
            {course.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-offwhite mb-1 leading-tight">
              {course.title}
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
              <span className="hidden xs:inline">Add Question</span><span className="xs:hidden">Add</span>
            </button>
            <button className="btn-secondary text-sm" onClick={() => setShowUploader(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </button>
            <Link href={`/exam/${courseId}`} className="btn-primary text-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start Exam
            </Link>
            <DeleteButton
              label={course.title}
              onConfirm={handleDeleteCourse}
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <QuestionTable questions={questions} onDelete={handleDeleteQuestion} onEdit={handleEdit} />
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-navy/85 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bg-navy-surface border border-navy-border rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-lg animate-scale-in shadow-modal max-h-[90vh] overflow-y-auto">
            <QuestionForm
              courseId={courseId}
              question={editQuestion}
              onSuccess={() => { closeForm(); refresh(); }}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {showUploader && (
        <div className="fixed inset-0 bg-navy/85 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bg-navy-surface border border-navy-border rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-lg animate-scale-in shadow-modal">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-offwhite">Upload Questions</h2>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-offwhite hover:bg-white/8 transition-all duration-150"
                onClick={() => setShowUploader(false)}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <BulkUploader
              courseId={courseId}
              onSuccess={() => { setShowUploader(false); refresh(); }}
            />
          </div>
        </div>
      )}
    </>
  );
}
