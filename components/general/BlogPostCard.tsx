"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions";

interface IappProps {
  data: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    authorId: string;
    authorName: string;
    authorImage: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      likes: number;
      comments: number;
    };
  };
  showOptions?: boolean;
}

export function BlogPostCard({ data, showOptions }: IappProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg h-full flex flex-col">
      <Link href={`/post/${data.id}`} className="block w-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={data.imageUrl || "/file.svg"}
            alt="Image for blog"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {data.title}
          </h3>
          {showOptions && (
            <div className="flex gap-1">
              <Link href={`/dashboard/edit/${data.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </Link>
              <form 
                action={deletePost}
                onSubmit={(e) => {
                  if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="postId" value={data.id} />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>

            </div>
          )}
        </div>

        <p className="mb-4 text-sm text-gray-600 line-clamp-2 flex-grow">
          {data.content.replace(/<[^>]*>/g, "")}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <div className="relative size-8 overflow-hidden rounded-full">
              <Image
                src={data.authorImage || "/file.svg"}
                alt={data.authorName}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {data.authorName}
            </p>
          </div>

          <time className="text-xs text-gray-500">
            {new Intl.DateTimeFormat("en-SG", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }).format(data.createdAt)}
          </time>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
            ❤️ {data._count.likes}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
            💬 {data._count.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
