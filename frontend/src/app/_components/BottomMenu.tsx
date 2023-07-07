"use client";

import {
  ChildIcon,
  ChildOutlinedIcon,
  HouseIcon,
  HouseOutlinedIcon,
  InboxIcon,
  InboxOutlinedIcon,
  SealCertificateIcon,
  SealCertificateOutlinedIcon,
  SearchIcon,
} from "@xpadev-net/designsystem-icons";
import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileFooter() {
  let pathname = usePathname() || "/";

  return (
    <div className="block md:hidden">
      <ul className="z-99 fixed bottom-0 left-0 m-0 table w-full table-fixed border bg-white">
        <li className="table-cell text-center">
          <Link
            href="/"
            className={cn(
              "flex pb-1.5 pt-2 flex-col font-bold overflow-hidden whitespace-nowrap",
              {
                "text-gray-400": pathname !== "/",
                "text-primary": pathname === "/",
              }
            )}
          >
            {pathname === "/" ? (
              <HouseIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-primary"
              />
            ) : (
              <HouseOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-gray-400"
              />
            )}
            <span className="mt-1">ホーム</span>
          </Link>
        </li>
        <li className="table-cell text-center">
          <Link
            href="/face"
            className={cn(
              "flex flex-col pb-1.5 pt-2 font-bold overflow-hidden whitespace-nowrap",
              {
                "text-gray-400": pathname !== "/face",
                "text-primary": pathname === "/face",
              }
            )}
          >
            {pathname === "/face" ? (
              <ChildIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-primary"
              />
            ) : (
              <ChildOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-gray-400"
              />
            )}
            <span className="mt-1">顔認識</span>
          </Link>
        </li>
        <li className="table-cell text-center">
          <Link
            href="/chat"
            className={cn(
              "flex pb-1.5 pt-2 flex-col font-bold overflow-hidden whitespace-nowrap",
              {
                "text-gray-400": pathname !== "/chat",
                "text-primary": pathname === "/chat",
              }
            )}
          >
            {pathname === "/chat" ? (
              <InboxIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-primary"
              />
            ) : (
              <InboxOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-gray-400"
              />
            )}
            <span className="mt-1">チャット</span>
          </Link>
        </li>
        <li className="table-cell text-center">
          <Link
            href="/topics"
            className={cn(
              "pb-1.5 pt-2 flex flex-col font-bold overflow-hidden whitespace-nowrap",
              {
                "text-gray-400": pathname !== "/topics",
                "text-primary": pathname === "/topics",
              }
            )}
          >
            {pathname === "/topics" ? (
              <SealCertificateIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-primary"
              />
            ) : (
              <SealCertificateOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block w-auto text-2xl text-gray-400"
              />
            )}
            <span className="mt-1">トピック</span>
          </Link>
        </li>
        <li className="table-cell text-center">
          <button
            onClick={() => alert("Coming soon!")}
            className="inline-flex flex-col overflow-hidden whitespace-nowrap pb-1.5 pt-2 font-bold text-gray-400"
          >
            <SearchIcon
              width="1em"
              height="1em"
              fill="currentColor"
              className="inline-block w-auto text-2xl text-gray-400"
            />
            <span className="mt-1">検索</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
