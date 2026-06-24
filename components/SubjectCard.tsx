"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";

type SubjectCardProps = {
  id: string;
  name: string;
  description: string;
  _count: { courses: number };
};

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

export default function SubjectCard({ id, name, description, _count }: SubjectCardProps) {
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
      onClick={() => router.push("/subjects/" + id)}
    >
      {/* Top accent line — slides in on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <div className="w-9 h-9 rounded-md bg-gold/8 border border-gold/15 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/14 group-hover:border-gold/3 transition-all duration-150">
        <BookIcon />
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
        <span className="badge">{_count.courses} {_count.courses === 1 ? "Course" : "Courses"}</span>
        <span className="flex items-center gap-1 text-gold text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
          Explore <ArrowIcon />
        </span>
      </div>

      {/* Delete — revealed on hover, stops card navigation */}
      <div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <DeleteButton
          label={name}
          iconOnly
          onConfirm={async () => {
            await fetch(`/api/subjects/${id}`, { method: "DELETE" });
            router.push("/");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
