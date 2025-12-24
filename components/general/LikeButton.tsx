"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/app/actions";
import clsx from "clsx";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
}

type LikeState = {
  count: number;
  liked: boolean;
};

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useOptimistic<LikeState, LikeState>(
    { count: initialCount, liked: initialLiked },
    (prev: LikeState) => prev
  );

  const handleToggle = () => {
    startTransition(async () => {
      setState({
        count: state.count + (state.liked ? -1 : 1),
        liked: !state.liked,
      });
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
