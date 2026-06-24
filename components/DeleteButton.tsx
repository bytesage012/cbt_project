"use client";
import React, { useState } from "react";

type DeleteButtonProps = {
  label: string;
  onConfirm: () => Promise<void>;
  /** If true, renders an icon-only button (no text) */
  iconOnly?: boolean;
};

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const Spinner = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className="animate-spin-slow"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function DeleteButton({ label, onConfirm, iconOnly = false }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrigger = () => {
    setError(null);
    setConfirming(true);
  };

  const handleCancel = () => {
    setConfirming(false);
    setError(null);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      // navigation/state update handled by caller
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <button
        type="button"
        className="btn-danger text-sm"
        style={iconOnly ? { padding: "0.375rem 0.5rem" } : undefined}
        onClick={handleTrigger}
        aria-label={`Delete ${label}`}
      >
        <TrashIcon />
        {!iconOnly && <span>Delete</span>}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="bg-navy-deep border border-danger/30 rounded-lg p-3 animate-scale-in"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        <p className="text-sm text-offwhite-dim mb-3 leading-snug">
          Are you sure you want to delete{" "}
          <span className="text-offwhite font-semibold">{label}</span>?{" "}
          <span className="text-danger/80">This cannot be undone.</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost text-xs py-1.5 px-3"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger text-xs py-1.5 px-3"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Deleting…
              </>
            ) : (
              <>
                <TrashIcon />
                Confirm Delete
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-danger text-xs mt-2 leading-snug">{error}</p>
        )}
      </div>
    </div>
  );
}
