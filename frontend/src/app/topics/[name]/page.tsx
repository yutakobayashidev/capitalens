import BarChartComponent from "@src/app/topics/[name]/Chart";
import type { Metadata } from "next";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ViewCounter from "@src/app/topics/[name]/view-counter";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata | undefined> {
  return { title: decodeURI(params.name) + "に関するデータ" };
}

const data = {
  labels: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月"],
  datasets: [
    {
      label: "発言数",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "#1E50B5",
      borderWidth: 0,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      maxBarThickness: 50,
      minBarLength: 2,
    },
  ],
};

export default async function Page({ params }: { params: { name: string } }) {
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 my-12">
        <section>
          <h1 className="font-bold mb-7 text-3xl md:text-4xl">
            🔍「{decodeURI(params.name)}」に関するデータ
          </h1>
          <p className="mb-3">
            {decodeURI(params.name)}に関する情報を収集して表示しています。
          </p>
          <BarChartComponent data={data} />
          <h1 className="font-bold my-5 text-3xl">
            このトピックをよく言及している人物
          </h1>
          <div className="flex items-center text-base mb-5 px-6 py-3 rounded-md bg-blue-50">
            <AiOutlineInfoCircle className="mr-2 text-blue-500" />
            このデータは議席数などに依存する可能性があります。
          </div>
        </section>
      </div>
      <ViewCounter name={params.name} />
    </>
  );
}
