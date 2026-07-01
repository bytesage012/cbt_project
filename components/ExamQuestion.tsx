"use client";
import React from "react";
import type { Question } from "@/lib/types";
import { getQuestionAnswerLabel, optionLabels } from "@/lib/types";

type ExamQuestionProps = {
  question: Question;
  questionNumber: number;
  total: number;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  mode: "exam" | "practice";
  showFeedback: boolean;
  readOnly?: boolean;
};

export default function ExamQuestion({
  question,
  questionNumber,
  total,
  selectedAnswer,
  onAnswer,
  mode,
  showFeedback,
  readOnly = false,
}: ExamQuestionProps) {
  const options = JSON.parse(question.options) as string[];
  const progress = Math.round((questionNumber / total) * 100);
  const answerDetails = getQuestionAnswerLabel(question);
  const correctLabel = answerDetails.label ?? question.answer ?? "";
  const correctAnswerText = answerDetails.text ?? question.answer ?? "";
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[0.6875rem] text-muted font-semibold uppercase tracking-widest">
            Question {questionNumber} / {total}
          </span>
          <span className="text-[0.6875rem] text-gold font-bold">{progress}%</span>
        </div>
        <div className="h-[3px] bg-navy-surface rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #A8893A, #E2C97A)",
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className="bg-navy-surface border border-navy-border rounded-xl p-6 md:p-8 mb-6"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <p className="text-xl md:text-2xl font-semibold text-offwhite leading-relaxed">
          {question.prompt}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((opt, idx) => {
          const label = optionLabels[idx];
          const isSelected = selectedAnswer === label;
          const isCorrect = label === correctLabel;
          const showAsCorrect = showFeedback && isCorrect;
          const showAsWrong = showFeedback && isSelected && !isCorrect;

          const baseClasses =
            "group flex items-center gap-3.5 p-4 rounded-lg border text-left transition-all duration-150";
          const feedbackClasses = showFeedback
            ? showAsCorrect
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
              : showAsWrong
              ? "border-red-400/40 bg-red-500/10 text-red-100"
              : "border-navy-border bg-navy-surface hover:border-gold/30 hover:bg-navy-surface2"
            : isSelected
            ? "border-gold/50 bg-gold/8"
            : "border-navy-border bg-navy-surface hover:border-gold/30 hover:bg-navy-surface2";

          return (
            <button
              key={label}
              onClick={() => {
                if (!readOnly) onAnswer(label);
              }}
              disabled={readOnly}
              className={`${baseClasses} ${feedbackClasses} ${readOnly ? "cursor-default" : "cursor-pointer"}`}
              style={{
                borderRadius: "var(--radius-md)",
                boxShadow: isSelected && !showFeedback ? "0 0 0 1px rgba(201,168,76,0.25), 0 4px 16px rgba(201,168,76,0.08)" : undefined,
              }}
            >
              {/* Letter badge */}
              <span
                className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold transition-all duration-150 ${
                  showAsCorrect
                    ? "bg-emerald-400 text-navy"
                    : showAsWrong
                    ? "bg-red-400 text-navy"
                    : isSelected
                    ? "bg-gold text-navy"
                    : "bg-navy-deep text-gold border border-navy-border group-hover:border-gold/30"
                }`}
              >
                {label}
              </span>
              <span
                className={`text-sm font-medium leading-snug flex-1 transition-colors duration-150 ${
                  showAsCorrect || showAsWrong
                    ? "text-offwhite"
                    : isSelected
                    ? "text-offwhite"
                    : "text-offwhite-dim group-hover:text-offwhite"
                }`}
              >
                {opt}
              </span>
              {/* Selected checkmark */}
              {(showAsCorrect || showAsWrong) && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  {showAsCorrect ? (
                    <polyline points="20 6 9 17 4 12" className="text-emerald-400" />
                  ) : (
                    <line x1="6" y1="6" x2="18" y2="18" className="text-red-400" />
                  )}
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && mode === "practice" && (
        <div className="mt-6 rounded-2xl border border-navy-border bg-navy-deep p-5">
          <p className="text-sm font-semibold text-offwhite mb-2">Answer review</p>
          <p className="text-sm leading-relaxed text-offwhite-dim">
            {selectedAnswer === correctLabel
              ? `Nice work — ${correctLabel} is correct.`
              : `The correct answer is ${correctLabel}.`}
          </p>
          {question.explanation ? (
            <p className="mt-3 text-sm text-emerald-200">Explanation: {question.explanation}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
