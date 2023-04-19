"use client";

import { useEffect, useState } from "react";
import D3Cloud from "react-d3-cloud";
import useSWR from "swr";
import { BsDownload } from "react-icons/bs";
import { usePathname } from "next/navigation";

interface Word {
  text: string;
  value: number;
}

interface WordCloudProps {
  name: string;
}

export default function WordCloud({ name }: WordCloudProps) {
  const pathname = usePathname();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data } = useSWR(`/api/tokenize?name=${name}`, fetcher);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  async function downloadCSV(words: Word[]) {
    const header = "Text,Value\n";
    const csvContent = words
      .map((word) => `${word.text},${word.value}`)
      .join("\n");

    const blob = new Blob([header + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${pathname}.csv`);
    document.body.appendChild(link);
    link.click();

    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }

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
          <div className="flex justify-center">
            <button
              onClick={async () => {
                downloadCSV(data);
              }}
              className="text-green-600 mt-5 text-lg flex items-center font-semibold"
            >
              <BsDownload className="mr-2" />
              CSVデータをダウンロード
            </button>
          </div>
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
