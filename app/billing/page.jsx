"use client";

import { useState } from "react";

export default function BillingPage() {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([
    {
      name: "",
      qty: 1,
      price: 0,
      gst: 18,
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        qty: 1,
        price: 0,
        gst: 18,
      },
    ]);
  };
  const generateInvoice = async () => {
  try {
    const res = await fetch("/api/invoices/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer,
        items,
        subtotal,
        gstAmount,
        grandTotal: total,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`✅ Invoice Created: ${data.invoice.invoiceNumber}`);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Invoice creation failed");
  }
};
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const gstAmount = items.reduce(
    (sum, item) =>
      sum + (item.qty * item.price * item.gst) / 100,
    0
  );

  const total = subtotal + gstAmount;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        💰 Create Invoice
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <input
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-3 mb-4"
          >
            <input
              placeholder="Product"
              value={item.name}
              onChange={(e) => {
                const temp = [...items];
                temp[index].name = e.target.value;
                setItems(temp);
              }}
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="Qty"
              value={item.qty}
              onChange={(e) => {
                const temp = [...items];
                temp[index].qty = Number(e.target.value);
                setItems(temp);
              }}
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => {
                const temp = [...items];
                temp[index].price = Number(e.target.value);
                setItems(temp);
              }}
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="GST %"
              value={item.gst}
              onChange={(e) => {
                const temp = [...items];
                temp[index].gst = Number(e.target.value);
                setItems(temp);
              }}
              className="border rounded-lg p-2"
            />
          </div>
        ))}

        <button
          onClick={addItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>

        <div className="mt-8 border-t pt-6 space-y-2">
          <h2>Subtotal : ₹{subtotal}</h2>
          <h2>GST : ₹{gstAmount}</h2>

          <h1 className="text-2xl font-bold">
            Total : ₹{total}
          </h1>
        </div>

        <button
  onClick={generateInvoice}
  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
>
  Generate Invoice
</button>
      </div>
    </div>
  );
}