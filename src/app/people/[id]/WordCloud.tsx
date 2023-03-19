"use client";

import { useEffect, useState } from "react";
import D3Cloud from "react-d3-cloud";
import useSWR from "swr";

interface WordCloudProps {
  name: string;
}

export default function WordCloud({ name }: WordCloudProps) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data } = useSWR(`/api/kuromoji?name=${name}`, fetcher);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div className="py-4">
      {domLoaded && data ? (
        <>
          <D3Cloud
            data={data}
            font="meiryo"
            fontWeight={700}
            rotate={(word) => word.value % 360}
            fontSize={(word) => Math.log2(word.value) * 10}
          />
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          <div className="flex justify-center">
            <div className="animate-spin h-4 w-4 border-2 mr-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
          <p>WordCloudを読み込んでいます...</p>
        </div>
      )}
    </div>
  );
}
