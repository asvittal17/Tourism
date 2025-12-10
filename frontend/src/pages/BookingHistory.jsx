import React, { useEffect, useMemo, useState, useCallback } from "react";
import localApi from "../services/localApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function BookingHistory() {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pageSize = 10;

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const all = await localApi.listBookings();
      setBookings(all);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();

    const handleBookingUpdate = () => {
      setTimeout(() => {
        fetchBookings();
      }, 300);
    };

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
  }, [fetchBookings, user?.email]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings();
  };

  const computed = useMemo(() => {
    if (!user) return [];
    const now = new Date();
    return bookings
      .filter((b) => (isAdmin ? true : b.email === user?.email))
      .map((b) => {
        const end = b.end ? new Date(b.end) : null;
        let derivedStatus = b.status || "confirmed";
        if (derivedStatus === "confirmed" && end) {
          derivedStatus = end < now ? "completed" : "upcoming";
        }
        return { ...b, derivedStatus };
      })
      .sort((a, b) => new Date(b.start || 0) - new Date(a.start || 0)); // Sort by date desc
  }, [bookings, isAdmin, user]);

  const filtered = useMemo(() => {
    return computed.filter((b) => {
      if (status !== "all" && b.derivedStatus !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !String(b.id).toLowerCase().includes(q) &&
          !(b.destinationTitle || "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (fromDate) {
        const start = b.start ? new Date(b.start) : null;
        if (!start || start < new Date(fromDate)) return false;
      }
      if (toDate) {
        const end = b.end ? new Date(b.end) : null;
        if (!end || end > new Date(toDate)) return false;
      }
      return true;
    });
  }, [computed, status, search, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  async function cancelBooking(id) {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const updated = await localApi.updateBooking(id, { status: "cancelled" });
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      window.dispatchEvent(new CustomEvent('bookingUpdated', { detail: updated }));
    } catch (e) {
      alert("Failed to cancel booking");
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Required</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-center max-w-md">
          Please sign in to view your booking history and manage your trips.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Booking History
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {isAdmin ? "Manage all system bookings." : "Track your upcoming and past trips."}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <span className={isRefreshing ? "animate-spin" : ""}>↻</span>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="confirmed">Confirmed</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {loading && !isRefreshing ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Destination</th>
                  {isAdmin && <th className="px-6 py-4">User</th>}
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {visible.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">#{b.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{b.destinationTitle || "Unknown"}</td>
                    {isAdmin && <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{b.email || "—"}</td>}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {b.start && b.end ? (
                        <div className="flex flex-col text-xs">
                          <span>{new Date(b.start).toLocaleDateString()}</span>
                          <span className="text-slate-400">to</span>
                          <span>{new Date(b.end).toLocaleDateString()}</span>
                        </div>
                      ) : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${b.derivedStatus === "cancelled"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : b.derivedStatus === "upcoming"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : b.derivedStatus === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                      >
                        {b.derivedStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {b.price ? `₹${Number(b.price).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {b.derivedStatus !== "cancelled" && b.derivedStatus !== "completed" && (
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!visible.length && (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center">
                      <div className="text-4xl mb-3">🎫</div>
                      <p className="text-slate-900 dark:text-white font-medium">No bookings found</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Try adjusting your filters or book a new trip.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
            {visible.map((b) => (
              <div key={b.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{b.destinationTitle}</h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">#{b.id}</div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${b.derivedStatus === "cancelled"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : b.derivedStatus === "upcoming"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                  >
                    {b.derivedStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-600 dark:text-slate-400">
                    <div className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-0.5">Date</div>
                    {b.start ? new Date(b.start).toLocaleDateString() : "N/A"}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-right">
                    <div className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-0.5">Price</div>
                    {b.price ? `₹${Number(b.price).toLocaleString()}` : "—"}
                  </div>
                </div>

                {b.derivedStatus !== "cancelled" && b.derivedStatus !== "completed" && (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="w-full py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
            {!visible.length && (
              <div className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">No bookings found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
