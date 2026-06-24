import { render, screen, fireEvent } from "@testing-library/react";
import ExamQuestion from "@/components/ExamQuestion";

const mockQuestion = {
  id: 1,
  prompt: "Sample prompt",
  options: JSON.stringify(["Opt A", "Opt B", "Opt C", "Opt D"]),
  answer: "A",
  difficulty: "easy",
} as any;

describe("ExamQuestion component", () => {
  it("renders prompt and options", () => {
    render(
      <ExamQuestion
        question={mockQuestion}
        questionNumber={1}
        total={10}
        selectedAnswer={null}
        onAnswer={() => {}}
      />
    );
    expect(screen.getByText(/sample prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/^A\./i)).toBeInTheDocument();
    expect(screen.getByText(/^B\./i)).toBeInTheDocument();
  });

  it("calls onAnswer when option clicked", () => {
    const handler = jest.fn();
    render(
      <ExamQuestion
        question={mockQuestion}
        questionNumber={1}
        total={10}
        selectedAnswer={null}
        onAnswer={handler}
      />
    );
    fireEvent.click(screen.getByText(/^C\./i));
    expect(handler).toHaveBeenCalledWith("C");
  });
});
