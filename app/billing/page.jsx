"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BillingPage() {

  // Customers
  const [customers, setCustomers] = useState([]);

  const [customer, setCustomer] = useState("");

  // Products
  const [products, setProducts] = useState([]);

  // Company
  const [company, setCompany] = useState({
    name: "",
    tagline: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    gstNumber: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
    signature: "",
  });

  // Invoice Items
  const [items, setItems] = useState([
    {
      product: "",
      name: "",
      hsnCode: "",
      qty: 1,
      price: 0,
      gst: 18,
    },
  ]);

  // Selected Customer
  const selectedCustomer =
    customers.find(
      (c) => c._id === customer
    ) || null;

  // Load Data
  useEffect(() => {
    loadCustomers();
    loadProducts();
    loadCompany();
  }, []);

  // -------------------------
  // Customers
  // -------------------------

  const loadCustomers = async () => {
    try {
      const res = await fetch("/api/customers");

      const data = await res.json();

      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // Products
  // -------------------------

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");

      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // Company
  // -------------------------

  const loadCompany = async () => {
    try {

      const res =
        await fetch("/api/company");

      const data =
        await res.json();

      if (data) {
        setCompany(data);
      }

    } catch (err) {

      console.error(err);

    }
  };

  // -------------------------
  // Add Product Row
  // -------------------------

  const addItem = () => {

    setItems([
      ...items,
      {
        product: "",
        name: "",
        hsnCode: "",
        qty: 1,
        price: 0,
        gst: 18,
      },
    ]);

  };
  // -------------------------
// Totals
// -------------------------

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

// -------------------------
// Generate Invoice
// -------------------------

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

    if (!data.success) {
      alert(data.message);
      return;
    }

    generatePDF(data.invoice.invoiceNumber);

    alert(
      `✅ Invoice Created : ${data.invoice.invoiceNumber}`
    );

  } catch (err) {

    console.error(err);

    alert("Invoice creation failed");

  }
};

// -------------------------
// PDF
// -------------------------

