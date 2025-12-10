import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "../components/OptimizedImage";
import { useAuth } from "../context/AuthContext";
import localApi from "../services/localApi";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    localApi
      .listDestinations()
      .then((items) => setDestinations(items.slice(0, 3)))
      .catch(() => setDestinations([]));

    localApi
      .listBookings()
      .then((items) => setBookings(items))
      .catch(() => setBookings([]));
  }, []);

  const upcomingTrips = useMemo(() => {
    const now = new Date();
    return bookings.filter((b) => {
      if (!b.start) return false;
      const start = new Date(b.start);
      return start >= now;
    }).length;
  }, [bookings]);

  const handlePrimaryCta = () => {
    if (user) navigate("/destinations");
    else navigate("/login");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
      {/* Hero glass card */}
      <section className="mt-2">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-2xl border border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-10 w-60 h-60 bg-blue-500/40 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/30 blur-3xl" />
          </div>

          <div className="relative px-5 sm:px-8 lg:px-10 py-8 sm:py-10 flex flex-col gap-6">
            <div className="max-w-3xl">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-blue-200/80 mb-2">
                Smart Tourism Management
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                Discover memorable trips —{" "}
                <span className="text-blue-200">made simple</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-200/85 max-w-xl">
                Use the navigation to explore destinations, pick a package, and check your booking history.
                Enjoy dark mode, live metrics, and a modern admin panel built for travel teams.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrimaryCta}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {user ? "Browse destinations" : "Login to start"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/booking-history")}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold text-slate-100 hover:bg-white/10 transition-all"
                >
                  View booking history
                </button>
              </div>

              <div className="flex gap-4 text-xs sm:text-sm">
                <div>
                  <div className="text-slate-300">Upcoming trips</div>
                  <div className="text-lg sm:text-xl font-bold">{upcomingTrips}</div>
                </div>
                <div className="h-10 w-px bg-white/15 self-center" />
                <div>
                  <div className="text-slate-300">Destinations live</div>
                  <div className="text-lg sm:text-xl font-bold">{destinations.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured destinations row */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            Featured destinations
          </h2>
          <button
            type="button"
            onClick={() => navigate("/destinations")}
            className="text-xs sm:text-sm text-blue-600 dark:text-sky-400 hover:underline"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {destinations.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => navigate(`/view/${d.id}`)}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950/80 dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-200 text-left overflow-hidden"
            >
              <div className="relative h-24 sm:h-28 overflow-hidden">
                <OptimizedImage
                  src={d.image}
                  alt={d.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/10 to-slate-950/80" />
              </div>
              <div className="px-4 py-3 space-y-1">
                <div className="text-sm font-semibold text-white line-clamp-1">{d.title}</div>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>From ₹{d.price?.toLocaleString()}</span>
                  <span>★ {d.rating}</span>
                </div>
              </div>
            </button>
          ))}
          {destinations.length === 0 && (
            <div className="col-span-full text-center text-sm text-slate-500 dark:text-slate-400">
              Destinations will appear here once you add them from the Admin panel.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
