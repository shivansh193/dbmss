"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { useCart } from "../../components/CartContext";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function CustomerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();

  // On mount, check for ?search= param
  useEffect(() => {
    // Try to load location from localStorage
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        setLocation(JSON.parse(storedLocation));
      } catch {}
    }
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch) {
      setSearch(urlSearch);
      handleSearch(undefined, urlSearch);
    } else {
      fetch("/api/dashboard/customer")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch products");
          return res.json();
        })
        .then((data) => {
          setProducts(data.products);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, []);

  // Search suggestions
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      fetch(`/api/search?q=${encodeURIComponent(search)}&suggest=1`, { signal: controller.signal })
        .then((res) => res.ok ? res.json() : { suggestions: [] })
        .then((data) => setSuggestions(data.suggestions || []))
        .catch(() => {});
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Handle search submit
  const handleSearch = async (e?: React.FormEvent, query?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const term = typeof query === 'string' ? query : search;
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setProducts(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle nearby search
  const handleNearby = async () => {
    if (!location) return;
    setLoading(true);
    setError("");
    setSuggestions([]);
    try {
      const res = await fetch(`/api/search/nearby?lat=${location.latitude}&lng=${location.longitude}`);
      if (!res.ok) throw new Error("Nearby search failed");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-900 drop-shadow-sm">Welcome, Customer!</h1>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2 items-center">
        <input
          type="text"
          className="px-4 py-2 rounded border border-blue-300 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search for products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Search</button>
        {location && (
          <button type="button" onClick={handleNearby} className="ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Nearby</button>
        )}
      </form>
      {suggestions.length > 0 && (
        <div className="mb-4 bg-white border border-blue-100 rounded shadow-lg p-2 max-w-xs">
          <div className="font-semibold text-blue-800 mb-1">Suggestions:</div>
          <ul>
            {suggestions.map((s: any, i: number) => (
              <li
                key={s.suggestion + s.type + i}
                className="cursor-pointer hover:text-purple-700 text-gray-900 px-2 py-1 rounded transition-colors"
                onClick={() => { setSearch(s.suggestion); handleSearch(undefined, s.suggestion); }}
              >
                {s.suggestion} <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full ml-2">{capitalize(s.type)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {loading && <p className="text-blue-700 font-semibold">Loading products...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
        {products.map((product: any) => (
          <Card
            key={product.id || product.product_id}
            className="bg-white rounded-2xl shadow-2xl border border-blue-100 hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer group overflow-hidden"
          >
            <CardHeader className="p-0" onClick={() => router.push(`/product/${product.id || product.product_id}`)}>
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
                {product.imageUrl || product.image_url ? (
                  <img src={product.imageUrl || product.image_url} alt={product.name} className="object-cover w-full h-full rounded-t-2xl group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
                )}
                <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow">${product.price}</span>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <h2 className="text-xl font-extrabold text-blue-900 truncate mb-1 drop-shadow">{product.name}</h2>
              <p className="text-blue-700 text-sm mb-2 font-semibold">{product.store?.name || product.store_name} {product.store?.city && `(${product.store.city})`}</p>
              <p className="text-gray-800 text-base mb-4 line-clamp-2 min-h-[2.5em]">{product.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Stock: {product.stock}</span>
              </div>
              <button
                className="w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white py-2.5 rounded-xl hover:from-blue-800 hover:to-purple-800 font-bold text-base shadow-lg transition mt-2"
                onClick={() => {
                  addToCart({
                    id: String(product.id || product.product_id),
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl || product.image_url,
                  });
                  alert('Added to cart!');
                }}
              >
                Add to Cart
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
