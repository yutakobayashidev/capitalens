import { Menu, Transition } from "@headlessui/react";
import { videoComment } from "@src/types/meeting";
import { ArrowDownIcon } from "@xpadev-net/designsystem-icons";
import cn from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Session } from "next-auth";
import { Fragment, useTransition } from "react";
import { FiTrash2 } from "react-icons/fi";

import { DeleteComment } from "./actions";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export default function Comment({
  comment,
  user,
}: {
  comment: videoComment;
  user: Session["user"];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mb-3 flex items-start" key={comment.id}>
      <img
        className="h-12 w-12 rounded-full border border-gray-300"
        src={comment.user.image ?? "/noimage.png"}
        alt={comment.user.name ?? "不明なユーザー"}
      />
      <div className="ml-3 flex-1 overflow-auto break-words">
        <div className="smb-2 mb-0.5 font-bold">{comment.user.name}</div>
        <p className="mb-1 text-xs text-gray-500">
          {dayjs(comment.createdAt).fromNow()}
        </p>
        <div className="text-sm leading-7 text-gray-700">{comment.comment}</div>
      </div>
      {comment.user.id === user?.id && (
        <div>
          <Menu as="div" className="relative">
            <div>
              <Menu.Button>
                <ArrowDownIcon
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  className="text-base text-gray-500"
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
                <Menu.Item>
                  {({ active }) => (
                    <button
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          DeleteComment({ id: comment.id });
                        });
                      }}
                      className={cn(
                        active ? "bg-gray-100" : "",
                        "w-full flex items-center px-4 py-2 text-gray-700"
                      )}
                    >
                      <span className="mr-1">
                        <FiTrash2 color="#93a5b1" />
                      </span>
                      コメントを削除
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}
    </div>
  );
}
