"use client";
import React, { useEffect, useState, useCallback } from "react";
import ExamTimer from "@/components/ExamTimer";
import ExamQuestion from "@/components/ExamQuestion";
import ScoreCard from "@/components/ScoreCard";
import type { Question } from "@/lib/types";

export default function ExamPage({ params }: { params: Promise<{ courseId: string }> }) {
  const paramsUnwrapped = React.use(params);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<Record<number, string>>({});
  const [duration, setDuration]     = useState(30 * 60);
  const [finished, setFinished]     = useState(false);
  const [timeTaken, setTimeTaken]   = useState(0);
  const [startTime]                 = useState(() => Date.now());
  const [showNav, setShowNav]       = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const res = await fetch("/api/config");
      const cfg = await res.json();
      const dur = cfg.find((c: any) => c.key === "examDurationMinutes");
      if (dur?.value) setDuration(Number(dur.value) * 60);
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions?courseId=${paramsUnwrapped.courseId}`);
      setQuestions(await res.json());
    };
    load();
  }, [paramsUnwrapped.courseId]);

  const handleAnswer = (ans: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentIdx].id]: ans }));
  };

  const submit = useCallback(() => {
    setTimeTaken(Math.round((Date.now() - startTime) / 1000));
    setFinished(true);
  }, [startTime]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted text-sm">Loading questions…</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    const results = questions.map((q) => ({ question: q, userAnswer: answers[q.id] ?? null }));
    return (
      <ScoreCard
        total={questions.length}
        correct={correct}
        timeTaken={timeTaken}
        results={results}
      />
    );
  }

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-navy flex flex-col">

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-navy-mid/95 backdrop-blur-md border-b border-navy-border px-3 sm:px-6 md:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: home icon + progress */}
        <div className="flex items-center gap-2 min-w-0">
          <a href="/" className="text-muted hover:text-gold transition-colors flex-shrink-0" aria-label="Home">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </a>
          <span className="text-[0.6875rem] text-muted font-semibold">
            {answeredCount}/{questions.length}
          </span>
          <span className="text-offwhite-dim text-xs font-medium hidden sm:block">answered</span>
        </div>

        {/* Center: timer */}
        <ExamTimer durationSeconds={duration} onTimeUp={submit} />

        {/* Right: submit */}
        <button className="btn-primary text-xs py-2 px-4 flex-shrink-0" onClick={submit}>
          Submit
        </button>
      </div>

      {/* Main question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-10 animate-fade-in" key={currentIdx}>
        <ExamQuestion
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          total={questions.length}
          selectedAnswer={answers[currentQuestion.id] ?? null}
          onAnswer={handleAnswer}
        />

        {/* Prev / Next */}
        <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-2xl">
          <button
            className="btn-secondary flex-1 disabled:opacity-30"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => i - 1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Previous
          </button>
          {currentIdx < questions.length - 1 ? (
            <button
              className="btn-primary flex-1"
              onClick={() => setCurrentIdx((i) => i + 1)}
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          ) : (
            <button className="btn-primary flex-1" onClick={submit}>
              Finish Exam
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Question navigator */}
      <div className="border-t border-navy-border bg-navy-mid px-4 md:px-8 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            className="flex items-center gap-2 text-[0.6875rem] text-muted uppercase tracking-widest font-semibold mb-3 hover:text-offwhite transition-colors"
            onClick={() => setShowNav(n => !n)}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {showNav ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
            </svg>
            Question Navigator
          </button>

          {showNav && (
            <div className="flex flex-wrap gap-1.5 mb-2 animate-slide-up">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent  = i === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    aria-label={`Go to question ${i + 1}`}
                    className="w-7 h-7 text-[11px] font-bold rounded-md border transition-all duration-100"
                    style={{
                      background: isCurrent
                        ? "var(--gold)"
                        : isAnswered
                        ? "rgba(201,168,76,0.15)"
                        : "var(--navy-surface)",
                      color: isCurrent ? "var(--navy)" : isAnswered ? "var(--gold)" : "var(--muted)",
                      borderColor: isCurrent
                        ? "var(--gold)"
                        : isAnswered
                        ? "rgba(201,168,76,0.35)"
                        : "var(--border)",
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-[0.6875rem] text-muted">
            <span className="text-gold font-semibold">{answeredCount}</span> of {questions.length} answered
          </p>
        </div>
      </div>
    </div>
  );
}
