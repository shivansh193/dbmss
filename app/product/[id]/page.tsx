"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { useCart } from "../../components/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 flex justify-center items-center">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-6">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-40 h-40 object-cover rounded-lg" />
            )}
            <div>
              <h2 className="text-3xl font-bold text-blue-800">{product.name}</h2>
              <p className="text-gray-600">{product.store?.name} ({product.store?.city})</p>
              <div className="mt-2 text-lg text-purple-700 font-semibold">${product.price}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 mb-4">{product.description}</div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Category: {product.category}</span>
            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
            />
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
              onClick={() => {
                addToCart({
                  id: String(product.id || product.product_id),
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl || product.image_url,
                }, qty);
                alert('Added to cart!');
              }}
            >
              Add to Cart
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
