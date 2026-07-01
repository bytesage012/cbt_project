export type Question = {
	id: number;
	prompt: string;
	options: string; // JSON string
	answer?: string | null;
	explanation?: string | null;
	courseId: number;
	difficulty: string;
};

// Helper for the answer options
export const optionLabels = ["A", "B", "C", "D"] as const;
export type OptionLabel = (typeof optionLabels)[number];

export function normalizeAnswerValue(value: string) {
  return value?.toString().trim().replace(/\s+/g, " ").toLowerCase();
}

export function getQuestionAnswerLabel(question: Question) {
  const options = JSON.parse(question.options) as string[];
  const rawAnswer = question.answer?.toString().trim() ?? "";
  if (!rawAnswer) {
    return { label: null as string | null, text: null as string | null };
  }

  const labelMatch = rawAnswer.match(/^([A-Da-d])(?:[.)\s]|$)/);
  if (labelMatch) {
    const label = labelMatch[1].toUpperCase() as OptionLabel;
    return {
      label,
      text: options[optionLabels.indexOf(label)] ?? rawAnswer,
    };
  }

  const normalizedAnswer = normalizeAnswerValue(rawAnswer);
  const exactIndex = options.findIndex((option) => normalizeAnswerValue(option) === normalizedAnswer);
  if (exactIndex !== -1) {
    return {
      label: optionLabels[exactIndex],
      text: options[exactIndex],
    };
  }

  const partialIndex = options.findIndex((option) => {
    const normalizedOption = normalizeAnswerValue(option);
    return normalizedOption.includes(normalizedAnswer) || normalizedAnswer.includes(normalizedOption);
  });
  if (partialIndex !== -1) {
    return {
      label: optionLabels[partialIndex],
      text: options[partialIndex],
    };
  }

  const labelOnly = optionLabels.find((label) => normalizeAnswerValue(label) === normalizedAnswer);
  if (labelOnly) {
    return {
      label: labelOnly,
      text: options[optionLabels.indexOf(labelOnly)] ?? rawAnswer,
    };
  }

  return { label: null, text: rawAnswer };
}

export function isQuestionAnswerCorrect(question: Question, selectedLabel: string | null) {
  if (!selectedLabel) return false;
  const { label } = getQuestionAnswerLabel(question);
  if (label) {
    return label === selectedLabel;
  }

  const options = JSON.parse(question.options) as string[];
  const selectedIndex = optionLabels.indexOf(selectedLabel as OptionLabel);
  if (selectedIndex === -1 || selectedIndex >= options.length) {
    return false;
  }

  return normalizeAnswerValue(options[selectedIndex]) === normalizeAnswerValue(question.answer ?? "");
}
