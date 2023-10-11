import { Route } from "next";
import Link from "next/link";

export default function Button({
  title,
  pathname,
}: {
  title: string;
  pathname: string;
}) {
  return (
    <Link
      href={pathname as Route}
      className="mb-10 inline-block rounded-md border border-gray-100 bg-white px-4 py-2 font-semibold text-gray-700 shadow transition duration-500 hover:shadow-md"
    >
      {title}
    </Link>
  );
}
