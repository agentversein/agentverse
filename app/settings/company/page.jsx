  "use client";

import { useState, useEffect } from "react";
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
    logo: "",
  });
  const handleLogo = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setCompany((prev) => ({
      ...prev,
      logo: reader.result,
    }));
  };

  reader.readAsDataURL(file);
};
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

useEffect(() => {
  loadCompany();
}, []);
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
  setCompany(data.company);
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
  value={company.name}
  onChange={(e) =>
    setCompany({
      ...company,
      name: e.target.value,
    })
  }
/>

       <input
  className="w-full border p-3 rounded mb-3"
  placeholder="Tagline"
  value={company.tagline}
  onChange={(e) =>
    setCompany({
      ...company,
      tagline: e.target.value,
    })
  }
/>
      <textarea
  className="w-full border p-3 rounded mb-3"
  placeholder="Address"
  value={company.address}
  onChange={(e) =>
    setCompany({
      ...company,
      address: e.target.value,
    })
  }
/>

       <input
  className="w-full border p-3 rounded mb-3"
  placeholder="Phone"
  value={company.phone}
  onChange={(e) =>
    setCompany({
      ...company,
      phone: e.target.value,
    })
  }
/>
       <input
  className="w-full border p-3 rounded mb-3"
  placeholder="Email"
  value={company.email}
  onChange={(e) =>
    setCompany({
      ...company,
      email: e.target.value,
    })
  }
/>

     <input
  className="w-full border p-3 rounded mb-3"
  placeholder="Website"
  value={company.website}
  onChange={(e) =>
    setCompany({
      ...company,
      website: e.target.value,
    })
  }
/>

       <input
  className="w-full border p-3 rounded mb-3"
  placeholder="GST Number"
  value={company.gstNumber}
  onChange={(e) =>
    setCompany({
      ...company,
      gstNumber: e.target.value,
    })
  }
/>

       <input
  className="w-full border p-3 rounded mb-3"
  placeholder="Bank Name"
  value={company.bankName}
  onChange={(e) =>
    setCompany({
      ...company,
      bankName: e.target.value,
    })
  }
/>

       <input
  className="w-full border p-3 rounded mb-3"
  placeholder="Account Number"
  value={company.accountNumber}
  onChange={(e) =>
    setCompany({
      ...company,
      accountNumber: e.target.value,
    })
  }
/>

       <input
  className="w-full border p-3 rounded mb-3"
  placeholder="IFSC Code"
  value={company.ifsc}
  onChange={(e) =>
    setCompany({
      ...company,
      ifsc: e.target.value,
    })
  }
/>
        <div className="mb-5">

<label className="font-semibold">
Company Logo
</label>

<input
type="file"
accept="image/*"
onChange={handleLogo}
className="mt-2"
/>
{company.logo && (
  <img
    src={company.logo}
    alt="Company Logo"
    className="mt-3 h-20 w-20 object-contain border rounded"
  />
)}
</div>
       <input
  className="w-full border p-3 rounded mb-5"
  placeholder="UPI ID"
  value={company.upiId}
  onChange={(e) =>
    setCompany({
      ...company,
      upiId: e.target.value,
    })
  }
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