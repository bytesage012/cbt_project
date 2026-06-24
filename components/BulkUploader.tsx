"use client";
import React, { useState, useRef } from "react";

type BulkUploaderProps = {
  courseId: string;
  onSuccess: () => void;
};

export default function BulkUploader({ courseId, onSuccess }: BulkUploaderProps) {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  const parseCsv = (text: string) => {
    const lines = text.trim().split("\n");
    return lines.map((line) => {
      const [prompt, optionA, optionB, optionC, optionD, answer, difficulty] =
        line.split(",").map((c) => c.trim());
      return { prompt, options: JSON.stringify([optionA, optionB, optionC, optionD]), answer, difficulty, courseId: Number(courseId) };
    });
  };

  const handleFile = (f: File) => { setFile(f); setMsg(null); };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const text = await file.text();
    let payload: any;
    if (file.name.endsWith(".json")) {
      const json = JSON.parse(text);
      payload = { questions: json.map((q: any) => ({ ...q, options: typeof q.options === "string" ? q.options : JSON.stringify(q.options), courseId: Number(courseId) })) };
    } else {
      payload = { questions: parseCsv(text) };
    }
    const res = await fetch("/api/questions/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      const data = await res.json();
      setMsg({ text: `${data.inserted} questions added successfully.`, ok: true });
      onSuccess();
    } else {
      setMsg({ text: "Upload failed — check your file format and try again.", ok: false });
    }
    setLoading(false);
  };

  const ext = file?.name.split(".").pop()?.toUpperCase();

  return (
    <div className="space-y-3">
      {/* Format hint */}
      <div className="flex items-center gap-2 text-[0.6875rem] text-muted">
        <span className="px-1.5 py-0.5 rounded bg-navy-deep border border-navy-border text-gold font-mono">JSON</span>
        <span>or</span>
        <span className="px-1.5 py-0.5 rounded bg-navy-deep border border-navy-border text-gold font-mono">CSV</span>
        <span>· CSV: prompt, A, B, C, D, answer, difficulty</span>
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload file drop zone"
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-gold bg-gold/6"
            : file
            ? "border-gold/40 bg-gold/4"
            : "border-navy-border hover:border-gold/35 hover:bg-white/2"
        }`}
        style={{ borderRadius: "var(--radius-lg)" }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        <input ref={inputRef} type="file" accept=".json,.csv" className="sr-only" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center">
              <span className="text-gold text-xs font-bold font-mono">{ext}</span>
            </div>
            <p className="text-offwhite font-semibold text-sm">{file.name}</p>
            <p className="text-muted text-xs">{(file.size / 1024).toFixed(1)} KB · click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-navy-surface border border-navy-border flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-muted-bright">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="text-offwhite font-medium text-sm">Drop your file here</p>
            <p className="text-muted text-xs">or <span className="text-gold underline underline-offset-2">click to browse</span></p>
          </div>
        )}
      </div>

      {/* Message */}
      {msg && (
        <div className={`flex items-center gap-2.5 text-sm font-medium px-4 py-3 rounded-lg border ${
          msg.ok
            ? "bg-success/8 text-success border-success/25"
            : "bg-danger/8 text-danger border-danger/25"
        }`}>
          <span>{msg.ok ? "✓" : "✗"}</span>
          {msg.text}
        </div>
      )}

      {/* Upload button */}
      <button className="btn-primary w-full" onClick={handleUpload} disabled={!file || loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            Uploading…
          </span>
        ) : "Upload Questions"}
      </button>
    </div>
  );
}
