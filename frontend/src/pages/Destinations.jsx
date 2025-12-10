import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import localApi from "../services/localApi";
import OptimizedImage from "../components/OptimizedImage";
import ScrollAnimation from "../components/ScrollAnimation";

export default function Destinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    localApi
      .listDestinations()
      .then((items) => setDestinations(items))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...destinations];

    if (term) {
      list = list.filter((d) => {
        return (
          d.title?.toLowerCase().includes(term) ||
          d.location?.toLowerCase().includes(term) ||
          d.description?.toLowerCase().includes(term)
        );
      });
    }

    if (sort === "price-low") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price-high") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [destinations, search, sort]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
          Destinations
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Browse all curated trips in one place. Search, compare prices, and book your next escape in a
          couple of clicks.
        </p>
      </header>

      <section className="mb-6 sm:mb-8 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Search destinations
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by place, experience, or keyword..."
                className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                🔍
              </span>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => navigate("/add")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all"
            >
              + Add destination
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Showing {filtered.length} of {destinations.length} destinations
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-600 font-medium">Loading...</span>
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🌍</div>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            No destinations match your search.
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try clearing the search or adjusting your filters.
          </p>
        </div>
      ) : (
        <ScrollAnimation variant="fadeInUp" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((d) => (
              <article
                key={d.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <OptimizedImage
                    src={d.image}
                    alt={d.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70" />
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 text-white text-xs px-3 py-1">
                    ★ {d.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-100">
                    <span className="truncate">📍 {d.location}</span>
                    <span className="font-semibold">
                      From ₹{(d.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {d.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {d.description}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/view/${d.id}`)}
                      className="flex-1 mr-1 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/booking/${d.id}`)}
                      className="flex-1 ml-1 inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ScrollAnimation>
      )}
    </div>
  );
}


