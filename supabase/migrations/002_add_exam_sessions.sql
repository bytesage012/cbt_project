BEGIN;

-- Exam sessions: track each exam attempt
CREATE TABLE exam_sessions (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id int NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  mode text NOT NULL DEFAULT 'exam', -- 'exam' or 'practice'
  total_questions int NOT NULL,
  duration_seconds int NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  score int,
  status text DEFAULT 'in_progress' -- 'in_progress', 'completed'
);

-- User answers: track each answer during an exam
CREATE TABLE exam_answers (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  exam_session_id int NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_id int NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer text,
  is_correct boolean,
  time_spent_seconds int DEFAULT 0
);

CREATE INDEX idx_exam_sessions_course_id ON exam_sessions(course_id);
CREATE INDEX idx_exam_sessions_status ON exam_sessions(status);
CREATE INDEX idx_exam_answers_exam_session_id ON exam_answers(exam_session_id);

COMMIT;