const generatePDF = (invoiceNumber) => {

  const doc = new jsPDF();

  // Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, 210, 32, "F");

  // Logo
  if (company?.logo) {

    doc.addImage(
      company.logo,
      "PNG",
      10,
      5,
      20,
      20
    );

  }

  // Company

  doc.setTextColor(255,255,255);

  doc.setFontSize(20);

  doc.text(
    company?.name || "Company",
    35,
    14
  );

  doc.setFontSize(10);

  doc.text(
    company?.tagline || "",
    35,
    21
  );

  // Invoice Title

  doc.setFontSize(20);

  doc.text(
    "TAX INVOICE",
    145,
    18
  );

  doc.setTextColor(0,0,0);

  // Left

  doc.setFontSize(11);

  doc.text(
    `Address : ${company?.address || ""}`,
    14,
    45
  );

  doc.text(
    `Phone : ${company?.phone || ""}`,
    14,
    52
  );

  doc.text(
    `GSTIN : ${company?.gstNumber || ""}`,
    14,
    59
  );

  // Right

  doc.text(
    `Invoice : ${invoiceNumber}`,
    135,
    45
  );

  doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    135,
    52
  );

  // Customer

  doc.setFontSize(13);

  doc.text(
    "Bill To",
    14,
    73
  );

  doc.setFontSize(11);

  doc.text(
    selectedCustomer?.name || "",
    14,
    81
  );

  doc.text(
    selectedCustomer?.phone || "",
    14,
    88
  );

  doc.text(
    selectedCustomer?.address || "",
    14,
    95
  );

  // Products

  autoTable(doc, {

    startY: 105,

    head: [[
      "Product",
      "HSN",
      "Qty",
      "Rate",
      "GST",
      "Amount",
    ]],

    body: items.map((item)=>[
      item.name,
      item.hsnCode || "",
      item.qty,
      item.price,
      `${item.gst}%`,
      (
        item.qty *
        item.price *
        (1 + item.gst/100)
      ).toFixed(2)
    ]),

    theme:"grid",

    headStyles:{
      fillColor:[30,64,175]
    }

  });

  const y =
    doc.lastAutoTable.finalY + 10;

  doc.setFontSize(12);

  doc.text(
    `Subtotal : ₹${subtotal}`,
    125,
    y
  );

  doc.text(
    `GST : ₹${gstAmount}`,
    125,
    y+8
  );

  doc.setFontSize(15);

  doc.text(
    `Grand Total : ₹${total}`,
    125,
    y+18
  );

  // Footer

  doc.line(
    14,
    y+30,
    195,
    y+30
  );

  doc.setFontSize(10);

  doc.text(
    "Thank you for your business.",
    14,
    y+42
  );

  doc.text(
    "Authorized Signature",
    145,
    y+42
  );

  doc.save(
    `${invoiceNumber}.pdf`
  );

};
return (
  <div className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-7xl mx-auto">

      <div className="bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold mb-8">
          💰 Create Invoice
        </h1>

        {/* Customer */}

        <div className="mb-8">

          <label className="font-semibold">
            Customer
          </label>

          <select
            value={customer}
            onChange={(e)=>setCustomer(e.target.value)}
            className="w-full border rounded-lg p-3 mt-2"
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((c)=>(
              <option
                key={c._id}
                value={c._id}
              >
                {c.name}
              </option>
            ))}

          </select>

        </div>

        {/* Products */}

        {items.map((item,index)=>(

          <div
            key={index}
            className="grid grid-cols-5 gap-4 mb-4"
          >

            <select
              value={item.product}
              onChange={(e)=>{

                const selected=
                  products.find(
                    p=>p._id===e.target.value
                  );

                if(!selected) return;

                const temp=[...items];

                temp[index]={
                  ...temp[index],
                  product:selected._id,
                  name:selected.name,
                  hsnCode:selected.hsnCode,
                  price:Number(selected.sellingPrice),
                  gst:Number(selected.gst)
                };

                setItems(temp);

              }}
              className="border rounded-lg p-3"
            >

              <option value="">
                Select Product
              </option>

              {products.map((p)=>(
                <option
                  key={p._id}
                  value={p._id}
                >
                  {p.name}
                </option>
              ))}

            </select>

            <input
              type="number"
              placeholder="Qty"
              value={item.qty}
              onChange={(e)=>{

                const temp=[...items];

                temp[index].qty=
                  Number(e.target.value);

                setItems(temp);

              }}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e)=>{

                const temp=[...items];

                temp[index].price=
                  Number(e.target.value);

                setItems(temp);

              }}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="GST"
              value={item.gst}
              onChange={(e)=>{

                const temp=[...items];

                temp[index].gst=
                  Number(e.target.value);

                setItems(temp);

              }}
              className="border rounded-lg p-3"
            />

            <div className="flex items-center font-bold">

              ₹
              {(
                item.qty*
                item.price*
                (1+item.gst/100)
              ).toFixed(2)}

            </div>

          </div>

        ))}

        <button
          onClick={addItem}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-3"
        >
          + Add Product
        </button>

        {/* Totals */}

        <div className="mt-10 border-t pt-6">

          <div className="flex justify-between text-lg">

            <span>Subtotal</span>

            <span>
              ₹{subtotal.toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between text-lg mt-2">

            <span>GST</span>

            <span>
              ₹{gstAmount.toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between text-2xl font-bold mt-4">

            <span>Grand Total</span>

            <span>
              ₹{total.toFixed(2)}
            </span>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex gap-4 mt-8">

          <button
            onClick={generateInvoice}
            className="bg-green-600 text-white px-8 py-3 rounded-lg"
          >
            Generate Invoice
          </button>

          <button
            onClick={()=>generatePDF(
              "Preview"
            )}
            className="bg-red-600 text-white px-8 py-3 rounded-lg"
          >
            Download PDF
          </button>

        </div>

      </div>

    </div>

  </div>
);
}