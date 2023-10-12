"use client";

import type { Group, Member } from "@prisma/client";
import { GearIcon } from "@radix-ui/react-icons";
import { get_contains_members } from "@src/app/actions";
import MessageItem from "@src/components/message-item/message-item";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@src/components/ui/command";
import { nanoid } from "@src/helper/nanoid";
import { cmdAtom } from "@src/store/cmd";
import { placeholderAtom } from "@src/store/placeholder";
import { Country } from "@src/types/country";
import { MeOutlinedIcon } from "@xpadev-net/designsystem-icons";
import { useChat } from "ai/react";
import { useAtom } from "jotai";
import { LogIn, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ExtendedMember = Member & {
  group: Group | null;
};

export default function CommandMenu({
  countries,
  user,
}: {
  countries: Country[];
  user: Session["user"];
}) {
  const router = useRouter();

  const [open, setOpen] = useAtom(cmdAtom);
  const [placeholder] = useAtom(placeholderAtom);
  const [query, setInputValue] = useState("");
  const [members, setMembers] = useState<ExtendedMember[] | null>(null);
  const [isMemberSearchMode, setIsMemberSearchMode] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const { append, data, input, isLoading, messages, setInput } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("利用制限を超えました。時間を開けてお試しください。");
        return;
      }
    },
  });

  useEffect(() => {
    if (!open) {
      setIsMemberSearchMode(false);
      setIsAIMode(false);
      setInput("");
    }
  }, [open]);

  useEffect(() => {
    get_contains_members(query).then((res) => {
      setMembers(res);
    });
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const handleValueChange = (search: string) => {
    if (isMemberSearchMode) {
      setInputValue(search);
    }
  };

  useEffect(() => {
    const handleCompositionStart = () => setIsComposing(true);
    const handleCompositionEnd = () => setIsComposing(false);

    document.addEventListener("compositionstart", handleCompositionStart);
    document.addEventListener("compositionend", handleCompositionEnd);

    return () => {
      document.removeEventListener("compositionstart", handleCompositionStart);
      document.removeEventListener("compositionend", handleCompositionEnd);
    };
  }, []);

  const disabled = isLoading || input.length === 0;

  const id = nanoid();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        value={input}
        onKeyDown={async (e) => {
          if (isAIMode && e.key === "Enter" && !e.shiftKey && !disabled) {
            e.preventDefault();

            setInput("");

            await append({
              id,
              content: input,
              role: "user",
            });
          } else if (e.key === "Tab") {
            e.preventDefault();
            setInput(placeholder);
          }
        }}
        onValueChange={(value) => {
          setInput(value);
          handleValueChange(value);
        }}
        placeholder={
          isMemberSearchMode
            ? "議員名を入力..."
            : isAIMode
            ? isAIMode && placeholder === "質問を入力してください"
              ? "メッセージを入力してエンターキーを入力..."
              : placeholder
            : "コマンドを検索..."
        }
      />
      <CommandList>
        {isMemberSearchMode ? (
          <CommandGroup heading="議員検索">
            {members &&
              members.map((member) => (
                <CommandItem
                  key={member.id}
                  value={member.name}
                  className="flex items-center justify-between"
                  onSelect={() => {
                    if (!isComposing) {
                      runCommand(() => router.push(`/members/${member.id}`));
                    }
                  }}
                >
                  <div className="flex">
                    <img
                      className="mr-2 h-6 w-6 rounded-full border border-gray-300 object-cover object-center"
                      src={member.image ?? "/noimage.png"}
                      alt={member.name + "さんの顔"}
                    />
                    {member.name}
                  </div>
                  {member.group && (
                    <span className="text-gray-500">{member.group.name}</span>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
        ) : isAIMode ? (
          <div className="p-3">
            {messages.length ? (
              messages.map((message, i) => {
                const correspondingData = data
                  ? data.find((d: any) => d.index === i)
                  : null;

                return (
                  <div key={i} className="mb-5">
                    <MessageItem
                      countries={countries}
                      message={message}
                      user={user}
                      data={correspondingData}
                    />
                  </div>
                );
              })
            ) : (
              <div className="mx-auto flex max-w-md flex-col items-center justify-center py-10 text-gray-500">
                <Sparkles className="mb-5 h-20 w-20 text-[#9d34da]" />
                <h2 className="mb-5 text-center text-3xl font-bold">
                  AIに質問する
                </h2>
                <p className="text-center text-sm">
                  議員の情報や、最近の国会の情報や世界銀行のデータなどを自然な言葉から調べられます。早速入力してみましょう。
                </p>
              </div>
            )}
          </div>
        ) : (
          <CommandGroup heading="ショートカット">
            <CommandItem
              value="AIに質問する"
              onSelect={() => setIsAIMode(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AIに質問する</span>
            </CommandItem>
            <CommandItem
              value="議員検索"
              onSelect={() => setIsMemberSearchMode(true)}
            >
              <MeOutlinedIcon
                width="1em"
                height="1em"
                fill="currentColor"
                className="mr-2 h-4 w-4"
              />
              <span>議員検索</span>
            </CommandItem>
            {user ? (
              <>
                <CommandItem
                  value="アカウント"
                  onSelect={() => {
                    runCommand(() => router.push("/dashboard/settings"));
                  }}
                >
                  <GearIcon className="mr-2 h-4 w-4" />
                  <span>アカウント設定</span>
                </CommandItem>
                <CommandItem
                  value="ログアウト"
                  onSelect={() => {
                    runCommand(() => {
                      signOut();
                    });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </CommandItem>
              </>
            ) : (
              <CommandItem
                value="Googleでログイン"
                onSelect={() => {
                  runCommand(() => {
                    signIn("google");
                  });
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                <span>Googleでログイン</span>
              </CommandItem>
            )}
          </CommandGroup>
        )}
        {!isAIMode && (
          <CommandEmpty>
            {isMemberSearchMode
              ? "議員が見つかりませんでした"
              : "コマンドが見つかりませんでした"}
          </CommandEmpty>
        )}
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
}
