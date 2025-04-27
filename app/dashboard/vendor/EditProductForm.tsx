"use client";
import { useState } from "react";

interface EditProductFormProps {
  product: any;
  onProductUpdated?: () => void;
  onCancel?: () => void;
}

export default function EditProductForm({ product, onProductUpdated, onCancel }: EditProductFormProps) {
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [category, setCategory] = useState(product.category || "");
  const [price, setPrice] = useState(product.price?.toString() || "");
  const [stock, setStock] = useState(product.stock?.toString() || "");
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/vendor/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          price: parseFloat(price),
          stock: parseInt(stock),
          imageUrl,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Failed to update product");
        setLoading(false);
        return;
      }
      setSuccess("Product updated successfully!");
      setLoading(false);
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      setError("Failed to update product");
      setLoading(false);
    }
  };

  return (
    <form className="bg-white p-8 rounded-2xl shadow-2xl border border-blue-100 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-extrabold mb-4 text-blue-900 drop-shadow">Edit Product</h2>
      {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-blue-900">Name</label>
          <input className="w-full border border-blue-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-900">Description</label>
          <input className="w-full border border-blue-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-900">Category</label>
          <input className="w-full border border-blue-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-900">Price</label>
          <input className="w-full border border-blue-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={price} onChange={e => setPrice(e.target.value)} required type="number" step="any" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-900">Stock</label>
          <input className="w-full border border-blue-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={stock} onChange={e => setStock(e.target.value)} required type="number" min={0} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-900">Image URL</label>
          <input className="w-full border border-blue-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button type="submit" className="mt-6 w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-800 hover:to-purple-800 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
        <button type="button" className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition-colors" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
