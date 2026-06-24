"use client";
import { useState } from "react";

export default function AddCourseForm({ subjectId }: { subjectId: string }) {
  const [open, setOpen]     = useState(false);
  const [title, setTitle]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subjectId: Number(subjectId) }),
    });
    setLoading(false);
    if (res.ok) window.location.reload();
  };

  if (!open) {
    return (
      <div className="mt-12 flex justify-center">
        <button className="btn-secondary" onClick={() => setOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Course
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-md mx-auto">
      <div className="bg-navy-surface border border-navy-border rounded-xl p-6 animate-scale-in" style={{ borderRadius: "var(--radius-lg)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-offwhite">New Course</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-offwhite hover:bg-white/8 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-[0.6875rem] text-muted font-semibold uppercase tracking-wider mb-2">Course Title</label>
            <input className="input" placeholder="e.g. Cell Biology 101" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" className="btn-ghost flex-1" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-navy border-t-transparent rounded-full animate-spin" />Creating…</span> : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
