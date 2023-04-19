"use client";

import { useEffect } from "react";

export default function ViewCounter({ name }: { name: string }) {
  useEffect(() => {
    const registerView = () =>
      fetch(`/api/views/${name}`, {
        method: "POST",
      });

    registerView();
  }, [name]);

  return null;
}
