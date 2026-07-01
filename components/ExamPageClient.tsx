"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ExamTimer from "@/components/ExamTimer";
import ExamQuestion from "@/components/ExamQuestion";
import ScoreCard from "@/components/ScoreCard";
import ExamConfiguration from "@/components/ExamConfiguration";
import type { Question } from "@/lib/types";
import { getQuestionAnswerLabel, isQuestionAnswerCorrect } from "@/lib/types";

type AnswerState = {
  selectedAnswer: string | null;
  isCorrect?: boolean;
};

type ExamPageClientProps = {
  courseId: number;
  initialQuestions: Question[];
};

export default function ExamPageClient({ courseId, initialQuestions }: ExamPageClientProps) {
  const [allQuestions] = useState<Question[]>(initialQuestions);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showConfig, setShowConfig] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"exam" | "practice">("exam");
  const [duration, setDuration] = useState(30 * 60);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const answersRef = useRef<Record<number, AnswerState>>({});
  const [practiceReview, setPracticeReview] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);

  const handleExamStart = useCallback(async (config: { mode: "exam" | "practice"; durationMinutes: number; questionCount: number; shuffleQuestions: boolean }) => {
    setIsLoading(true);
    setMode(config.mode);
    setDuration(config.durationMinutes * 60);
    setPracticeReview(null);
    setCurrentIdx(0);

    let selectedQuestions = [...allQuestions];
    if (config.shuffleQuestions) {
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
    }
    selectedQuestions = selectedQuestions.slice(0, config.questionCount);
    setQuestions(selectedQuestions);
    setAnswers({});
    setFinished(false);
    setStartTime(Date.now());

    if (config.mode === "exam") {
      const response = await fetch("/api/exam-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          mode: config.mode,
          durationSeconds: config.durationMinutes * 60,
          totalQuestions: selectedQuestions.length,
          questionIds: selectedQuestions.map((q) => q.id),
        }),
      });
      if (response.ok) {
        const body = await response.json();
        setSessionId(body.id ?? null);
      } else {
        const body = await response.json().catch(() => ({}));
        console.error("Exam session start failed:", body);
        alert(`Unable to start exam: ${body.error ?? 'Unknown error'}`);
      }
    }

    setShowConfig(false);
    setIsLoading(false);
  }, [allQuestions, courseId]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const finishExam = useCallback(async () => {
    const timeTakenSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    setTimeTaken(timeTakenSeconds);

    if (sessionId) {
      await fetch(`/api/exam-sessions/${sessionId}`, { method: "PUT" });
    }

    const reviewAnswers = Object.fromEntries(
      questions.map((question) => [question.id, answersRef.current[question.id] ?? { selectedAnswer: null, isCorrect: false }])
    );

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        `exam-review-${courseId}`,
        JSON.stringify({
          courseId,
          mode,
          questions,
          answers: reviewAnswers,
          timeTaken: timeTakenSeconds,
        })
      );
    }

    setFinished(true);
  }, [courseId, mode, questions, sessionId, startTime]);

  const handleAnswer = useCallback((answer: string) => {
    if (mode === "practice" && practiceReview) return;
    const question = questions[currentIdx];
    if (!question) return;

    const isCorrect = isQuestionAnswerCorrect(question, answer);
    const answerDetails = getQuestionAnswerLabel(question);
    const correctLabel = answerDetails.label ?? question.answer ?? answer;
    const nextAnswer = { selectedAnswer: answer, isCorrect };

    answersRef.current = {
      ...answersRef.current,
      [question.id]: nextAnswer,
    };
    setAnswers(answersRef.current);

    if (mode === "practice") {
      const explanationText = question.explanation
        ? question.explanation
        : isCorrect
        ? `✓ Correct! The answer is "${correctLabel}."`
        : `✗ Incorrect. The correct answer is "${correctLabel}."`;

      setPracticeReview({
        isCorrect,
        explanation: explanationText,
      });
    }
  }, [currentIdx, mode, questions, practiceReview]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIdx(index);
    setPracticeReview(null);
  }, []);

  const handleNextQuestion = useCallback(() => {
    setPracticeReview(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishExam();
    }
  }, [currentIdx, questions.length, finishExam]);

  const submit = useCallback(() => {
    finishExam();
  }, [finishExam]);

  if (showConfig) {
    return (
      <ExamConfiguration
        totalAvailable={allQuestions.length}
        onStart={handleExamStart}
        isLoading={isLoading}
      />
    );
  }

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
    const correct = Object.values(answers).filter((item) => item.isCorrect).length;
    const results = questions.map((question) => ({
      question,
      userAnswer: answers[question.id]?.selectedAnswer ?? null,
      isCorrect: answers[question.id]?.isCorrect,
    }));

    return <ScoreCard courseId={courseId} total={questions.length} correct={correct} timeTaken={timeTaken} results={results} />;
  }

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIdx];
  const selectedAnswer = answers[currentQuestion.id]?.selectedAnswer ?? null;

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <div className="sticky top-0 z-40 bg-navy-mid/95 backdrop-blur-md border-b border-navy-border px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/courses/${courseId}`} className="text-muted hover:text-gold transition-colors" aria-label="Back to course page">
              ← Back
            </Link>
            <span className="text-[0.75rem] uppercase tracking-[0.18em] text-muted font-semibold">
              {mode === "exam" ? "Exam mode" : "Practice mode"}
            </span>
            <span className="px-3 py-1 rounded-full bg-navy-surface border border-navy-border text-[0.6875rem] text-offwhite">
              {answeredCount}/{questions.length} answered
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {mode === "exam" ? (
              <div className="flex items-center gap-2 rounded-xl border border-navy-border bg-navy-deep px-3 py-2" aria-label="Time remaining">
                <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">Time</span>
                <ExamTimer durationSeconds={duration} onTimeUp={finishExam} />
              </div>
            ) : null}
            <button
              className="text-xs uppercase tracking-[0.16em] text-muted hover:text-offwhite"
              onClick={() => setShowNav((prev) => !prev)}
            >
              {showNav ? 'Hide' : 'Show'} map
            </button>
            <button className="btn-primary text-xs py-2 px-3" onClick={submit}>
              {mode === "practice" ? "Finish" : "Submit"}
            </button>
          </div>
        </div>

        {showNav && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex items-center gap-2">
              {questions.map((question, index) => {
                const answered = Boolean(answers[question.id]?.selectedAnswer);
                const isActive = index === currentIdx;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    className={`w-9 h-9 rounded-full text-[0.65rem] font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-gold text-navy"
                        : answered
                        ? "bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                        : "bg-navy-surface text-muted hover:bg-white/5 hover:text-offwhite"
                    }`}
                    aria-label={`Question ${index + 1} ${answered ? 'answered' : 'unanswered'}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 px-4 md:px-6 py-6 space-y-6">
        <div className="max-w-4xl mx-auto">
          <ExamQuestion
            question={currentQuestion}
            questionNumber={currentIdx + 1}
            total={questions.length}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswer}
            mode={mode}
            showFeedback={mode === "practice" && selectedAnswer !== null}
          />

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              className="btn-secondary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => goToQuestion(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>
            <div className="flex flex-wrap gap-2 justify-center">
              {questions.map((question, index) => {
                const answered = Boolean(answers[question.id]?.selectedAnswer);
                const isActive = index === currentIdx;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => goToQuestion(index)}
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
            <button className="btn-primary text-sm px-4 py-2" onClick={handleNextQuestion}>
              {currentIdx < questions.length - 1 ? "Next →" : "Finish"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
