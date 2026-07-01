"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";
import ExamQuestion from "@/components/ExamQuestion";

type AnswerState = {
  selectedAnswer: string | null;
  isCorrect?: boolean;
};

type ReviewPayload = {
  courseId: number;
  mode: "exam" | "practice";
  questions: Question[];
  answers: Record<number, AnswerState>;
  timeTaken: number;
};

type ReviewPageClientProps = {
  courseId: number;
};

export default function ReviewPageClient({ courseId }: ReviewPageClientProps) {
  const [payload, setPayload] = useState<ReviewPayload | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(`exam-review-${courseId}`);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ReviewPayload;
      setPayload(parsed);
    } catch {
      setPayload(null);
    }
  }, [courseId]);

  const summary = useMemo(() => {
    if (!payload) return null;
    const correct = Object.values(payload.answers).filter((answer) => answer.isCorrect).length;
    const total = payload.questions.length;
    return {
      correct,
      total,
      percent: total ? Math.round((correct / total) * 100) : 0,
      timeTaken: payload.timeTaken,
      mode: payload.mode,
    };
  }, [payload]);

  if (!payload || !summary) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold text-offwhite">No review data found.</p>
          <p className="text-sm text-muted mt-2">Finish an exam first to open the review page.</p>
          <Link href={`/courses/${courseId}`} className="btn-primary mt-6 inline-flex">
            Back to course
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = payload.questions[currentIdx];
  const currentAnswer = payload.answers[currentQuestion.id]?.selectedAnswer ?? null;

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <div className="sticky top-0 z-40 bg-navy-mid/95 backdrop-blur-md border-b border-navy-border px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/courses/${courseId}`} className="text-muted hover:text-gold transition-colors" aria-label="Back to course page">
              ← Back
            </Link>
            <span className="text-[0.75rem] uppercase tracking-[0.18em] text-muted font-semibold">
              Review answers
            </span>
            <span className="px-3 py-1 rounded-full bg-navy-surface border border-navy-border text-[0.6875rem] text-offwhite">
              {summary.correct}/{summary.total} correct
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="rounded-xl border border-navy-border bg-navy-deep px-3 py-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
              {summary.percent}% score
            </div>
            <div className="rounded-xl border border-navy-border bg-navy-deep px-3 py-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
              {summary.mode} mode
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 rounded-2xl border border-navy-border bg-navy-surface/90 p-4 sm:p-5">
            <p className="text-sm text-muted">Review your responses, see the correct answer, and read the explanation for each question.</p>
          </div>

          <ExamQuestion
            question={currentQuestion}
            questionNumber={currentIdx + 1}
            total={payload.questions.length}
            selectedAnswer={currentAnswer}
            onAnswer={() => {}}
            mode="practice"
            showFeedback={true}
            readOnly
          />

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              className="btn-secondary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>
            <div className="flex flex-wrap gap-2 justify-center">
              {payload.questions.map((question, index) => {
                const answered = Boolean(payload.answers[question.id]?.selectedAnswer);
                const isActive = index === currentIdx;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentIdx(index)}
                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-gold text-navy"
                        : answered
                        ? "bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                        : "bg-navy-surface text-muted hover:bg-white/5 hover:text-offwhite"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <button
              className="btn-primary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setCurrentIdx((prev) => Math.min(payload.questions.length - 1, prev + 1))}
              disabled={currentIdx === payload.questions.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
