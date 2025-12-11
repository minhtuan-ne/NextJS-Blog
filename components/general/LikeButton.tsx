"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/app/actions";
import clsx from "clsx";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
}

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useOptimistic(
    { count: initialCount, liked: initialLiked },
    (prev) => prev
  );

  const handleToggle = () => {
    startTransition(async () => {
      setState((prev) => ({
        count: prev.count + (prev.liked ? -1 : 1),
        liked: !prev.liked,
      }));
      await toggleLike(postId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors",
        state.liked
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
        isPending && "opacity-70"
      )}
    >
      <span>{state.liked ? "♥" : "♡"}</span>
      <span>{state.count}</span>
    </button>
  );
}

