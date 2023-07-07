import BarChartComponent from "@src/app/topics/[name]/Chart";
import ViewCounter from "@src/app/topics/[name]/view-counter";
import { InformationIcon } from "@xpadev-net/designsystem-icons";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata | undefined> {
  return { title: decodeURI(params.name) + "に関するデータ" };
}

const data = {
  datasets: [
    {
      backgroundColor: "#1E50B5",
      barPercentage: 0.9,
      borderWidth: 0,
      categoryPercentage: 0.8,
      data: [65, 59, 80, 81, 56, 55, 40],
      label: "発言数",
      maxBarThickness: 50,
      minBarLength: 2,
    },
  ],
  labels: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月"],
};

export default async function Page({ params }: { params: { name: string } }) {
  return (
    <>
      <div className="mx-auto my-12 max-w-screen-xl px-4 md:px-8">
        <section>
          <h1 className="mb-7 text-3xl font-bold md:text-4xl">
            🔍「{decodeURI(params.name)}」に関するデータ
          </h1>
          <p className="mb-3">
            {decodeURI(params.name)}に関する情報を収集して表示しています。
          </p>
          <BarChartComponent data={data} />
          <h1 className="my-5 text-3xl font-bold">
            このトピックをよく言及している人物
          </h1>
          <div className="mb-5 flex items-center gap-x-1 rounded-md bg-blue-50 px-4 py-3 text-base">
            <InformationIcon
              width="1em"
              height="1em"
              fill="currentColor"
              className="text-xl text-blue-500"
            />
            このデータは議席数などに依存する可能性があります。
          </div>
        </section>
      </div>
      <ViewCounter name={params.name} />
    </>
  );
}
