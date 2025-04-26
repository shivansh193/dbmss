"use client";
import { useCart } from "./CartContext";
import { X } from "lucide-react";

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn flex flex-col">
        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition" onClick={onClose} aria-label="Close cart">
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-800 tracking-tight">Your Cart</h2>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg width="80" height="80" fill="none" viewBox="0 0 24 24" className="mb-4 text-gray-300"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M6.75 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25h6a2.25 2.25 0 0 0 2.25-2.25V6.75m-12 0V5.25A2.25 2.25 0 0 1 8.25 3h7.5a2.25 2.25 0 0 1 2.25 2.25V6.75"/></svg>
            <div className="text-gray-500 text-lg font-medium">Your cart is empty.</div>
          </div>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex items-center py-4 gap-4">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-xl border shadow-sm" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg truncate">{item.name}</div>
                    <div className="text-sm text-gray-500">${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)} x </div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, Number(e.target.value))}
                      className="w-16 border border-gray-300 rounded px-2 py-1 ml-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                    />
                  </div>
                  <button className="ml-3 px-2 py-1 text-red-500 rounded hover:bg-red-50 font-medium transition" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="font-semibold text-lg">Total:</span>
              <span className="text-2xl font-bold text-purple-700">${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg transition mb-2"
              onClick={async () => {
                await clearCart();
                onClose();
                alert('Order placed!');
              }}
            >
              Checkout & Pay
            </button>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
}
