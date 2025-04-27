"use client";
import { useState } from "react";

export default function AddStoreForm({ onStoreAdded }: { onStoreAdded?: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [operatingRadius, setOperatingRadius] = useState(25000);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/vendor/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          bannerUrl,
          logoUrl,
          addressLine1,
          city,
          state,
          postalCode,
          country,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          operatingRadius: parseInt(String(operatingRadius)),
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Failed to add store");
        setLoading(false);
        return;
      }
      setSuccess("Store added successfully!");
      setLoading(false);
      setName("");
      setDescription("");
      setBannerUrl("");
      setLogoUrl("");
      setAddressLine1("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
      setLatitude("");
      setLongitude("");
      setOperatingRadius(25000);
      if (onStoreAdded) onStoreAdded();
    } catch (err) {
      setError("Failed to add store");
      setLoading(false);
    }
  };

  return (
    <form className="bg-white p-8 rounded-2xl shadow-2xl border border-purple-200 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-extrabold mb-4 text-purple-900 drop-shadow">Add a New Store</h2>
      {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-purple-900">Store Name</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">Description</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">Banner URL</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">Logo URL</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">Address Line 1</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">City</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={city} onChange={e => setCity(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">State</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={state} onChange={e => setState(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">Postal Code</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-purple-900">Country</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={country} onChange={e => setCountry(e.target.value)} required />
        </div>
        <div className="col-span-2 flex flex-col md:flex-row md:items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-purple-900">Latitude</label>
            <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={latitude} onChange={e => setLatitude(e.target.value)} required type="number" step="any" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-purple-900">Longitude</label>
            <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={longitude} onChange={e => setLongitude(e.target.value)} required type="number" step="any" />
          </div>
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4 md:mt-0"
            onClick={async () => {
              setGeoError("");
              setGeoLoading(true);
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setLatitude(pos.coords.latitude.toString());
                    setLongitude(pos.coords.longitude.toString());
                    setGeoLoading(false);
                  },
                  (err) => {
                    setGeoError("Could not get location: " + err.message);
                    setGeoLoading(false);
                  }
                );
              } else {
                setGeoError("Geolocation is not supported by this browser.");
                setGeoLoading(false);
              }
            }}
            disabled={geoLoading}
          >
            {geoLoading ? "Getting Location..." : "Use My Location"}
          </button>
        </div>
        {geoError && <div className="col-span-2 text-red-600 text-sm mt-1">{geoError}</div>}
        <div>
          <label className="block text-sm font-semibold text-purple-900">Operating Radius (meters)</label>
          <input className="w-full border border-purple-300 rounded px-3 py-2 mt-1 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" value={operatingRadius} onChange={e => setOperatingRadius(Number(e.target.value))} type="number" min={100} max={100000} />
        </div>
      </div>
      <button type="submit" className="mt-6 w-full bg-gradient-to-r from-purple-700 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-800 hover:to-blue-800 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed" disabled={loading}>
        {loading ? "Adding..." : "Add Store"}
      </button>
    </form>
  );
}
