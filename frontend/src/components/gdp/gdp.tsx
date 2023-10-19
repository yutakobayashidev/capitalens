import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Country = {
  name: string;
  code: string;
  emoji: string;
  image: string;
  unicode: string;
};

function formatJapaneseNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + "億";
  if (num >= 10000) return (num / 10000).toFixed(1) + "万";
  return num.toString();
}

function GDPTooltip({ active, label, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip border bg-white p-3">
        <p className="label">{label}</p>
        <p className="desc">GDP: {formatJapaneseNumber(payload[0].value)}円</p>
      </div>
    );
  }

  return null;
}

export default function GDP({
  countries,
  transformedData,
}: {
  countries: Country[];
  transformedData: any;
}) {
  function findCountryByCode(code: string) {
    return countries.find((country) => country.code === code);
  }

  console.log(transformedData);

  return (
    <div className="w-full rounded border px-3 py-4">
      <h3 className="mb-5 text-lg font-medium text-gray-800">
        {findCountryByCode(transformedData[0].country_id)?.emoji}{" "}
        {findCountryByCode(transformedData[0].country_id)?.name}のGDP推移
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={transformedData}
          margin={{ bottom: 5, left: 20, right: 30, top: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatJapaneseNumber} />
          <Tooltip content={<GDPTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <span className="text-sm text-gray-500">
        ソース:{" "}
        <a href="https://www.worldbank.org/en/home" className="text-primary">
          世界銀行
        </a>
      </span>
    </div>
  );
}
