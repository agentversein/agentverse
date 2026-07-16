"use client";

import { useState, useEffect } from "react";

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
  const [products, setProducts] = useState([]);

const loadProducts = async () => {
  const res = await fetch("/api/products");
  const data = await res.json();
  setProducts(data);
};

useEffect(() => {
  loadProducts();
}, []);
  const saveProduct = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Product Saved Successfully");
       loadProducts ();
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

<div className="bg-white rounded-xl shadow-lg p-6 mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Saved Products
  </h2>

  <table className="w-full border">
    <thead>
      <tr className="bg-gray-200">
        <th className="p-2 border">Name</th>
        <th className="p-2 border">SKU</th>
        <th className="p-2 border">Price</th>
        <th className="p-2 border">Stock</th>
      </tr>
    </thead>

    <tbody>
      {products.map((p) => (
        <tr key={p._id}>
          <td className="border p-2">{p.name}</td>
          <td className="border p-2">{p.sku}</td>
          <td className="border p-2">
            ₹{p.sellingPrice}
          </td>
          <td className="border p-2">
            {p.stock}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>
  );
}