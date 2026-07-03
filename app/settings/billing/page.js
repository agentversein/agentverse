"use client";

import { useEffect, useState } from "react";
export default function BillingPage() {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
  fetch("/api/billing")
    .then((res) => res.json())
    .then((data) => setPayments(Array.isArray(data) ? data : []))
    .catch(console.error);
}, []);
 ;return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          💳 Billing History
        </h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">Invoice</th>

                <th className="p-4 text-left">Date</th>

                <th className="p-4 text-left">Plan</th>

                <th className="p-4 text-left">Amount</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-left">Receipt</th>

              </tr>

            </thead>

            <tbody>

              {payments.map((bill) => (

                <tr
                  key={bill.id}
                  className="border-t"
                >

                  <td className="p-4">{bill.id}</td>

                  <td className="p-4">{new Date(bill.createdAt).toLocaleDateString()}</td>

                  <td className="p-4">{bill.plan}</td>

                  <td className="p-4">₹{bill.amount}</td>

                  <td className="p-4">

                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      {bill.status}
                    </span>

                  </td>

                  <td className="p-4">

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Download
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}