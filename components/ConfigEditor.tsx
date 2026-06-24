"use client";
import React, { useState } from "react";
import DeleteButton from "@/components/DeleteButton";

type Config = { key: string; value: string };
type ConfigEditorProps = { initialConfig: Config[] };

const friendlyName = (key: string) => {
  const map: Record<string, { label: string; hint: string }> = {
    examDurationMinutes: { label: "Exam Duration",   hint: "minutes per session" },
    passMarkPercent:     { label: "Pass Mark",        hint: "minimum % to pass"  },
    appName:             { label: "App Name",         hint: "displayed in header" },
  };
  return map[key] ?? { label: key, hint: "" };
};

export default function ConfigEditor({ initialConfig }: ConfigEditorProps) {
  const [configs, setConfigs]     = useState<Config[]>(initialConfig);
  const [newConfig, setNewConfig] = useState<Config>({ key: "", value: "" });
  const [saved, setSaved]         = useState<Record<number, boolean>>({});
  const [addOpen, setAddOpen]     = useState(false);

  const save = async (cfg: Config, idx?: number) => {
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cfg),
    });
    if (idx !== undefined) {
      setSaved((s) => ({ ...s, [idx]: true }));
      setTimeout(() => setSaved((s) => { const c = { ...s }; delete c[idx]; return c; }), 2000);
    }
  };

  const deleteConfig = async (key: string, idx: number) => {
    await fetch(`/api/config?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    setConfigs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdd = async () => {
    if (!newConfig.key) return;
    await save(newConfig);
    setConfigs([...configs, newConfig]);
    setNewConfig({ key: "", value: "" });
    setAddOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Existing config rows */}
      {configs.map((c, i) => {
        const { label, hint } = friendlyName(c.key);
        return (
          <div key={i} className="bg-navy-deep border border-navy-border rounded-lg px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 group"
            style={{ borderRadius: "var(--radius-md)" }}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-offwhite">{label}</p>
              {hint && <p className="text-[0.6875rem] text-muted mt-0.5">{hint}</p>}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                className="input w-full sm:w-36 text-center flex-shrink-0"
                value={c.value}
                onChange={(e) => {
                  const upd = [...configs];
                  upd[i] = { ...c, value: e.target.value };
                  setConfigs(upd);
                }}
              />
              <button
                className={`btn-primary text-xs py-1.5 px-3 flex-shrink-0 transition-all duration-200 ${saved[i] ? "!bg-success !shadow-none" : ""}`}
                onClick={() => save(c, i)}
              >
                {saved[i] ? (
                  <span className="flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Saved
                  </span>
                ) : "Save"}
              </button>
              <DeleteButton
                label={c.key}
                iconOnly
                onConfirm={() => deleteConfig(c.key, i)}
              />
            </div>
          </div>
        );
      })}

      {/* Divider */}
      <div className="border-t border-navy-border my-4" />

      {/* Add new */}
      {!addOpen ? (
        <button className="btn-ghost w-full justify-center" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Config Key
        </button>
      ) : (
        <div className="bg-navy-deep border border-navy-border rounded-lg p-4 animate-slide-up" style={{ borderRadius: "var(--radius-md)" }}>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">New Config Key</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              className="input flex-1"
              placeholder="Key (e.g. maxQuestions)"
              value={newConfig.key}
              onChange={(e) => setNewConfig({ ...newConfig, key: e.target.value })}
            />
            <input
              className="input sm:w-32"
              placeholder="Value"
              value={newConfig.value}
              onChange={(e) => setNewConfig({ ...newConfig, value: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <button className="btn-primary text-xs py-2 px-3 flex-1 sm:flex-none flex-shrink-0" onClick={handleAdd}>Add</button>
              <button className="btn-ghost text-xs py-2 px-2 flex-shrink-0" onClick={() => { setAddOpen(false); setNewConfig({ key: "", value: "" }); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
