import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header component", () => {
  it("renders app name", () => {
    render(<Header />);
    expect(screen.getByText(/cbt prep hub/i)).toBeInTheDocument();
  });

  it("toggles dark mode", () => {
    render(<Header />);
    const button = screen.getByRole("button", { name: /toggle dark mode/i });
    fireEvent.click(button);
    expect(document.documentElement).toHaveClass("dark");
    fireEvent.click(button);
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
