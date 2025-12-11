import { prisma } from "@/app/utils/db";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { LikeButton } from "@/components/general/LikeButton";
import {
  CommentsSection,
  CommentNode,
} from "@/components/general/CommentsSection";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getData(id: string, userId?: string) {
  const data = await prisma.blogPost.findUnique({
    where: {
      id: id,
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  const liked =
    userId &&
    (await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId,
        },
      },
    })) !== null;

  return { data, liked };
}

type Params = Promise<{ id: string }>;

export default async function IdPage({ params }: { params: Params }) {
  const { id } = await params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { data, liked } = await getData(id, user?.id);

  const commentTree: CommentNode[] = (data.comments as any[]).map(
    (comment) => ({
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userName: comment.userName,
      userImage: comment.userImage,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      replies:
        (comment.replies as any[])?.map((reply) => ({
          id: reply.id,
          content: reply.content,
          userId: reply.userId,
          userName: reply.userName,
          userImage: reply.userImage,
          parentId: reply.parentId,
          createdAt: reply.createdAt,
          replies: [],
        })) || [],
    })
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link className={buttonVariants({ variant: "secondary" })} href="/">
        Back to posts
      </Link>

      <div className="mb-8 mt-6">
        <h1 className="text-3-xl font-bold tracking-tight mb-4">
          {data.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative size-10 overflow-hidden rounded-full">
                <Image
                  src={data.authorImage}
                  alt={data.authorName}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-medium">{data.authorName}</p>
            </div>
            <p className="text-sm text-gray-500">
              {new Intl.DateTimeFormat("en-SG", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              }).format(data.createdAt)}
            </p>
          </div>
          <LikeButton
            postId={data.id}
            initialCount={data._count.likes}
            initialLiked={Boolean(liked)}
          />
        </div>
      </div>

      <div className="relative h-[400px] w-full mb-8 over-flow-hidden rounded-lg">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      
      <p className="text-gray-700">{data.content}</p>
       
      <CommentsSection postId={data.id} comments={commentTree} />
    </div>
  );
}
