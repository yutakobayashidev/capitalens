"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";
import {
  HouseIcon,
  HouseOutlinedIcon,
  ChildIcon,
  ChildOutlinedIcon,
  SearchIcon,
  InboxIcon,
  InboxOutlinedIcon,
  SealCertificateIcon,
  SealCertificateOutlinedIcon,
} from "@xpadev-net/designsystem-icons";

export default function MobileFooter() {
  let pathname = usePathname() || "/";

  return (
    <div className="block md:hidden">
      <ul className="fixed table table-fixed w-full bottom-0 border left-0 z-99 m-0 bg-white">
        <li className="table-cell text-center">
          <Link
            href="/"
            className={cn(
              "flex pb-1.5 pt-2 flex-col font-bold overflow-hidden whitespace-nowrap",
              {
                "text-primary": pathname === "/",
                "text-gray-400": pathname !== "/",
              }
            )}
          >
            {pathname === "/" ? (
              <HouseIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-primary text-2xl w-auto"
              />
            ) : (
              <HouseOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-gray-400 text-2xl w-auto"
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
                "text-primary": pathname === "/face",
                "text-gray-400": pathname !== "/face",
              }
            )}
          >
            {pathname === "/face" ? (
              <ChildIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-primary text-2xl w-auto"
              />
            ) : (
              <ChildOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-gray-400 text-2xl w-auto"
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
                "text-primary": pathname === "/chat",
                "text-gray-400": pathname !== "/chat",
              }
            )}
          >
            {pathname === "/chat" ? (
              <InboxIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-primary text-2xl w-auto"
              />
            ) : (
              <InboxOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-gray-400 text-2xl w-auto"
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
                "text-primary": pathname === "/topics",
                "text-gray-400": pathname !== "/topics",
              }
            )}
          >
            {pathname === "/topics" ? (
              <SealCertificateIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-primary text-2xl w-auto"
              />
            ) : (
              <SealCertificateOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="inline-block text-gray-400 text-2xl w-auto"
              />
            )}
            <span className="mt-1">トピック</span>
          </Link>
        </li>
        <li className="table-cell text-center">
          <button
            onClick={() => alert("Coming soon!")}
            className="pb-1.5 pt-2 text-gray-400 inline-flex flex-col font-bold overflow-hidden whitespace-nowrap"
          >
            <SearchIcon
              width="1em"
              height="1em"
              fill="currentColor"
              className="inline-block text-gray-400 text-2xl w-auto"
            />
            <span className="mt-1">検索</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
