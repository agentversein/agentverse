"use client";

import { useEffect, useState } from "react";
import RevenueChart from "@/components/RevenueChart"
export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    payments: 0,
    revenue: 0,
    proUsers: 0,
    chats: 0,
  });
const [chartData, setChartData] = useState({
  labels: [],
  values: [],
});
 useEffect(() => {
  fetch("/api/admin/stats")
    .then((res) => res.json())
    .then((data) => setStats(data))
    .catch(console.error);

  fetch("/api/admin/revenue")
    .then((res) => res.json())
    .then((data) => setChartData(data))
    .catch(console.error);
}, []);
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        📊 Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Users</h2>
          <h1 className="text-4xl font-bold">
            {stats.users}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Revenue</h2>
          <h1 className="text-4xl font-bold">
            ₹{stats.revenue}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Payments</h2>
          <h1 className="text-4xl font-bold">
            {stats.payments}
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
  <h2 className="text-2xl font-bold mb-5">
    📈 Monthly Revenue
  </h2>

  <RevenueChart data={chartData} />
</div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">PRO Users</h2>
          <h1 className="text-4xl font-bold">
            {stats.proUsers}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Chats</h2>
          <h1 className="text-4xl font-bold">
            {stats.chats}
          </h1>
        </div>

      </div>

    </div>
  );
}