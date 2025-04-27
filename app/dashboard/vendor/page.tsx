"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import AddStoreForm from "./AddStoreForm";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";

export default function VendorDashboard() {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);

  // Helper to reload stores after product edit/delete
  const reloadStores = () => {
    setLoadingStores(true);
    fetch("/api/dashboard/vendor/stores")
      .then((res) => res.json())
      .then((data) => {
        setStores(data.stores);
        // Update selectedStore if it still exists
        if (selectedStore) {
          const updated = data.stores.find((s: any) => s.id === selectedStore.id);
          setSelectedStore(updated || null);
        }
        setLoadingStores(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingStores(false);
      });
  };

  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState("");
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState<{[storeId:number]:boolean}>({});

  useEffect(() => {
    setLoadingStores(true);
    fetch("/api/dashboard/vendor/stores")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stores");
        return res.json();
      })
      .then((data) => {
        setStores(data.stores);
        setLoadingStores(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingStores(false);
      });
  }, []);

  const handleStoreClick = (store: any) => {
    setSelectedStore(store);
    // Optionally, refresh the selected store's products from the latest data
    // (if you want to always show the latest products after adding)
    // You can implement a fetch here if needed.
    setLoadingOrders(true);
    setOrders([]);
    setError("");
    fetch(`/api/dashboard/vendor/storeOrders?storeId=${store.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch store orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders);
        setLoadingOrders(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingOrders(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-900">Your Stores</h1>
      {loadingStores && <p>Loading your stores...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="mb-10 flex flex-col items-center justify-center">
        <button
          className="mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => setShowAddStoreModal(true)}
        >
          + Add New Store
        </button>
        {showAddStoreModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowAddStoreModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <AddStoreForm onStoreAdded={() => {
                setShowAddStoreModal(false);
                setLoadingStores(true);
                fetch("/api/dashboard/vendor/stores")
                  .then((res) => res.json())
                  .then((data) => {
                    setStores(data.stores);
                    setLoadingStores(false);
                  })
                  .catch((err) => {
                    setError(err.message);
                    setLoadingStores(false);
                  });
              }} />
            </div>
          </div>
        )}
        {(!loadingStores && stores.length === 0) && (
          <div className="bg-white/80 rounded-2xl shadow-xl p-8 border border-purple-100 max-w-lg w-full text-center mt-6">
            <h2 className="text-2xl font-bold mb-2 text-purple-800">No Stores Yet</h2>
            <p className="mb-6 text-gray-600 text-lg">You do not have any stores. Create your first store to start selling!</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stores.map((store: any) => (
          <div key={store.id}>
            <Card
              className={`shadow-xl border-2 border-purple-200 hover:scale-105 transition-transform cursor-pointer ${selectedStore?.id === store.id ? 'ring-2 ring-purple-600' : ''}`}
              onClick={() => handleStoreClick(store)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  {store.bannerUrl && (
                    <img src={store.bannerUrl} alt={store.name} className="w-32 h-20 object-cover rounded-lg" />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-purple-800">{store.name}</h2>
                    <p className="text-gray-500">{store.description}</p>
                    <p className="text-gray-400 text-xs">Store ID: {store.id}</p>
                    <p className="text-gray-500 mt-2 text-sm">Products: {store.products?.length ?? 0}</p>
                    <button
                      className="mt-3 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors text-sm font-semibold shadow"
                      onClick={e => {
                        e.stopPropagation();
                        setShowAddProductModal((prev:any) => ({ ...prev, [store.id]: true }));
                      }}
                    >
                      + Add Product
                    </button>
                  </div>
                </div>
              </CardHeader>
            </Card>
            {showAddProductModal[store.id] && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-xl relative">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    onClick={() => setShowAddProductModal((prev:any) => ({ ...prev, [store.id]: false }))}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <AddProductForm storeId={store.id} onProductAdded={() => {
                    setShowAddProductModal((prev:any) => ({ ...prev, [store.id]: false }));
                    setLoadingStores(true);
                    fetch("/api/dashboard/vendor/stores")
                      .then((res) => res.json())
                      .then((data) => {
                        setStores(data.stores);
                        setLoadingStores(false);
                      })
                      .catch((err) => {
                        setError(err.message);
                        setLoadingStores(false);
                      });
                  }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedStore && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-900">Products in {selectedStore.name}</h2>
          {(selectedStore.products?.length ?? 0) === 0 ? (
            <div className="text-center text-lg text-gray-500 mb-8">
              No products for this store yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {selectedStore.products.map((product: any) => (
  <Card key={product.id} className="shadow-md border border-blue-100 relative">
    <CardHeader>
      <div className="flex items-center gap-4">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
        )}
        <div>
          <h3 className="text-lg font-semibold text-blue-800">{product.name}</h3>
          <p className="text-gray-500">${product.price}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <div className="flex gap-2 mt-4">
        <button
          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm font-semibold"
          onClick={() => setEditingProduct(product)}
        >Edit</button>
      </div>
    </CardContent>
    {/* Edit Product Modal */}
    {editingProduct?.id === product.id && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-xl relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            onClick={() => setEditingProduct(null)}
            aria-label="Close"
          >×</button>
          <EditProductForm
            product={editingProduct}
            onProductUpdated={() => {
              setEditingProduct(null);
              reloadStores();
            }}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      </div>
    )}

  </Card>
))}
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4 text-purple-900">Orders for {selectedStore.name}</h2>
          {loadingOrders && <p>Loading orders...</p>}
          {orders.length === 0 && !loadingOrders && (
            <div className="text-center text-lg text-gray-500 mt-6">
              <div>No orders for this store yet.</div>
              <div className="mt-2 text-purple-600 font-semibold">Good things take time ✨</div>
            </div>
          )}
          {orders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order: any) => (
                <Card key={order.id} className="shadow-xl border-2 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {/* Show all products in this order */}
                      {order.orderDetails.map((detail: any) => (
                        detail.product?.imageUrl && (
                          <img key={detail.product.id} src={detail.product.imageUrl} alt={detail.product.name} className="w-20 h-20 object-cover rounded-lg" />
                        )
                      ))}
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800">Order #{order.id}</h3>
                        <p className="text-gray-500">Customer: {order.customer?.name}</p>
                        <p className="text-gray-500">Items: {order.orderDetails.length}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {order.orderDetails.map((detail: any) => (
                      <div key={detail.product?.id} className="mb-2">
                        <span className="font-semibold">{detail.product?.name}</span> x {detail.quantity} — <span className="text-purple-700">${detail.product?.price}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Placeholder for graphs/charts */}
          <div className="mt-10">
            <div className="bg-white rounded-xl p-6 shadow border border-purple-200">
              <h3 className="text-lg font-bold mb-2 text-purple-700">Order Analytics (Coming Soon)</h3>
              <p className="text-gray-500">Graphs and charts for order trends, revenue, etc. will be displayed here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
