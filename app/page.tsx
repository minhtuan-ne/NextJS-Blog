import { BlogPostCard } from "@/components/general/BlogPostCard";
import { FilterTabs } from "@/components/general/FilterTabs";
import { prisma } from "./utils/db";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type SortOption = "latest" | "top" | "discussions";
type PostWithCounts = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { likes: number; comments: number };
};

async function getData(sort: SortOption) {
  const orderBy =
    sort === "top"
      ? [{ likes: { _count: "desc" } }, { createdAt: "desc" }]
      : sort === "discussions"
      ? [{ comments: { _count: "desc" } }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];

  const data = (await prisma.blogPost.findMany({
    orderBy: orderBy as any,
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  } as any)) as PostWithCounts[];
  return data;
}

type SearchParams = { sort?: SortOption };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sort = (params?.sort as SortOption) || "latest";

  return (
    <div className="py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Explore posts</h1>
        <FilterTabs />
      </div>
      <Suspense fallback={<BlogPostsGrid />}>
        <BlogPosts sort={sort} />
      </Suspense>
    </div>
  );
}

async function BlogPosts({ sort }: { sort: SortOption }) {
  const data = await getData(sort);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <BlogPostCard data={item} key={item.id} />
      ))}
    </div>
  );
}

// Blog posts grid with loading state
function BlogPostsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="rounded-lg border bg-card text-card-foreground shadow-sm h-[400px] flex flex-col overflow-hidden"
          key={index}
        >
          {/* Image skeleton */}
          <Skeleton className="h-48 w-full rounded-none" />

          <div className="p-4 flex-1 flex flex-col gap-3">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />

            {/* Content skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Footer skeleton */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
