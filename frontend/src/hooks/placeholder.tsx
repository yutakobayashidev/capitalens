"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { placeholderAtom } from "@src/store/placeholder";
import { useRouter } from "next/navigation";

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
