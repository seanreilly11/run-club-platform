import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./auth-form";

// Mock server actions
vi.mock("@/lib/actions/auth", () => ({
  checkEmail: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  sendMagicLink: vi.fn(),
}));

import { checkEmail, signIn, signUp, sendMagicLink } from "@/lib/actions/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthForm", () => {
  it("renders email input on initial load", () => {
    render(<AuthForm />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("shows password field after Continue for existing user", async () => {
    vi.mocked(checkEmail).mockResolvedValue({
      success: true,
      data: { exists: true },
    });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "existing@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });
    expect(screen.queryByPlaceholderText(/your name/i)).not.toBeInTheDocument();
  });

  it("shows name + password fields for new user", async () => {
    vi.mocked(checkEmail).mockResolvedValue({
      success: true,
      data: { exists: false },
    });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "new@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/let's get you set up/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. sarah/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it("shows inline error when checkEmail fails", async () => {
    vi.mocked(checkEmail).mockResolvedValue({
      success: false,
      error: "Something went wrong",
    });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "user@test.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("calls sendMagicLink on magic link button click", async () => {
    vi.mocked(sendMagicLink).mockResolvedValue({ success: true, data: undefined });
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "user@test.com");
    await user.click(screen.getByRole("button", { name: /magic link/i }));

    await waitFor(() => {
      expect(sendMagicLink).toHaveBeenCalledWith(
        expect.objectContaining({ email: "user@test.com" }),
      );
      expect(screen.getByText(/check your inbox/i)).toBeInTheDocument();
    });
  });
});