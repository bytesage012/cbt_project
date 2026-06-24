"use client";
import React, { useState } from "react";
import type { Question } from "@/lib/types";

type QuestionFormProps = {
  courseId: string;
  question?: Question;
  onSuccess: () => void;
  onCancel: () => void;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuestionForm({ courseId, question, onSuccess, onCancel }: QuestionFormProps) {
  const [prompt, setPrompt]         = useState(question?.prompt ?? "");
  const [options, setOptions]       = useState<string[]>(
    question ? JSON.parse(question.options) : ["", "", "", ""]
  );
  const [answer, setAnswer]         = useState(question?.answer ?? "A");
  const [difficulty, setDifficulty] = useState(question?.difficulty ?? "easy");
  const [loading, setLoading]       = useState(false);

  const handleOptionChange = (idx: number, value: string) => {
    const copy = [...options];
    copy[idx] = value;
    setOptions(copy);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { prompt, options: JSON.stringify(options), answer, difficulty, courseId: Number(courseId) };
    const url    = question ? `/api/questions/${question.id}` : "/api/questions";
    const method = question ? "PATCH" : "POST";
    const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false);
    if (res.ok) onSuccess();
  };

  const difficultyConfig = {
    easy:   { color: "text-success",  bg: "bg-success/10 border-success/25"  },
    medium: { color: "text-gold",     bg: "bg-gold/10 border-gold/25"        },
    hard:   { color: "text-danger",   bg: "bg-danger/10 border-danger/25"    },
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-offwhite">
          {question ? "Edit Question" : "New Question"}
        </h2>
        <button type="button" onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-offwhite hover:bg-white/8 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Prompt */}
      <div>
        <label className="block text-[0.6875rem] text-muted font-semibold uppercase tracking-wider mb-2">Question Prompt</label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Write the question here…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
      </div>

      {/* Options */}
      <div>
        <label className="block text-[0.6875rem] text-muted font-semibold uppercase tracking-wider mb-2">Answer Options</label>
        <div className="space-y-2">
          {OPTION_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-md text-xs font-bold border transition-all ${
                answer === label
                  ? "bg-gold text-navy border-gold"
                  : "bg-navy-deep text-gold border-navy-border"
              }`}>
                {label}
              </span>
              <input
                className="input"
                placeholder={`Option ${label}`}
                value={options[i]}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      </div>

      {/* Correct answer + Difficulty */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[0.6875rem] text-muted font-semibold uppercase tracking-wider mb-2">Correct Answer</label>
          <select className="input" value={answer} onChange={(e) => setAnswer(e.target.value)}>
            {OPTION_LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[0.6875rem] text-muted font-semibold uppercase tracking-wider mb-2">Difficulty</label>
          <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Difficulty indicator */}
      {difficulty && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-semibold ${difficultyConfig[difficulty as keyof typeof difficultyConfig]?.bg}`}>
          <span className={difficultyConfig[difficulty as keyof typeof difficultyConfig]?.color}>
            {difficulty === "easy" ? "✓ Easy — " : difficulty === "medium" ? "◎ Medium — " : "⚡ Hard — "}
          </span>
          <span className="text-muted font-normal">
            {difficulty === "easy" ? "straightforward recall" : difficulty === "medium" ? "requires understanding" : "complex reasoning required"}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button type="button" className="btn-ghost flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
              Saving…
            </span>
          ) : question ? "Update" : "Add Question"}
        </button>
      </div>
    </form>
  );
}
