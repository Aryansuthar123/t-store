"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function OrdersChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const res = await fetch("/api/orders/daywise");
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const labels = result.data.map((d) => d.date);
          const counts = result.data.map((d) => d.count);

          setChartData({
            labels,
            datasets: [
              {
                label: "Orders",
                data: counts,
                backgroundColor: "#879fff40",
                borderColor: "#879fff",
                borderWidth: 1,
                barThickness: 25,
              },
            ],
          });
        } else {
          console.error("Invalid order data:", result);
        }
      } catch (err) {
        console.error("Error fetching order data:", err);
      }
    }

    fetchOrderData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Day-wise Orders" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
   
  <section className="bg-white rounded-lg shadow h-[250px] w-full box-border p-2">
    {chartData?.labels ? (
      <Bar data={chartData} options={options} />
    ) : (
      <p className="text-center text-gray-500">Loading chart...</p>
    )}
  </section>
);



}
