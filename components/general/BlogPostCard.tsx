import Image from "next/image";
import Link from "next/link";

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
}

export function BlogPostCard({ data }: IappProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg h-full flex flex-col">
      <Link href={`/post/${data.id}`} className="block w-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={data.imageUrl}
            alt="Image for blog"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {data.title}
        </h3>

        <p className="mb-4 text-sm text-gray-600 line-clamp-2 flex-grow">
          {data.content}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <div className="relative size-8 overflow-hidden rounded-full">
              <Image
                src={data.authorImage}
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
