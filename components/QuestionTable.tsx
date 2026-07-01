"use client";
import React, { useState } from "react";
import type { Question } from "@/lib/types";
import { getQuestionAnswerLabel } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";

type QuestionTableProps = {
  questions: Question[];
  onDelete: (id: string) => void;
  onEdit: (q: Question) => void;
};

const difficultyStyle = (d: string) => {
  if (d === "hard")   return { badge: "badge-red",   dot: "bg-danger"  };
  if (d === "medium") return { badge: "badge-gold",  dot: "bg-gold"    };
  return                     { badge: "badge-green", dot: "bg-success" };
};

export default function QuestionTable({ questions, onDelete, onEdit }: QuestionTableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const filtered = safeQuestions.filter((q) =>
    q.prompt.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible    = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  return (
    <div className="space-y-3 animate-fade-in">

      {/* Search + count row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="input pl-9 text-sm"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <span className="text-[0.6875rem] text-muted font-semibold uppercase tracking-wide">
          {filtered.length} of {safeQuestions.length} questions
        </span>
      </div>

      {/* Table */}
      <div className="bg-navy-surface border border-navy-border rounded-xl overflow-hidden"
        style={{ borderRadius: "var(--radius-lg)" }}>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-navy-deep border-b border-navy-border">
              <th className="px-4 py-3 text-left text-[0.6875rem] text-muted uppercase tracking-widest font-semibold w-10">#</th>
              <th className="px-4 py-3 text-left text-[0.6875rem] text-muted uppercase tracking-widest font-semibold">Question</th>
              <th className="px-4 py-3 text-center text-[0.6875rem] text-muted uppercase tracking-widest font-semibold w-20 hidden sm:table-cell">Ans</th>
              <th className="px-4 py-3 text-center text-[0.6875rem] text-muted uppercase tracking-widest font-semibold w-28 hidden md:table-cell">Difficulty</th>
              <th className="px-4 py-3 text-center text-[0.6875rem] text-muted uppercase tracking-widest font-semibold w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <p className="text-muted text-sm">{search ? `No questions matching "${search}"` : "No questions yet."}</p>
                </td>
              </tr>
            ) : (
              visible.map((q, idx) => {
                const { badge, dot } = difficultyStyle(q.difficulty ?? "easy");
                return (
                  <tr
                    key={q.id}
                    className="border-b border-navy-border last:border-0 hover:bg-navy-deep/40 transition-colors duration-100 group"
                  >
                    <td className="px-4 py-3 text-muted text-center text-xs font-mono">
                      {page * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-offwhite-dim max-w-xs" title={q.prompt}>
                      <span className="line-clamp-2 leading-snug text-sm group-hover:text-offwhite transition-colors">
                        {q.prompt}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="badge">{getQuestionAnswerLabel(q).label ?? q.answer ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className={`badge ${badge} flex items-center justify-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
                        {q.difficulty ?? "easy"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="px-2.5 py-1.5 rounded-md text-gold hover:bg-gold/10 text-xs font-semibold transition-colors duration-100"
                          onClick={() => onEdit(q)}
                        >
                          Edit
                        </button>
                        <DeleteButton
                          label={q.prompt.slice(0, 40) + (q.prompt.length > 40 ? "…" : "")}
                          iconOnly
                          onConfirm={async () => onDelete(String(q.id))}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <button
            disabled={page === 0}
            className="btn-ghost text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Prev
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-md text-xs font-semibold transition-all ${
                  i === page
                    ? "bg-gold text-navy"
                    : "text-muted hover:text-offwhite hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={page >= totalPages - 1}
            className="btn-ghost text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          >
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
