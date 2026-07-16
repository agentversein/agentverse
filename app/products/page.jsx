"use client";

import { useState } from "react";

export default function ProductsPage() {
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    hsnCode: "",
    gst: 18,
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
  });

  const saveProduct = async () => {
    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Product Saved Successfully");

        setProduct({
          name: "",
          sku: "",
          hsnCode: "",
          gst: 18,
          purchasePrice: "",
          sellingPrice: "",
          stock: "",
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        📦 Products
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct({
              ...product,
              name: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="SKU"
          value={product.sku}
          onChange={(e) =>
            setProduct({
              ...product,
              sku: e.target.value,
            })
          }
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="HSN Code"
          value={product.hsnCode}
          onChange={(e) =>
            setProduct({
              ...product,
              hsnCode: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-3"
          placeholder="GST %"
          value={product.gst}
          onChange={(e) =>
            setProduct({
              ...product,
              gst: Number(e.target.value),
            })
          }
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-3"
          placeholder="Purchase Price"
          value={product.purchasePrice}
          onChange={(e) =>
            setProduct({
              ...product,
              purchasePrice: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-3"
          placeholder="Selling Price"
          value={product.sellingPrice}
          onChange={(e) =>
            setProduct({
              ...product,
              sellingPrice: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-5"
          placeholder="Stock"
          value={product.stock}
          onChange={(e) =>
            setProduct({
              ...product,
              stock: e.target.value,
            })
          }
        />

        <button
          onClick={saveProduct}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          💾 Save Product
        </button>

      </div>
    </div>
  );
}