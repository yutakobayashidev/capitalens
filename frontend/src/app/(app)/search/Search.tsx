"use client";

import { SearchIcon } from "@xpadev-net/designsystem-icons";
import { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams?.get("q");
  const source = searchParams?.get("source");

  const [search, setSearch] = useState<string>(query ?? "");

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="relative flex items-center overflow-hidden rounded-full border border-gray-300 bg-white">
          <div className="absolute left-3">
            <SearchIcon className="inline-flex items-center fill-gray-400" />
          </div>
          <input
            autoComplete="off"
            className="w-full py-3 pl-12 pr-3 outline-none"
            placeholder="キーワードを入力..."
            value={search}
            onChange={handleInputChange}
          />
        </div>
      </form>
      {query && (
        <nav className="mb-5 mt-3 flex w-full flex-wrap items-center gap-x-4 overflow-x-auto whitespace-nowrap">
          <Link
            className={`inline-flex items-center border-b-2 py-2 font-semibold ${
              !source || source === "members"
                ? "border-gray-500"
                : "border-transparent text-gray-400"
            }`}
            href={`/search/?q=${search}&source=members` as Route}
          >
            <span>国会議員</span>
          </Link>
          <Link
            className={`inline-flex items-center border-b-2 py-2 font-semibold ${
              source === "meetings"
                ? "border-gray-500"
                : "border-transparent text-gray-400"
            }`}
            href={`/search/?q=${search}&source=meetings` as Route}
          >
            <span>会議</span>
          </Link>
        </nav>
      )}
    </>
  );
}
