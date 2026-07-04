"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function RevenueChart({ data }) {
  return (
    <Line
      data={{
        labels: data.labels,
        datasets: [
          {
            label: "Revenue",
            data: data.values,
            borderColor: "#2563eb",
            tension: 0.4,
          },
        ],
      }}
    />
  );
}