import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import localApi from "../services/localApi";
import OptimizedImage from "../components/OptimizedImage";

export default function BudgetPlanner() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 40000 });
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  useEffect(() => {
    localApi
      .listDestinations()
      .then((items) => {
        setDestinations(items || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching destinations:", err);
        setError(err?.friendlyMessage || "Failed to load destinations");
        setDestinations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter destinations within budget range
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        const price = Number(dest.price) || 0;
        return price >= budgetRange.min && price <= budgetRange.max;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        return priceA - priceB; // Sort from lowest to highest
      });
  }, [destinations, budgetRange]);

  // Calculate total expenditure
  const totalExpenditure = useMemo(() => {
    return selectedDestinations.reduce((sum, dest) => {
      return sum + (Number(dest.price) || 0);
    }, 0);
  }, [selectedDestinations]);

  // Toggle destination selection
  const toggleDestination = (dest) => {
    setSelectedDestinations((prev) => {
      const exists = prev.find((d) => d.id === dest.id);
      if (exists) {
        return prev.filter((d) => d.id !== dest.id);
      } else {
        return [...prev, dest];
      }
    });
  };

  const isSelected = (destId) => {
    return selectedDestinations.some((d) => d.id === destId);
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Budget Planner & Expenditure Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg mb-6">
          Plan your trips within your budget range. Select destinations and track your total expenditure.
        </p>

        {/* Budget Range Selector */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Set Your Budget Range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Minimum Budget (₹)
              </label>
              <input
                type="number"
                min="0"
                value={budgetRange.min}
                onChange={(e) =>
                  setBudgetRange({ ...budgetRange, min: Number(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Maximum Budget (₹)
              </label>
              <input
                type="number"
                min="0"
                value={budgetRange.max}
                onChange={(e) =>
                  setBudgetRange({ ...budgetRange, max: Number(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Destinations Found</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {filteredDestinations.length}
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Selected</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {selectedDestinations.length}
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Expenditure</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ₹{totalExpenditure.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Budget Range</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ₹{budgetRange.min.toLocaleString()} - ₹{budgetRange.max.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Loading...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 mb-6">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredDestinations.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No destinations found in this budget range
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your budget range or check back later for new destinations.
          </p>
        </div>
      )}

      {/* Destinations Grid */}
      {!loading && !error && filteredDestinations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => {
            const selected = isSelected(dest.id);
            return (
              <article
                key={dest.id}
                className={`rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all duration-300 overflow-hidden group ${
                  selected
                    ? "border-blue-500 dark:border-blue-400 shadow-lg scale-105"
                    : "border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <OptimizedImage
                    src={dest.image}
                    alt={dest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70" />
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 font-semibold">
                    ★ {dest.rating || "N/A"}
                  </div>
                  {selected && (
                    <div className="absolute top-3 right-3 rounded-full bg-blue-500 text-white px-3 py-1 text-xs font-semibold">
                      ✓ Selected
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <span>📍</span>
                        <span className="truncate">{dest.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {dest.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {dest.description}
                    </p>
                  </div>

                  {/* Price Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{(dest.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => toggleDestination(dest)}
                      className={`flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                        selected
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {selected ? "✓ Selected" : "Select"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/view/${dest.id}`)}
                      className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Selected Destinations Summary */}
      {selectedDestinations.length > 0 && (
        <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Selected Destinations Summary
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedDestinations.length} destination{selectedDestinations.length !== 1 ? "s" : ""} selected
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Total Expenditure
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ₹{totalExpenditure.toLocaleString()}
              </div>
              {budgetRange.max > 0 && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {((totalExpenditure / budgetRange.max) * 100).toFixed(1)}% of budget used
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <div className="flex flex-wrap gap-2">
              {selectedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
                >
                  {dest.title} - ₹{(dest.price || 0).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
