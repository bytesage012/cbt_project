"use client";
import React, { useEffect, useState, useCallback } from "react";
import ExamTimer from "@/components/ExamTimer";
import ExamQuestion from "@/components/ExamQuestion";
import ScoreCard from "@/components/ScoreCard";
import ExamConfiguration from "@/components/ExamConfiguration";
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-navy-mid/95 backdrop-blur-md border-b border-navy-border px-3 sm:px-6 md:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
  mode: 'exam' | 'practice';
          <a href={`/courses/${courseId}`} className="text-muted hover:text-gold transition-colors flex-shrink-0" aria-label="Back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/></svg>
          </a>
          <span className="text-[0.6875rem] text-muted font-semibold">
            {answeredCount}/{questions.length}
          </span>
          <span className="text-offwhite-dim text-xs font-medium hidden sm:block">answered</span>
        </div>

        {mode === 'exam' && <ExamTimer durationSeconds={duration} onTimeUp={handleFinish} />}

        <button className="btn-primary text-xs py-2 px-4 flex-shrink-0" onClick={handleFinish}>
          {mode === 'practice' ? 'Finish' : 'Submit'}
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-10 animate-fade-in" key={currentIdx}>
        <ExamQuestion
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          total={questions.length}
          selectedAnswer={answers[currentQuestion.id]?.selectedAnswer ?? null}
          onAnswer={handleAnswer}
        />

        {/* Practice mode review */}
        {mode === 'practice' && practiceReview && (
          <div className={`mt-8 p-6 rounded-lg border-2 max-w-md w-full ${practiceReview.isCorrect ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
            <p className={`text-sm font-semibold ${practiceReview.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {practiceReview.explanation}
            </p>
            <button
              onClick={handleNextQuestion}
              className={`mt-4 w-full py-2 rounded font-medium text-sm ${practiceReview.isCorrect ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'}`}
            >
              {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish'}
            </button>
          </div>
        )}

        {/* Prev / Next for exam mode only */}
        {mode === 'exam' && !practiceReview && (
          <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-2xl">
            <button
              className="btn-secondary flex-1 disabled:opacity-30"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
  questionCount: number;
  shuffleQuestions: boolean;
};
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
              <button className="btn-primary flex-1" onClick={handleFinish}>
                Finish Exam
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Question navigator for exam mode only */}
      {mode === 'exam' && (
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
      )}
  // States
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
      setPracticeReview({
        isCorrect,
        explanation: isCorrect
          ? `✓ Correct! The answer is "${question.answer}".`
          : `✗ Incorrect. The correct answer is "${question.answer}".`,
      });
    }
  };

  const handleNextQuestion = () => {
    setPracticeReview(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Auto-finish if on last question
      handleFinish();
    }
  };

  const handleFinish = useCallback(async () => {
    const timeTakenSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    setTimeTaken(timeTakenSeconds);

    if (sessionId) {
      // Complete session
      await fetch(`/api/exam-sessions/${sessionId}`, { method: 'PUT' });
    }
    setFinished(true);
  }, [sessionId, startTime]);

  // Show config
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
    const correct = Object.values(answers).filter((a) => a.isCorrect).length;
    const results = questions.map((q) => ({
      question: q,
      userAnswer: answers[q.id]?.selectedAnswer ?? null,
      isCorrect: answers[q.id]?.isCorrect,
    }));
    return <ScoreCard total={questions.length} correct={correct} timeTaken={timeTaken} results={results} />;
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
