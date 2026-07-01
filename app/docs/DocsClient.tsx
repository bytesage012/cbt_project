"use client";
import React, { useState } from "react";
import Link from "next/link";

/* ─── tiny icon set ─────────────────────────────────────────── */
const Icon = {
  Book: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Upload: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Json: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/>
    </svg>
  ),
  Csv: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
      <path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Warning: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

/* ─── copy button ────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      title="Copy to clipboard"
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.35rem",
        padding: "0.3rem 0.65rem", borderRadius: "0.375rem", fontSize: "0.7rem",
        fontWeight: 600, letterSpacing: "0.03em", cursor: "pointer",
        transition: "all 0.15s",
        background: copied ? "rgba(61,214,140,0.12)" : "rgba(255,255,255,0.06)",
        border: copied ? "1px solid rgba(61,214,140,0.3)" : "1px solid rgba(255,255,255,0.1)",
        color: copied ? "#3DD68C" : "#8A9BB5",
      }}
    >
      {copied ? <Icon.Check /> : <Icon.Copy />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ─── code block ─────────────────────────────────────────────── */
function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div style={{
      borderRadius: "0.875rem", overflow: "hidden",
      border: "1px solid rgba(26,51,84,0.9)",
      background: "#060D1A",
      marginTop: "0.75rem",
    }}>
      {title && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.55rem 1rem",
          borderBottom: "1px solid rgba(26,51,84,0.8)",
          background: "rgba(10,20,34,0.7)",
        }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#637590", letterSpacing: "0.04em" }}>{title}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre style={{
        margin: 0, padding: "1.125rem 1.25rem", overflowX: "auto",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: "0.8125rem", lineHeight: 1.7, color: "#D4E2F5",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── prompt card ────────────────────────────────────────────── */
function PromptCard({ title, badge, description, prompt }: {
  title: string; badge: string; description: string; prompt: string;
}) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(15,31,56,0.9) 0%, rgba(10,20,34,0.9) 100%)",
      border: "1px solid rgba(201,168,76,0.18)",
      borderRadius: "1rem", overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      marginBottom: "1.25rem",
    }}>
      <div style={{
        padding: "1.25rem 1.25rem 0",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
      }}>
        <div>
          <span style={{
            display: "inline-block", marginBottom: "0.5rem",
            padding: "0.2rem 0.65rem", borderRadius: "9999px", fontSize: "0.65rem",
            fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
            background: "rgba(201,168,76,0.12)", color: "#C9A84C",
            border: "1px solid rgba(201,168,76,0.22)",
          }}>{badge}</span>
          <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#F0EEE9", lineHeight: 1.3 }}>{title}</h4>
          <p style={{ margin: "0.3rem 0 0", fontSize: "0.8125rem", color: "#637590", lineHeight: 1.55 }}>{description}</p>
        </div>
        <CopyButton text={prompt} />
      </div>
      <div style={{ padding: "0.75rem 1.25rem 1.25rem" }}>
        <pre style={{
          margin: 0, padding: "1rem 1.125rem",
          background: "rgba(6,13,26,0.8)",
          border: "1px solid rgba(26,51,84,0.6)",
          borderRadius: "0.75rem",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "0.775rem", lineHeight: 1.75, color: "#B8C8DE",
          whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "auto",
        }}>{prompt}</pre>
      </div>
    </div>
  );
}

