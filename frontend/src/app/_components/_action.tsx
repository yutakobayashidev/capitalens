"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import cn from "classnames";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";

const userNavigation = [
  {
    icon: <FiSettings color="#93a5b1" />,
    name: "アカウント設定",
    href: "/dashboard/settings",
    elementType: "link",
  },
  {
    name: "ログアウト",
    icon: <MdOutlineLogout color="#93a5b1" />,
    onClick: () => signOut({ callbackUrl: `/` }),
    elementType: "button",
  },
];

export function ProfileDropdown({ session }: { session: Session }) {
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="flex text-sm focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <img
            className="w-10 h-10 rounded-full"
            src={session.user.image ?? "/noimage.png"}
            alt={session.user.name || "メニューを開く"}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) =>
                item.elementType === "link" && item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      active ? "bg-gray-100" : "",
                      "flex items-center px-4 py-2 text-gray-700"
                    )}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={cn(
                      active ? "bg-gray-100" : "",
                      "w-full flex items-center px-4 py-2 text-gray-700"
                    )}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.name}
                  </button>
                )
              }
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
