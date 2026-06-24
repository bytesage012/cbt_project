import type { Question as PrismaQuestion } from "@prisma/client";

export type Question = PrismaQuestion;

// Helper for the answer options
export const optionLabels = ["A", "B", "C", "D"] as const;