/* ─── section wrapper ────────────────────────────────────────── */
function Section({ id, icon, title, children }: {
  id: string; icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: "3.5rem", scrollMarginTop: "80px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        marginBottom: "1.5rem", paddingBottom: "0.875rem",
        borderBottom: "1px solid rgba(26,51,84,0.6)",
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "0.625rem", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)",
          color: "#C9A84C",
        }}>
          {icon}
        </div>
        <h2 style={{ margin: 0, fontSize: "1.375rem", fontWeight: 700, color: "#F0EEE9", letterSpacing: "-0.02em" }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/* ─── field row ──────────────────────────────────────────────── */
function FieldRow({ field, type, required, desc, example }: {
  field: string; type: string; required: boolean; desc: string; example: string;
}) {
  return (
    <tr>
      <td style={{ padding: "0.65rem 1rem", borderBottom: "1px solid rgba(18,37,64,0.7)" }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", color: "#C9A84C", fontWeight: 600 }}>{field}</span>
        {required && <span style={{ marginLeft: "0.4rem", fontSize: "0.6rem", fontWeight: 700, color: "#F06060", textTransform: "uppercase", letterSpacing: "0.06em" }}>req</span>}
      </td>
      <td style={{ padding: "0.65rem 1rem", borderBottom: "1px solid rgba(18,37,64,0.7)" }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#8A9BB5" }}>{type}</span>
      </td>
      <td style={{ padding: "0.65rem 1rem", borderBottom: "1px solid rgba(18,37,64,0.7)", color: "#B8B5AE", fontSize: "0.8125rem" }}>{desc}</td>
      <td style={{ padding: "0.65rem 1rem", borderBottom: "1px solid rgba(18,37,64,0.7)" }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#637590" }}>{example}</span>
      </td>
    </tr>
  );
}

/* ─── sidebar sections ───────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "overview",   label: "Overview" },
  { id: "json",       label: "JSON Format" },
  { id: "csv",        label: "CSV Format" },
  { id: "templates",  label: "File Templates" },
  { id: "ai-prompts", label: "AI Prompts" },
  { id: "faq",        label: "FAQ" },
];

/* ─── static data ────────────────────────────────────────────── */
const JSON_EXAMPLE = `[
  {
    "prompt": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "answer": "Paris",
    "difficulty": "easy",
    "explanation": "Paris is the capital and most populous city of France."
  },
  {
    "prompt": "Which of the following is a prime number?",
    "options": ["4", "6", "7", "9"],
    "answer": "7",
    "difficulty": "medium",
    "explanation": "7 is divisible only by 1 and itself, so it's prime."
  },
  {
    "prompt": "The powerhouse of the cell is the:",
    "options": ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    "answer": "Mitochondria",
    "difficulty": "easy",
    "explanation": "Mitochondria produce ATP through cellular respiration."
  }
]`;

const CSV_EXAMPLE = `What is the capital of France?,London,Berlin,Paris,Madrid,Paris,easy,Paris is the capital and most populous city of France.
Which of the following is a prime number?,4,6,7,9,7,medium,7 is divisible only by 1 and itself, so it's prime.
The powerhouse of the cell is the:,Nucleus,Mitochondria,Ribosome,Golgi apparatus,Mitochondria,easy,Mitochondria produce ATP through cellular respiration.`;

const JSON_TEMPLATE = `[
  {
    "prompt": "YOUR QUESTION TEXT HERE?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "difficulty": "easy",
    "explanation": "Optional explanation or answer rationale."
  }
]`;

const CSV_TEMPLATE = `Question text here?,Option A,Option B,Option C,Option D,Option A,easy,Optional explanation or rationale`;

const PROMPTS = [
  {
    badge: "PDF / Word / TXT → JSON",
    title: "Convert Any Text Source to JSON",
    description: "Paste this prompt into ChatGPT, Claude, or Gemini before pasting your questions.",
    prompt: `You are a JSON formatter for a CBT (Computer-Based Test) platform. I will give you a list of multiple-choice questions in any format (PDF text, Word doc text, plain text, numbered lists, etc.). Your job is to convert them into a valid JSON array with EXACTLY this structure:

[
  {
    "prompt": "<the full question text>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "answer": "<exact text of the correct option>",
    "difficulty": "<easy | medium | hard>",
    "explanation": "<optional explanation or rationale>"
  }
]

Rules:
1. Each question MUST have exactly 4 options.
2. The "answer" field MUST be the exact string of one of the options (not A/B/C/D).
3. Guess difficulty based on subject matter if not given: basic recall = easy, application = medium, analysis = hard.
4. Remove all numbering, lettering (A. B. C.) from option text.
5. Output ONLY the raw JSON array — no explanation, no markdown code fences.

Here are my questions:
[PASTE YOUR QUESTIONS HERE]`,
  },
  {
    badge: "PDF / Word / TXT → CSV",
    title: "Convert Any Text Source to CSV",
    description: "Produces a CSV file ready to upload directly — no editing needed.",
    prompt: `You are a CSV formatter for a CBT (Computer-Based Test) platform. I will give you multiple-choice questions in any format. Convert them into a CSV with EXACTLY 8 comma-separated columns per row:

Column order: question, optionA, optionB, optionC, optionD, answer, difficulty, explanation

Rules:
1. Each row = one question. No header row.
2. The "answer" column must be the EXACT text of the correct option (not A/B/C/D).
3. difficulty must be one of: easy, medium, hard
4. If any field contains a comma, wrap it in double quotes.
5. Remove all numbering or lettering from option text (e.g. "A." "1.").
6. The last column may contain an optional explanation or rationale.
7. Output ONLY the raw CSV — no explanation, no code fences.

Here are my questions:
[PASTE YOUR QUESTIONS HERE]`,
  },
  {
    badge: "Scanned Image / Photo → JSON",
    title: "OCR + Convert Image of Questions",
    description: "For when you have a photo of a textbook or printed exam paper.",
    prompt: `I have an image of multiple-choice exam questions. Please:
1. OCR and extract all the text from the image.
2. Convert the extracted questions into a JSON array using this EXACT structure:

[
  {
    "prompt": "<full question text>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "answer": "<exact text of correct option>",
    "difficulty": "<easy | medium | hard>",
    "explanation": "<optional explanation or rationale>"
  }
]

Rules:
- Each question must have exactly 4 options.
- "answer" must be the exact string of the correct option, not a letter.
- Remove any numbering or lettering prefixes from options.
- Output ONLY the raw JSON array.

[ATTACH YOUR IMAGE]`,
  },
  {
    badge: "Numbered List → JSON",
    title: "Numbered / Lettered List to JSON",
    description: "Perfect for questions formatted like: 1. Question (A) opt1 (B) opt2 …",
    prompt: `Convert the following numbered multiple-choice questions to a JSON array for a CBT platform. The structure must be:

[
  {
    "prompt": "<question text>",
    "options": ["<A>", "<B>", "<C>", "<D>"],
    "answer": "<exact correct option text>",
    "difficulty": "<easy | medium | hard>",
    "explanation": "<optional explanation or rationale>"
  }
]

Important:
- Strip numbering (1. 2. 3.) from questions.
- Strip letters (A. B. C. D. or a) b) c) d)) from options.
- "answer" must be the full text of the correct option — not the letter.
- If the answer key is separate (e.g. "Ans: B"), map it to the correct option text.
- Output raw JSON only, no markdown, no explanation.

Questions:
[PASTE YOUR NUMBERED QUESTIONS HERE]`,
  },
  {
    badge: "Mixed Language → JSON",
    title: "Non-English Questions to JSON",
    description: "Preserves the original language while enforcing correct JSON structure.",
    prompt: `You are a multilingual JSON formatter for a CBT exam platform. Convert the following multiple-choice questions (which may be in any language) into a JSON array. Keep all text in the original language. Use this EXACT structure:

[
  {
    "prompt": "<question in original language>",
    "options": ["<option 1>", "<option 2>", "<option 3>", "<option 4>"],
    "answer": "<exact text of correct option, in original language>",
    "difficulty": "<easy | medium | hard>",
    "explanation": "<optional explanation or rationale>"
  }
]

Rules:
- 4 options per question exactly.
- "answer" must match one of the option strings exactly.
- difficulty in English only (easy / medium / hard).
- Output raw JSON array only.

Questions:
[PASTE YOUR QUESTIONS HERE]`,
  },
];

const FAQS = [
  {
    q: "What happens if my CSV has fewer or more than 4 options?",
    a: "The upload will succeed, but questions with fewer than 4 options may display incorrectly. Always ensure exactly 4 option columns (A, B, C, D) are present in each row.",
  },
  {
    q: 'What values are valid for the "difficulty" field?',
    a: 'Only three values are accepted: "easy", "medium", or "hard" (all lowercase). Any other value — including "Easy" or "HARD" — will be stored as-is but may not filter correctly.',
  },
  {
    q: 'Does the "answer" field accept a letter (A/B/C/D) or the full option text?',
    a: 'It must be the exact full text of the correct option. For example, if option C is "Mitochondria", the answer field must be "Mitochondria" — not "C".',
  },
  {
    q: "My CSV has a header row — should I include it?",
    a: "No. The uploader expects plain data rows only. Remove the header row before uploading. The expected column order is: prompt, A, B, C, D, answer, difficulty.",
  },
  {
    q: "Can I upload hundreds of questions at once?",
    a: "Yes! Bulk upload is designed for large batches. There is no hard limit, but very large files (>10 MB) may take longer to process.",
  },
  {
    q: "My questions are in a PDF — what is the easiest workflow?",
    a: "Copy the text from your PDF, paste it into ChatGPT or Claude with one of the AI prompts above, then save the output as a .json or .csv file and upload it.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function DocsClient() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: "#080F1E", position: "relative" }}>

      {/* ── Mobile sidebar toggle button ── */}
      <button
        onClick={() => setMobileSidebarOpen(o => !o)}
        style={{
          display: "none",
          position: "fixed", bottom: "1.25rem", right: "1.25rem",
          zIndex: 60,
          padding: "0.6rem 1rem", borderRadius: "9999px",
          background: "linear-gradient(135deg,#E2C97A,#C9A84C)",
          color: "#0A0F1A", fontWeight: 700, fontSize: "0.75rem",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
          alignItems: "center", gap: "0.4rem",
        }}
        className="docs-mob-toggle"
        aria-label="Toggle sections menu"
      >
        {mobileSidebarOpen ? "✕ Close" : "☰ Sections"}
      </button>

      {/* ── Mobile overlay backdrop ── */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 49,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          className="docs-mob-backdrop"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 224, flexShrink: 0,
          position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto",
          padding: "2rem 0 2rem 1.5rem",
          borderRight: "1px solid rgba(26,51,84,0.5)",
          display: "flex", flexDirection: "column", gap: "0.25rem",
          background: "rgba(8,15,30,0.97)",
        }}
        className={`docs-sidebar${mobileSidebarOpen ? " open" : ""}`}
      >
        <p style={{
          fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "#637590",
          marginBottom: "0.75rem", paddingLeft: "0.75rem",
        }}>On this page</p>

        {NAV_SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => { setActiveSection(id); setMobileSidebarOpen(false); }}
            style={{
              display: "block", padding: "0.45rem 0.875rem", borderRadius: "0.5rem",
              fontSize: "0.8125rem", fontWeight: activeSection === id ? 600 : 400,
              color: activeSection === id ? "#C9A84C" : "#637590",
              background: activeSection === id ? "rgba(201,168,76,0.08)" : "transparent",
              borderLeft: activeSection === id ? "2px solid #C9A84C" : "2px solid transparent",
              textDecoration: "none", transition: "all 0.12s", marginRight: "1rem",
            }}
          >
            {label}
          </a>
        ))}

        <div style={{ flex: 1 }} />
        <div style={{
          margin: "1rem 1rem 0 0", padding: "0.875rem",
          borderRadius: "0.75rem",
          background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)",
        }}>
          <p style={{ fontSize: "0.75rem", color: "#8A9BB5", margin: 0, lineHeight: 1.55 }}>
            Need help? Use one of the{" "}
            <a href="#ai-prompts" style={{ color: "#C9A84C", textDecoration: "underline" }}>AI prompts</a>{" "}
            to convert your questions instantly.
          </p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "1.5rem 1rem 4rem", maxWidth: 860, overflowY: "auto" }}
        className="docs-main"
      >

        {/* Page hero */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#C9A84C",
            display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem",
          }}>
            <span>Documentation</span>
            <span style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(201,168,76,0.3), transparent)" }} />
          </p>
          <h1 style={{
            fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em",
            margin: "0 0 0.75rem", color: "#F0EEE9", lineHeight: 1.1,
          }}>
            Upload Questions Guide
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "#8A9BB5", lineHeight: 1.65, maxWidth: 580 }}>
            Learn the exact formats accepted by CBT Prep Hub, download ready-to-use templates, and get AI prompts to convert your existing question banks automatically.
          </p>

          {/* Quick nav pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", marginTop: "1.5rem" }}>
            {[
              { label: "JSON Format",  href: "#json",       color: "#C9A84C" },
              { label: "CSV Format",   href: "#csv",        color: "#C9A84C" },
              { label: "AI Prompts",   href: "#ai-prompts", color: "#3DD68C" },
              { label: "Templates",    href: "#templates",  color: "#8A9BB5" },
            ].map(({ label, href, color }) => (
              <a key={href} href={href} style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8125rem",
                fontWeight: 600, textDecoration: "none", transition: "all 0.15s",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color,
              }}>
                <Icon.ChevronRight />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ──────── OVERVIEW ──────── */}
        <Section id="overview" icon={<Icon.Book />} title="Overview">
          <p style={{ color: "#8A9BB5", lineHeight: 1.7, marginBottom: "1rem" }}>
            CBT Prep Hub accepts bulk question uploads in two formats:{" "}
            <strong style={{ color: "#C9A84C" }}>JSON</strong> and{" "}
            <strong style={{ color: "#C9A84C" }}>CSV</strong>. Both let you upload dozens or hundreds of questions at once to any course.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.25rem" }}>
            {[
              {
                title: "JSON",
                icon: <Icon.Json />,
                desc: "Best for developers. Structured, supports nested data. Each question is a JSON object inside an array.",
                recommend: true,
              },
              {
                title: "CSV",
                icon: <Icon.Csv />,
                desc: "Best for non-developers. Open in Excel or Google Sheets. Simple comma-separated rows.",
                recommend: false,
              },
            ].map(({ title, icon, desc, recommend }) => (
              <div key={title} style={{
                padding: "1.25rem", borderRadius: "0.875rem",
                background: "rgba(15,31,56,0.6)", border: "1px solid rgba(26,51,84,0.8)",
                position: "relative", overflow: "hidden",
              }}>
                {recommend && (
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em",
                    padding: "0.15rem 0.5rem", borderRadius: "9999px",
                    background: "rgba(61,214,140,0.12)", color: "#3DD68C",
                    border: "1px solid rgba(61,214,140,0.25)", textTransform: "uppercase",
                  }}>Recommended</span>
                )}
                <div style={{ color: "#C9A84C", marginBottom: "0.625rem" }}>{icon}</div>
                <h4 style={{ margin: "0 0 0.375rem", fontSize: "1rem", fontWeight: 700, color: "#F0EEE9" }}>{title}</h4>
                <p style={{ margin: 0, fontSize: "0.8125rem", color: "#637590", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "1.25rem", padding: "0.875rem 1.125rem",
            borderRadius: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start",
            background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
          }}>
            <span style={{ color: "#C9A84C", flexShrink: 0, marginTop: 2 }}><Icon.Warning /></span>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "#B8B5AE", lineHeight: 1.6 }}>
              <strong style={{ color: "#E2C97A" }}>Before uploading</strong> — make sure you are on the correct{" "}
              <em>course</em> page. Questions are always uploaded to a specific course, not a subject.
            </p>
          </div>
        </Section>

        {/* ──────── JSON FORMAT ──────── */}
        <Section id="json" icon={<Icon.Json />} title="JSON Format">
          <p style={{ color: "#8A9BB5", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Upload a{" "}
            <code style={{ color: "#C9A84C", fontFamily: "monospace", background: "rgba(201,168,76,0.08)", padding: "0.1em 0.4em", borderRadius: 4 }}>.json</code>{" "}
            file containing a top-level array of question objects.
          </p>

          {/* Schema table */}
          <div style={{
            borderRadius: "0.875rem", overflow: "hidden",
            border: "1px solid rgba(26,51,84,0.8)", marginBottom: "1.25rem",
          }}>
            <div style={{
              padding: "0.75rem 1.125rem",
              background: "rgba(10,20,34,0.8)", borderBottom: "1px solid rgba(26,51,84,0.6)",
            }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9A84C" }}>
                Field Reference
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(6,13,26,0.5)" }}>
              <thead>
                <tr>
                  {["Field", "Type", "Description", "Example"].map(h => (
                    <th key={h} style={{
                      padding: "0.6rem 1rem", fontSize: "0.6875rem", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em", color: "#637590",
                      borderBottom: "1px solid rgba(26,51,84,0.5)", textAlign: "left",
                      background: "rgba(8,15,30,0.6)",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <FieldRow field="prompt"       type="string"          required desc="The question text"                  example='"What is 2+2?"'           />
                <FieldRow field="options"      type="string[]"        required desc="Array of exactly 4 answer options"  example='["2","3","4","5"]'         />
                <FieldRow field="answer"       type="string"          required desc="Exact text of the correct option"   example='"4"'                        />
                <FieldRow field="difficulty"   type="easy|medium|hard" required={false} desc="Difficulty level"                   example='"medium"'                   />
                <FieldRow field="explanation"  type="string"          required={false} desc="Optional explanation or rationale"  example='"2+2 equals 4 because..."'   />
              </tbody>
            </table>
          </div>

          <CodeBlock code={JSON_EXAMPLE} title="example.json" />

          <div style={{
            marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "0.625rem",
            background: "rgba(61,214,140,0.06)", border: "1px solid rgba(61,214,140,0.18)",
            fontSize: "0.8125rem", color: "#8A9BB5",
          }}>
            ✅ <strong style={{ color: "#3DD68C" }}>Tip:</strong> The{" "}
            <code style={{ color: "#C9A84C", fontFamily: "monospace" }}>options</code> field can also be a JSON string — the uploader handles both{" "}
            <code style={{ fontFamily: "monospace", color: "#8A9BB5" }}>["A","B"]</code> and{" "}
            <code style={{ fontFamily: "monospace", color: "#8A9BB5" }}>'["A","B"]'</code>.
          </div>
        </Section>

        {/* ──────── CSV FORMAT ──────── */}
        <Section id="csv" icon={<Icon.Csv />} title="CSV Format">
          <p style={{ color: "#8A9BB5", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Upload a{" "}
            <code style={{ color: "#C9A84C", fontFamily: "monospace", background: "rgba(201,168,76,0.08)", padding: "0.1em 0.4em", borderRadius: 4 }}>.csv</code>{" "}
            file with one question per line.{" "}
            <strong style={{ color: "#F0EEE9" }}>No header row.</strong>{" "}
            Columns must appear in this exact order:
          </p>

          {/* Column order visual */}
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {["prompt", "option A", "option B", "option C", "option D", "answer", "difficulty"].map((col, i) => (
              <div key={col} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                {i > 0 && <span style={{ color: "#1A3354", fontSize: "1.1rem" }}>·</span>}
                <span style={{
                  padding: "0.3rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem",
                  fontFamily: "monospace", fontWeight: 600,
                  background: i === 0 ? "rgba(201,168,76,0.12)" : i === 5 ? "rgba(61,214,140,0.1)" : i === 6 ? "rgba(138,155,181,0.1)" : "rgba(255,255,255,0.05)",
                  color: i === 0 ? "#C9A84C" : i === 5 ? "#3DD68C" : i === 6 ? "#8A9BB5" : "#B8C8DE",
                  border: `1px solid ${i === 0 ? "rgba(201,168,76,0.25)" : i === 5 ? "rgba(61,214,140,0.2)" : "rgba(255,255,255,0.08)"}`,
                }}>
                  col {i + 1}: {col}
                </span>
              </div>
            ))}
          </div>

          <CodeBlock code={CSV_EXAMPLE} title="example.csv" />

          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[
              { icon: "⚠️", text: "Do NOT include a header row — the first row must be a real question." },
              { icon: "💡", text: 'If a field contains a comma, wrap it in double quotes: "This, indeed, is option A".' },
              { icon: "📌", text: 'The "answer" column must be the full text of the correct option, not just a letter.' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: "flex", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: "0.5rem",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(26,51,84,0.5)",
                fontSize: "0.8125rem", color: "#8A9BB5",
              }}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ──────── TEMPLATES ──────── */}
        <Section id="templates" icon={<Icon.Upload />} title="File Templates">
          <p style={{ color: "#8A9BB5", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Copy a template below and fill in your own questions. Each template shows the minimum required structure.
          </p>

          <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#F0EEE9" }}>JSON Template</h4>
          <CodeBlock code={JSON_TEMPLATE} title="template.json" />

          <h4 style={{ margin: "1.5rem 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#F0EEE9" }}>CSV Template</h4>
          <CodeBlock code={CSV_TEMPLATE} title="template.csv" />

          <div style={{
            marginTop: "1.5rem", padding: "1.125rem 1.25rem", borderRadius: "0.875rem",
            background: "rgba(15,31,56,0.7)", border: "1px solid rgba(26,51,84,0.7)",
          }}>
            <h4 style={{ margin: "0 0 0.625rem", fontSize: "0.875rem", fontWeight: 700, color: "#F0EEE9" }}>
              Difficulty values reference
            </h4>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {[
                { val: "easy",   color: "#3DD68C", desc: "Basic recall / definition" },
                { val: "medium", color: "#C9A84C", desc: "Application / reasoning" },
                { val: "hard",   color: "#F06060", desc: "Analysis / synthesis" },
              ].map(({ val, color, desc }) => (
                <div key={val} style={{
                  display: "flex", alignItems: "center", gap: "0.625rem",
                  padding: "0.5rem 0.875rem", borderRadius: "0.5rem",
                  background: "rgba(6,13,26,0.6)", border: `1px solid ${color}25`,
                }}>
                  <span style={{
                    fontFamily: "monospace", fontWeight: 700, fontSize: "0.8125rem", color,
                    padding: "0.1rem 0.5rem", borderRadius: "0.375rem",
                    background: `${color}14`,
                  }}>{val}</span>
                  <span style={{ fontSize: "0.775rem", color: "#637590" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ──────── AI PROMPTS ──────── */}
        <Section id="ai-prompts" icon={<Icon.Sparkle />} title="AI Prompts">
          <p style={{ color: "#8A9BB5", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Have questions in a PDF, Word document, image, or plain text? Use these ready-made prompts with any AI assistant (ChatGPT, Claude, Gemini, etc.) to automatically convert them into the correct upload format — no manual formatting needed.
          </p>

          {/* Step callout */}
          <div style={{
            display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap",
            padding: "1rem 1.25rem", borderRadius: "0.875rem",
            background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
            marginBottom: "1.75rem",
          }}>
            {[
              "Copy the prompt below",
              "Paste it into your AI assistant",
              "Add your questions at the bottom",
              "Save the output as .json or .csv",
              "Upload to CBT Prep Hub",
            ].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", minWidth: 120 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                  fontSize: "0.7rem", fontWeight: 800, color: "#C9A84C",
                }}>{i + 1}</span>
                <span style={{ fontSize: "0.8rem", color: "#8A9BB5", lineHeight: 1.4, paddingTop: 2 }}>{step}</span>
              </div>
            ))}
          </div>

          {PROMPTS.map((p) => (
            <PromptCard key={p.title} {...p} />
          ))}
        </Section>

        {/* ──────── FAQ ──────── */}
        <Section id="faq" icon={<Icon.Book />} title="FAQ">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {FAQS.map(({ q, a }) => (
              <details key={q} style={{
                borderRadius: "0.75rem", overflow: "hidden",
                border: "1px solid rgba(26,51,84,0.7)",
                background: "rgba(15,31,56,0.5)",
              }}>
                <summary style={{
                  padding: "1rem 1.25rem", cursor: "pointer",
                  fontSize: "0.9rem", fontWeight: 600, color: "#F0EEE9",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  listStyle: "none", userSelect: "none",
                }}>
                  {q}
                  <span style={{ color: "#637590", flexShrink: 0, marginLeft: "0.5rem" }}>▾</span>
                </summary>
                <div style={{
                  padding: "0.75rem 1.25rem 1rem",
                  borderTop: "1px solid rgba(26,51,84,0.5)",
                  fontSize: "0.875rem", color: "#8A9BB5", lineHeight: 1.7,
                }}>{a}</div>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            marginTop: "2rem", padding: "1.5rem",
            borderRadius: "1rem", textAlign: "center",
            background: "linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(15,31,56,0.6) 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}>
            <p style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 700, color: "#F0EEE9" }}>
              Ready to upload?
            </p>
            <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "#637590" }}>
              Navigate to any course page and click{" "}
              <strong style={{ color: "#C9A84C" }}>Bulk Upload</strong> to get started.
            </p>
            <Link href="/" className="btn-primary" style={{ fontSize: "0.875rem" }}>
              Go to Subjects →
            </Link>
          </div>
        </Section>

      </main>
    </div>
  );
}
