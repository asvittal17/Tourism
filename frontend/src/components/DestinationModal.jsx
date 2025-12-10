import React from "react";

export default function DestinationModal({ dest, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <img src={dest.image} alt={dest.title} className="w-full h-72 object-cover" />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-bold">{dest.title}</h3>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <p className="mt-3 text-sm text-slate-700">{dest.description}</p>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Location</span>
                <span>{dest.location}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Price</span>
                <span>₹ {dest.price}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Rating</span>
                <span>★ {dest.rating}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book Now</button>
              <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
