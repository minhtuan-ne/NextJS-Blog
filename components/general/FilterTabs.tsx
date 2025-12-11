"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

type SortOption = "latest" | "top" | "discussions";

const tabs: { label: string; value: SortOption }[] = [
  { label: "Latest", value: "latest" },
  { label: "Top", value: "top" },
  { label: "Discussions", value: "discussions" },
];

export function FilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("sort") as SortOption) || "latest";

  const setSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "latest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-1 py-1 shadow-sm">
      {tabs.map((tab) => {
        const active = tab.value === current;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSort(tab.value)}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

