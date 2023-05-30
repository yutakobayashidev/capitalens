"use client";

import { useEffect } from "react";

export default function TwitterTimeline({ username }: { username: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <a
      className="twitter-timeline"
      data-height="500"
      href={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Tweets by @{username}
    </a>
  );
}
