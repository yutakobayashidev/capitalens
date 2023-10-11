"use client";

import { Chart, ChartData, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(...registerables);

interface BarChartComponentProps {
  data: ChartData<"bar">;
}

export default function BarChart({ data }: BarChartComponentProps) {
  return (
    <Bar
      data={data}
      options={{
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: true,
      }}
    />
  );
}
