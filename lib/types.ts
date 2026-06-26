export type Question = {
	id: number;
	prompt: string;
	options: string; // JSON string
	answer?: string | null;
	courseId: number;
	difficulty: string;
};

// Helper for the answer options
export const optionLabels = ["A", "B", "C", "D"] as const;
