"use client";

import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export function LoginPromptModal({
  open,
  onClose,
  message = "Sign in to like or comment on this post.",
}: LoginPromptModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-prompt-title"
        className="relative z-10 w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
      >
        <h2 id="login-prompt-title" className="text-lg font-semibold text-gray-900">
          Sign in required
        </h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <LoginLink className={cn(buttonVariants(), "w-full sm:flex-1 text-center")}>
            Sign in
          </LoginLink>
          <RegisterLink
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full sm:flex-1 text-center"
            )}
          >
            Sign up
          </RegisterLink>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
        >
          Continue reading
        </button>
      </div>
    </div>
  );
}
