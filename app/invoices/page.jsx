"use client";

import { useEffect, useState } from "react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">
        📄 Invoice History
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6">

        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Invoice</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="border p-2">
                    {invoice.invoiceNumber}
                  </td>

                  <td className="border p-2">
                    {invoice.customer?.name || "-"}
                  </td>

                  <td className="border p-2">
                    ₹{invoice.grandTotal}
                  </td>

                  <td className="border p-2">
                    {invoice.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}