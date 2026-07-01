-- Migration: add explanation column to questions
-- Adds an optional text column `explanation` to store answer rationale or hints.

ALTER TABLE IF EXISTS questions
  ADD COLUMN IF NOT EXISTS explanation TEXT;
