"use client";
import React, { useState } from "react";
import type { Question } from "@/lib/types";
import { optionLabels, getQuestionAnswerLabel, isQuestionAnswerCorrect } from "@/lib/types";

type Result = { question: Question; userAnswer: string | null };

type ScoreCardProps = {
  courseId: number;
  total: number;
  correct: number;
  timeTaken: number;
  results: Result[];
};

export default function ScoreCard({ courseId, total, correct, timeTaken, results }: ScoreCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<"all" | "wrong" | "right">("all");
  const computedCorrect = results.filter((r) => isQuestionAnswerCorrect(r.question, r.userAnswer ?? null)).length;
  const percent = Math.round((computedCorrect / total) * 100);
  const passed = percent >= 50;
  const wrong = total - computedCorrect;

  const mins    = Math.floor(timeTaken / 60);
  const secs    = timeTaken % 60;
  const timeStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const filteredResults = results.filter((r) => {
    if (filter === "right") return isQuestionAnswerCorrect(r.question, r.userAnswer ?? null);
    if (filter === "wrong") return !isQuestionAnswerCorrect(r.question, r.userAnswer ?? null);
    return true;
  });

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 md:p-6"
      style={{ backgroundImage: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 65%)" }}>
      <div className="w-full max-w-xl animate-scale-in">

        {/* Main score card */}
        <div className="bg-navy-surface border border-navy-border rounded-xl p-7 mb-3 text-center relative overflow-hidden"
          style={{ borderRadius: "var(--radius-xl)" }}>
          {/* Background glow */}
          <div
            className="absolute inset-x-0 top-0 h-1 rounded-t-xl"
            style={{ background: passed ? "linear-gradient(90deg, transparent, var(--gold), transparent)" : "linear-gradient(90deg, transparent, var(--danger), transparent)" }}
          />

          {/* Score circle */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="6"/>
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={passed ? "var(--gold)" : "var(--danger)"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - percent / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ filter: passed ? "drop-shadow(0 0 8px rgba(201,168,76,0.5))" : "drop-shadow(0 0 8px rgba(240,96,96,0.4))", transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${passed ? "text-gold" : "text-danger"}`}>{percent}%</span>
              <span className="text-[0.6875rem] text-muted uppercase tracking-widest font-semibold mt-0.5">Score</span>
            </div>
          </div>

          {/* Pass/Fail */}
          <span className={`badge text-xs px-4 py-1.5 mb-5 inline-block ${passed ? "badge-green" : "badge-red"}`}>
            {passed ? "✓ Passed" : "✗ Failed"}
          </span>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {[
              { label: "Total",   value: String(total),   color: "text-offwhite" },
              { label: "Correct", value: String(correct), color: "text-success"  },
              { label: "Wrong",   value: String(wrong),   color: "text-danger"   },
              { label: "Time",    value: timeStr,         color: "text-gold"     },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-navy-deep border border-navy-border rounded-lg p-3">
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-[0.6875rem] text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Review toggle */}
        <button
          className="btn-secondary w-full mb-3 justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Review Answers</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {expanded ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
          </svg>
        </button>

        {/* Review panel */}
        {expanded && (
          <div className="bg-navy-surface border border-navy-border rounded-xl overflow-hidden mb-3 animate-slide-up"
            style={{ borderRadius: "var(--radius-lg)" }}>

            {/* Filter tabs */}
            <div className="flex border-b border-navy-border">
              {(["all", "right", "wrong"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
                    filter === f
                      ? f === "right" ? "text-success border-b-2 border-success"
                        : f === "wrong" ? "text-danger border-b-2 border-danger"
                        : "text-gold border-b-2 border-gold"
                      : "text-muted hover:text-offwhite-dim"
                  }`}
                >
                  {f === "all" ? `All (${total})` : f === "right" ? `Correct (${computedCorrect})` : `Wrong (${wrong})`}
                </button>
              ))}
            </div>

            <ul className="divide-y divide-navy-border max-h-60 sm:max-h-72 overflow-y-auto">
              {filteredResults.map((r, i) => {
                const options = JSON.parse(r.question.options) as string[];
                const answerDetails = getQuestionAnswerLabel(r.question);
                const correctLabel = answerDetails.label;
                const correctTxt = answerDetails.text ?? (typeof r.question.answer === "string" ? r.question.answer : "");
                const isCorrect = isQuestionAnswerCorrect(r.question, r.userAnswer ?? null);

                return (
                  <li key={i} className="flex items-start gap-3 px-4 py-3.5">
                    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isCorrect ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-offwhite font-medium leading-snug mb-1 line-clamp-2">
                        Q{results.indexOf(r) + 1}: {r.question.prompt}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-[0.6875rem] text-muted">Correct: <span className="text-success font-semibold">{correctLabel ? `${correctLabel}. ${correctTxt}` : correctTxt}</span></span>
                        {!isCorrect && (
                          (() => {
                            const sel = r.userAnswer ?? null;
                            if (!sel) return (
                              <span className="text-[0.6875rem] text-muted">Yours: <span className="text-danger font-semibold">—</span></span>
                            );

                            const options = JSON.parse(r.question.options) as string[];
                            // If userAnswer is a label like 'A'
                            if (optionLabels.includes(sel as any)) {
                              const idx = optionLabels.indexOf(sel as any);
                              const txt = options[idx] ?? sel;
                              return (
                                <span className="text-[0.6875rem] text-muted">Yours: <span className="text-danger font-semibold">{sel}. {txt}</span></span>
                              );
                            }

                            // Try to match by option text (loose normalized)
                            const normalize = (s: string) => s.toString().trim().toLowerCase();
                            const foundIdx = options.findIndex((o) => normalize(o) === normalize(sel));
                            if (foundIdx !== -1) {
                              const label = optionLabels[foundIdx];
                              return (
                                <span className="text-[0.6875rem] text-muted">Yours: <span className="text-danger font-semibold">{label}. {options[foundIdx]}</span></span>
                              );
                            }

                            // Fallback: raw text
                            return (
                              <span className="text-[0.6875rem] text-muted">Yours: <span className="text-danger font-semibold">{sel}</span></span>
                            );
                          })()
                        )}
                      </div>
                      {r.question.explanation && (
                        <p className="text-[0.8rem] text-muted mt-2">{r.question.explanation}</p>
                      )}
                    </div>
                  </li>
                );
              })}
              {filteredResults.length === 0 && (
                <li className="px-4 py-6 text-center text-muted text-sm">No questions in this filter.</li>
              )}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-secondary w-full" onClick={() => (window.location.href = `/exam/${courseId}?review=1`)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5h14v14H5z"/><path d="M9 9h6v6H9z"/></svg>
            Review
          </button>
          <button className="btn-primary w-full" onClick={() => (window.location.href = "/")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </button>
          <button className="btn-primary w-full" onClick={() => window.location.reload()}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>
            Retake Exam
          </button>
        </div>
      </div>
    </div>
  );
}
