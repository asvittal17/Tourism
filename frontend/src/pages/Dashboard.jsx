import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import localApi from "../services/localApi";

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = React.useCallback(() => {
    localApi
      .listBookings()
      .then((all) => {
        if (!user) return setBookings([]);
        setBookings(all.filter((b) => b.email === user.email));
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      });
  }, [user]);

  useEffect(() => {
    // Fetch bookings when component mounts or user changes
    fetchBookings();
    
    // Listen for booking updates
    const handleBookingUpdate = () => {
      // Add a small delay to ensure server has processed the request
      setTimeout(() => {
        fetchBookings();
      }, 300);
    };
    
    // Refresh when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBookings();
      }
    };
    
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchBookings, user?.email]); // Also depend on user.email to refresh when user changes

  const stats = useMemo(() => {
    const now = new Date();
    let upcoming = 0;
    let completed = 0;
    let cancelled = 0;
    let totalSpent = 0;

    bookings.forEach((b) => {
      const price = Number(b.price || 0);
      totalSpent += price;
      const end = b.end ? new Date(b.end) : null;
      const status = b.status || "confirmed";

      if (status === "cancelled") cancelled += 1;
      else if (end && end < now) completed += 1;
      else upcoming += 1;
    });

    return { upcoming, completed, cancelled, totalSpent };
  }, [bookings]);

  const recent = bookings.slice(0, 5);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Welcome back, {user?.email || "traveler"}.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
          Quick snapshot of your trips and easy access to key pages.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Upcoming" value={stats.upcoming} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Cancelled" value={stats.cancelled} />
        <StatCard
          label="Total spent"
          value={stats.totalSpent ? `₹${stats.totalSpent.toLocaleString()}` : "₹0"}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Quick links
          </h2>
          <div className="space-y-2 text-sm">
            <DashboardLink to="/booking-history" label="View booking history" />
            <DashboardLink to="/destinations" label="Browse destinations" />
            <DashboardLink to="/add" label="Add new destination" />
            <DashboardLink to="/support" label="Contact support" />
            <DashboardLink to="/settings" label="Account settings" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Recent bookings
          </h2>
          {recent.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              No bookings yet. When you book a trip, it will appear here.
            </p>
          ) : (
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              {recent.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  <div>
                    <div className="font-semibold">{b.destinationTitle || "Destination"}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {b.start && b.end
                        ? `${new Date(b.start).toLocaleDateString()} - ${new Date(
                            b.end
                          ).toLocaleDateString()}`
                        : "Dates not set"}
                    </div>
                  </div>
                  <span className="text-[11px] capitalize text-slate-500 dark:text-slate-400">
                    {b.status || "confirmed"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function DashboardLink({ to, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      <span>{label}</span>
      <span className="text-slate-400">↗</span>
    </Link>
  );
}

