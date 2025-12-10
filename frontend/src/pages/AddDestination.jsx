// src/pages/AddDestination.jsx
import React, { useState } from "react";
import localApi from "../services/localApi";
import { useNavigate } from "react-router-dom";

export default function AddDestination() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    image: "",
    price: "",
    rating: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    // basic validation
    if (!form.title || !form.location) {
      setErr("Please add title and location.");
      return;
    }
    setLoading(true);
    try {
      // convert numeric fields
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        rating: Number(form.rating) || 0,
      };
      await localApi.createDestination(payload);
      // success: go back to home or destinations
      navigate("/");
    } catch (error) {
      setErr(error?.message || "Failed to create destination");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">Add New Destination</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Create a new travel destination</p>

        {err && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 dark:bg-slate-700 dark:text-white transition-all duration-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
            <input 
              name="location" 
              value={form.location} 
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 dark:bg-slate-700 dark:text-white transition-all duration-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
            <input 
              name="image" 
              value={form.image} 
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..." 
              type="url"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 dark:bg-slate-700 dark:text-white transition-all duration-200" 
            />
            {form.image && (
              <div className="mt-4 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                <img 
                  src={form.image} 
                  alt="preview" 
                  className="w-full h-auto object-cover aspect-video sm:aspect-[16/9]" 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x400?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price (₹)</label>
              <input 
                name="price" 
                value={form.price} 
                onChange={handleChange}
                type="number" 
                min="0"
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 dark:bg-slate-700 dark:text-white transition-all duration-200" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating (0-5)</label>
              <input 
                name="rating" 
                value={form.rating} 
                onChange={handleChange}
                type="number" 
                step="0.1" 
                min="0" 
                max="5" 
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 dark:bg-slate-700 dark:text-white transition-all duration-200" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange}
              rows="5" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-sky-400 dark:bg-slate-700 dark:text-white transition-all duration-200 resize-none" 
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Creating..." : "Create Destination"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
