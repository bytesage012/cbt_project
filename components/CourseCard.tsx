"use client";
import React from "react";
import { useRouter } from "next/navigation";

type CourseCardProps = {
  id: string;
  name: string;
  description: string;
  _count: { questions: number };
};

const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

export default function CourseCard({ id, name, description, _count }: CourseCardProps) {
  const router = useRouter();

  return (
    <div
      className="group relative cursor-pointer bg-navy-surface border border-navy-border-subtle rounded-lg p-5 transition-all duration-200 hover:border-gold/35 overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(201,168,76,0.12), 0 12px 40px rgba(0,0,0,0.4)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "";
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
      onClick={() => router.push("/courses/" + id)}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <div className="w-9 h-9 rounded-md bg-gold/8 border border-gold/15 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/14 transition-all duration-150">
        <FileIcon />
      </div>

      {/* Name */}
      <h3 className="text-base font-bold text-offwhite mb-1.5 group-hover:text-gold transition-colors duration-150 leading-snug">
        {name}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-4">
        {description || "No description provided."}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="badge">{_count.questions} {_count.questions === 1 ? "Question" : "Questions"}</span>
        <span className="flex items-center gap-1.5 text-gold text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
          <PlayIcon /> Start Exam
        </span>
      </div>
    </div>
  );
}
