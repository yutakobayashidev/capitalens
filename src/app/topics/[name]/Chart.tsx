"use client";

import { Bar } from "react-chartjs-2";
import { Chart, registerables, ChartData } from "chart.js";

Chart.register(...registerables);

interface BarChartComponentProps {
  data: ChartData<"bar">;
}

export default function BarChart({ data }: BarChartComponentProps) {
  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}
