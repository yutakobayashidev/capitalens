"use client";

import { placeholderAtom } from "@src/store/placeholder";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SetPlaceHolder({
  placeholder,
}: {
  placeholder: string;
}) {
  const [_, setPlaceholder] = useAtom(placeholderAtom);

  const router = useRouter();

  useEffect(() => {
    setPlaceholder(placeholder);
  }, [setPlaceholder, placeholder, router]);

  return null;
}
