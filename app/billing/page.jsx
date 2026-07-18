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
  const selectedCustomer = customers.find(
  (c) => c._id === customer
);
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
   
    const data = await res.json();

    if (data.success) {
      generatePDF();
      alert(`✅ Invoice Created: ${data.invoice.invoiceNumber}`);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Invoice creation failed");
  }
};
const generatePDF = () => {
  const doc = new jsPDF();

  // Company Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("VIRENDER ENTERPRISES", 14, 15);

  doc.setFontSize(10);
  doc.text("Kitchenware Wholesaler", 14, 22);

  doc.setTextColor(0, 0, 0);

  // Invoice Title
  doc.setFontSize(20);
  doc.text("TAX INVOICE", 145, 20);

  // Company Details
  doc.setFontSize(11);

  doc.text("Address : Ludhiana, Punjab", 14, 42);
  doc.text("Phone : +91 XXXXXXXXXX", 14, 49);
  doc.text("GSTIN : XXXXXXXX", 14, 56);
  const invoiceNo =
  "INV-" + Date.now().toString().slice(-6);

doc.text(
  `Invoice No : ${invoiceNo}`,
  14,
  63
);

  // Customer Details
  doc.setFontSize(12);

  doc.text(
  `Customer : ${selectedCustomer?.name || ""}`,
  120,
  42
);

doc.text(
  `Phone : ${selectedCustomer?.phone || ""}`,
  120,
  49
);

doc.text(
  `GST : ${selectedCustomer?.gst || ""}`,
  120,
  56
);

doc.text(
  `Address : ${selectedCustomer?.address || ""}`,
  120,
  63
);
  doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    120,
    49
  );

  autoTable(doc, {
    startY: 65,

    head: [[
  "Product",
  "HSN",
  "Qty",
  "Rate",
  "GST",
  "Amount",
]],

   body: items.map((item) => [
  item.name,
  item.hsnCode || "",
  item.qty,
  `₹${item.price}`,
  `${item.gst}%`,
  `₹${(
    item.qty *
    item.price *
    (1 + item.gst / 100)
  ).toFixed(2)}`,
]),

    theme: "grid",

    headStyles: {
      fillColor: [30, 64, 175],
    },
  });

  const y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(12);

  doc.text(`Subtotal : ₹${subtotal}`, 140, y);

  doc.text(`GST : ₹${gstAmount}`, 140, y + 8);

  doc.setFontSize(15);

  doc.text(`Grand Total : ₹${total}`, 140, y + 18);

  doc.line(14, y + 35, 195, y + 35);

  doc.setFontSize(11);

  doc.text(
    "Thank you for your business!",
    14,
    y + 45
  );

  doc.text(
    "Authorized Signature",
    145,
    y + 45
  );

  doc.save("Invoice.pdf");
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