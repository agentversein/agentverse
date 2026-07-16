"use client";

import { useState } from "react";

export default function CustomersPage() {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    gst: "",
    address: "",
  });

  const saveCustomer = async () => {
    const res = await fetch("/api/customers/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Customer Saved Successfully");
      setCustomer({
        name: "",
        phone: "",
        email: "",
        gst: "",
        address: "",
      });
    } else {
      alert(data.message || "Error");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        👥 Customers
      </h1>

      <div className="bg-white shadow rounded-xl p-6 max-w-xl">

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Customer Name"
          value={customer.name}
          onChange={(e) =>
            setCustomer({
              ...customer,
              name: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Mobile Number"
          value={customer.phone}
          onChange={(e) =>
            setCustomer({
              ...customer,
              phone: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Email"
          value={customer.email}
          onChange={(e) =>
            setCustomer({
              ...customer,
              email: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="GST Number"
          value={customer.gst}
          onChange={(e) =>
            setCustomer({
              ...customer,
              gst: e.target.value,
            })
          }
        />

        <textarea
          className="w-full border p-3 rounded mb-3"
          placeholder="Address"
          value={customer.address}
          onChange={(e) =>
            setCustomer({
              ...customer,
              address: e.target.value,
            })
          }
        />

        <button
          onClick={saveCustomer}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          💾 Save Customer
        </button>

      </div>
    </div>
  );
}