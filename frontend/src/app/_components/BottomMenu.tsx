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
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface LinkIconItemProps {
  Icon: FC<{ className: string; fill: string; height: string; width: string }>;
  label: string;
  OutlinedIcon: FC<{
    className: string;
    fill: string;
    height: string;
    width: string;
  }>;
  path: Route<string> | URL;
}

const LinkIconItem: FC<LinkIconItemProps> = ({
  Icon,
  label,
  OutlinedIcon,
  path,
}) => {
  let pathname = usePathname() || "/";

  return (
    <li className="table-cell text-center">
      <Link
        href={path}
        className={cn(
          "flex pb-1.5 pt-2 flex-col font-bold overflow-hidden whitespace-nowrap",
          {
            "text-gray-400": pathname !== path,
            "text-primary": pathname === path,
          }
        )}
      >
        {pathname === path ? (
          <Icon
            width="1em"
            height="1em"
            fill="currentColor"
            className="text-primary inline-block w-auto text-2xl"
          />
        ) : (
          <OutlinedIcon
            width="1em"
            height="1em"
            fill="currentColor"
            className="inline-block w-auto text-2xl text-gray-400"
          />
        )}
        <span className="mt-1">{label}</span>
      </Link>
    </li>
  );
};

export default function MobileFooter() {
  return (
    <div className="block md:hidden">
      <ul className="fixed bottom-0 left-0 z-50 m-0 table w-full table-fixed border bg-white">
        <LinkIconItem
          path="/"
          label="ホーム"
          Icon={HouseIcon}
          OutlinedIcon={HouseOutlinedIcon}
        />
        <LinkIconItem
          path="/face"
          label="顔認識"
          Icon={ChildIcon}
          OutlinedIcon={ChildOutlinedIcon}
        />
        <LinkIconItem
          path="/chat"
          label="チャット"
          Icon={InboxIcon}
          OutlinedIcon={InboxOutlinedIcon}
        />
        <LinkIconItem
          path="/topics"
          label="トピック"
          Icon={SealCertificateIcon}
          OutlinedIcon={SealCertificateOutlinedIcon}
        />
        <LinkIconItem
          path="/search"
          label="検索"
          Icon={SearchIcon}
          OutlinedIcon={SearchIcon}
        />
      </ul>
    </div>
  );
}
