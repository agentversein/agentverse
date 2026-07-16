"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect } from "react";

export default function BillingPage() {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([
    {
      product: "",
      name: "",
      qty: 1,
      price: 0,
      gst: 18,
    },
  ]);
 useEffect(() => {
  loadCustomers();
  loadProducts();
}, []);

const loadCustomers = async () => {
  const res = await fetch("/api/customers");
  const data = await res.json();
  setCustomers(data);
};

const loadProducts = async () => {
  const res = await fetch("/api/products");
  const data = await res.json();
  setProducts(data);
};
  const addItem = () => {
  setItems([
    ...items,
    {
      product: "",
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
    const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("TAX INVOICE", 80, 20);

  doc.setFontSize(12);
  doc.text(`Customer: ${customer}`, 15, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 42);

  autoTable(doc, {
    startY: 50,
    head: [["Product", "Qty", "Price", "GST", "Total"]],
    body: items.map((item) => [
      item.name,
      item.qty,
      `₹${item.price}`,
      `${item.gst}%`,
      `₹${(
        item.qty *
        item.price *
        (1 + item.gst / 100)
      ).toFixed(2)}`,
    ]),
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  doc.text(`Subtotal : ₹${subtotal}`, 15, finalY);
  doc.text(`GST : ₹${gstAmount}`, 15, finalY + 8);

  doc.setFontSize(15);
  doc.text(`Grand Total : ₹${total}`, 15, finalY + 18);

  doc.save("Invoice.pdf");
};
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

     <select
  value={customer}
  onChange={(e) => setCustomer(e.target.value)}
  className="w-full border rounded-lg p-3 mb-6"
>
  <option value="">Select Customer</option>

  {customers.map((c) => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</select>

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-3 mb-4"
          >
            <select
  value={item.product}
  onChange={(e) => {
    const selected = products.find(
      (p) => p._id === e.target.value
    );

    if (!selected) return;

    const temp = [...items];

    temp[index] = {
      ...temp[index],
      product: selected._id,
      name: selected.name,
      price: Number(selected.sellingPrice),
      gst: Number(selected.gst),
    };

    setItems(temp);
  }}
  className="border rounded-lg p-2"
>
  <option value="">Select Product</option>

  {products.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
</select>
           

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
<button
  onClick={generatePDF}
  className="mt-3 ml-3 bg-red-600 text-white px-6 py-3 rounded-lg"
>
  📄 Download PDF
</button>
      </div>
    </div>
  );
}