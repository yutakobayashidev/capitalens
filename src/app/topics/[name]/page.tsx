import BarChartComponent from "@src/components/Chart";
import Link from "next/link";
import { peoples } from "@peoples";
import type { Metadata } from "next";

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
    <div className="mx-auto max-w-screen-xl px-4 md:px-8 my-12">
      <section>
        <h1 className="font-bold mb-7 text-3xl md:text-4xl">
          🔍「{decodeURI(params.name)}」に関するデータ
        </h1>
        <p className="mb-3">
          {decodeURI(params.name)}に関する情報を収集して表示しています。
        </p>
        <BarChartComponent data={data} />
        <h1 className="font-bold my-7 text-3xl">
          このトピックをよく言及している人物
        </h1>
        <div className="grid grid-cols-12">
          {peoples.map((people) => (
            <Link href={`/people/${people.id}`} key={people.id} className="p-3">
              <img
                src={people.image}
                alt={people.name}
                className="rounded-full"
                width={100}
                height={100}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
