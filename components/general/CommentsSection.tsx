"use client";

import { useState, useTransition } from "react";
import { addComment } from "@/app/actions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginPromptModal } from "@/components/general/LoginPromptModal";

export type CommentNode = {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userImage: string;
  createdAt: Date;
  replies: CommentNode[];
  parentId: string | null;
};

interface CommentsSectionProps {
  postId: string;
  comments: CommentNode[];
}

export function CommentsSection({ postId, comments }: CommentsSectionProps) {
  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-lg font-semibold">Comments</h3>
      <CommentForm postId={postId} />
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-600">Be the first to comment.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  postId,
}: {
  comment: CommentNode;
  postId: string;
}) {
  const { getUser, isLoading } = useKindeBrowserClient();
  const [replyOpen, setReplyOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleReplyClick = () => {
    if (replyOpen) {
      setReplyOpen(false);
      return;
    }
    if (!isLoading && !getUser()) {
      setLoginOpen(true);
      return;
    }
    setReplyOpen(true);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100">
            {comment.userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.userImage}
                alt={comment.userName}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <span className="font-medium text-gray-700">{comment.userName}</span>
        </div>
        <span>
          {new Intl.DateTimeFormat("en-SG", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).format(new Date(comment.createdAt))}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-800">{comment.content}</p>
      <button
        type="button"
        onClick={handleReplyClick}
        className="mt-2 text-xs font-medium text-blue-600 hover:underline"
      >
        {replyOpen ? "Cancel" : "Reply"}
      </button>

      {replyOpen && (
        <div className="mt-3">
          <CommentForm postId={postId} parentId={comment.id} />
        </div>
      )}

      {comment.replies?.length ? (
        <div className="mt-3 space-y-3 border-l border-gray-200 pl-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} />
          ))}
        </div>
      ) : null}
      <LoginPromptModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        message="Sign in to reply to this comment."
      />
    </div>
  );
}

function CommentForm({
  postId,
  parentId,
}: {
  postId: string;
  parentId?: string;
}) {
  const { getUser, isLoading } = useKindeBrowserClient();
  const [loginOpen, setLoginOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoading && !getUser()) {
      setLoginOpen(true);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      await addComment(formData);
      form.reset();
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="hidden" name="postId" value={postId} />
        {parentId ? (
          <input type="hidden" name="parentId" value={parentId} />
        ) : null}
        <textarea
          name="content"
          required
          rows={3}
          placeholder="Add a comment..."
          disabled={isPending}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={isPending || Boolean(isLoading)}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {isPending ? "Posting..." : "Post comment"}
        </button>
      </form>
      <LoginPromptModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        message="Sign in to join the conversation."
      />
    </>
  );
}
