"use client";

import { useState, useEffect } from "react";
useEffect(() => {
  loadCompany();
}, []);

const loadCompany = async () => {
  try {
    const res = await fetch("/api/company");
    const data = await res.json();

    if (data && data._id) {
      setCompany(data);
    }
  } catch (err) {
    console.error(err);
  }
};
export default function CompanySettings() {
  const [company, setCompany] = useState({
    name: "",
    tagline: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    gstNumber: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
  });

  const saveCompany = async () => {
    const res = await fetch("/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(company),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Company Details Saved");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">

        <h1 className="text-3xl font-bold mb-6">
          🏢 Company Settings
        </h1>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Company Name"
          onChange={(e)=>setCompany({...company,name:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Tagline"
          onChange={(e)=>setCompany({...company,tagline:e.target.value})}
        />

        <textarea
          className="w-full border p-3 rounded mb-3"
          placeholder="Address"
          onChange={(e)=>setCompany({...company,address:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Phone"
          onChange={(e)=>setCompany({...company,phone:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Email"
          onChange={(e)=>setCompany({...company,email:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Website"
          onChange={(e)=>setCompany({...company,website:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="GST Number"
          onChange={(e)=>setCompany({...company,gstNumber:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Bank Name"
          onChange={(e)=>setCompany({...company,bankName:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Account Number"
          onChange={(e)=>setCompany({...company,accountNumber:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="IFSC Code"
          onChange={(e)=>setCompany({...company,ifsc:e.target.value})}
        />

        <input
          className="w-full border p-3 rounded mb-5"
          placeholder="UPI ID"
          onChange={(e)=>setCompany({...company,upiId:e.target.value})}
        />

        <button
          onClick={saveCompany}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          💾 Save Company
        </button>

      </div>
    </div>
  );
}