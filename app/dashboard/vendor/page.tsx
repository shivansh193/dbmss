"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";

export default function VendorDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/vendor")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-900">Welcome, Vendor!</h1>
      {loading && <p>Loading ordered products...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order: any) => (
          <Card key={order.id} className="shadow-xl border-2 border-purple-200 hover:scale-105 transition-transform">
            <CardHeader>
              <div className="flex items-center gap-4">
                {order.product?.imageUrl && (
                  <img src={order.product.imageUrl} alt={order.product.name} className="w-20 h-20 object-cover rounded-lg" />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-purple-800">{order.product?.name}</h2>
                  <p className="text-gray-500">Order #{order.id} | Qty: {order.quantity}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2">{order.product?.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-blue-700">${order.product?.price}</span>
                <span className="text-sm text-gray-500">Customer: {order.order?.customer?.name}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
