"use client";
import React, { useEffect, useState } from "react";

type ExamTimerProps = {
  durationSeconds: number;
  onTimeUp: () => void;
};

export default function ExamTimer({ durationSeconds, onTimeUp }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) { onTimeUp(); return; }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const pct = (secondsLeft / durationSeconds) * 100;

  const isWarning  = secondsLeft <= 60 && secondsLeft > 30;
  const isDanger   = secondsLeft <= 30;
  const color      = isDanger ? "var(--danger)" : isWarning ? "var(--gold)" : "var(--success)";

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2 rounded-lg border transition-all duration-300"
      style={{
        background: isDanger ? "rgba(240,96,96,0.08)" : isWarning ? "rgba(201,168,76,0.08)" : "rgba(61,214,140,0.06)",
        borderColor: isDanger ? "rgba(240,96,96,0.3)" : isWarning ? "rgba(201,168,76,0.3)" : "rgba(61,214,140,0.2)",
      }}
    >
      {/* Mini arc indicator */}
      <svg width="20" height="20" viewBox="0 0 20 20" className={isDanger ? "animate-pulse" : ""}>
        <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
        <circle
          cx="10" cy="10" r="8"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 8}`}
          strokeDashoffset={`${2 * Math.PI * 8 * (1 - pct / 100)}`}
          transform="rotate(-90 10 10)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <span
        className="font-mono font-bold text-sm tracking-widest"
        style={{ color, letterSpacing: "0.08em" }}
      >
        {timeStr}
      </span>
    </div>
  );
}
