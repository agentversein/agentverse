"use client";

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-6">
        🧾 Invoice History
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-gray-600">
          No invoices found.
        </p>
      </div>

    </div>
  );
}