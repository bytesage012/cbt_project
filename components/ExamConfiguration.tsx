'use client';
import React, { useState } from 'react';

type ExamConfig = {
  mode: 'exam' | 'practice';
  durationMinutes: number;
  questionCount: number;
  shuffleQuestions: boolean;
};

type ExamConfigProps = {
  totalAvailable: number;
  onStart: (config: ExamConfig) => void;
  isLoading?: boolean;
};

export default function ExamConfiguration({ totalAvailable, onStart, isLoading }: ExamConfigProps) {
  const [config, setConfig] = useState<ExamConfig>({
    mode: 'exam',
    durationMinutes: 30,
    questionCount: Math.min(10, totalAvailable),
    shuffleQuestions: true,
  });

  const handleStart = () => {
    if (config.questionCount > totalAvailable) {
      alert(`Only ${totalAvailable} question(s) available`);
      return;
    }
    onStart(config);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-navy-surface border border-navy-border rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-offwhite mb-8 text-center">Exam Setup</h1>

        {/* Mode selection */}
        <div className="mb-8">
          <label className="block text-offwhite font-semibold text-sm mb-3">Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {(['exam', 'practice'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setConfig({ ...config, mode: m })}
                className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  config.mode === m
                    ? 'bg-gold text-navy'
                    : 'bg-navy border border-navy-border text-offwhite hover:border-gold'
                }`}
              >
                {m === 'exam' ? '🎯 Exam' : '📚 Practice'}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs mt-2">
            {config.mode === 'exam'
              ? 'Timed exam. Review answers after submission.'
              : 'Untimed. Get instant feedback on each answer.'}
          </p>
        </div>

        {/* Duration (only for exam mode) */}
        {config.mode === 'exam' && (
          <div className="mb-6">
            <label className="block text-offwhite font-semibold text-sm mb-3">
              Duration: <span className="text-gold">{config.durationMinutes} min</span>
            </label>
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={config.durationMinutes}
              onChange={(e) => setConfig({ ...config, durationMinutes: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-muted text-xs mt-2">
              <span>5 min</span>
              <span>180 min</span>
            </div>
          </div>
        )}

        {/* Question count */}
        <div className="mb-6">
          <label className="block text-offwhite font-semibold text-sm mb-3">
            Questions: <span className="text-gold">{config.questionCount}</span>
          </label>
          <input
            type="range"
            min="1"
            max={totalAvailable}
            value={config.questionCount}
            onChange={(e) => setConfig({ ...config, questionCount: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-muted text-xs mt-2">
            <span>1</span>
            <span>{totalAvailable}</span>
          </div>
        </div>

        {/* Shuffle toggle */}
        <div className="mb-8 flex items-center gap-3">
          <input
            type="checkbox"
            id="shuffle"
            checked={config.shuffleQuestions}
            onChange={(e) => setConfig({ ...config, shuffleQuestions: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="shuffle" className="text-offwhite text-sm cursor-pointer">
            Shuffle question order
          </label>
        </div>

        {/* Summary */}
        <div className="bg-navy-mid rounded-lg p-4 mb-8 border border-navy-border">
          <p className="text-offwhite-dim text-sm">
            {config.mode === 'exam' ? (
              <>
                <strong>{config.durationMinutes} minutes</strong> to answer{' '}
                <strong>{config.questionCount}</strong> question{config.questionCount !== 1 ? 's' : ''}
              </>
            ) : (
              <>Get immediate feedback on <strong>{config.questionCount}</strong> question{config.questionCount !== 1 ? 's' : ''}</>
            )}
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full btn-primary py-3 font-semibold"
        >
          {isLoading ? 'Starting…' : 'Start'}
        </button>
      </div>
    </div>
  );
}
