// src/pages/Admin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import localApi from "../services/localApi";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "asvittal18@gmail.com";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // admin check based on email
  const isAdmin = user?.email === ADMIN_EMAIL;

  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]); // contact form messages (placeholder)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // redirect if not logged in or not admin
  useEffect(() => {
    if (!user) return; // wait until auth loads

    if (!isAdmin) {
      navigate("/"); // non-admin -> home
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    async function load() {
      setErr("");
      setLoading(true);
      try {
        const [u, d, b] = await Promise.all([
          localApi.listUsers?.() ?? [],
          localApi.listDestinations?.() ?? [],
          localApi.listBookings?.() ?? [],
        ]);

        setUsers(u);
        setDestinations(d);
        setBookings(b);
        setMessages([]);
      } catch (e) {
        console.error("Admin data load failed", e);
        setErr(e?.friendlyMessage || e?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isAdmin]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalLoggedInUsers = users.filter((u) => u.lastActive).length;
    const totalDestinations = destinations.length;
    const totalBookings = bookings.length;
    const totalMessages = messages.length;

    const bookingsPerDestination = bookings.reduce((acc, b) => {
      const key = b.destinationTitle || b.destinationId || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const recentBookings = [...bookings]
      .sort((a, b) => (b.start || "").localeCompare(a.start || ""))
      .slice(0, 5);

    return {
      totalUsers,
      totalLoggedInUsers,
      totalDestinations,
      totalBookings,
      totalMessages,
      bookingsPerDestination,
      recentBookings,
    };
  }, [users, destinations, bookings, messages]);

  // while auth is loading, just show spinner
  if (!user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // if user exists but is not admin, a redirect will already have happened
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          System overview, destinations, bookings, and contact management.
        </p>
        {err && (
          <div className="mt-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-700 dark:text-red-300">
            {err}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Logged-in Users" value={stats.totalLoggedInUsers} />
            <StatCard label="Destinations" value={stats.totalDestinations} />
            <StatCard label="Bookings" value={stats.totalBookings} />
          </div>

          {/* Users */}
          <Section
            title="User Statistics"
            subtitle="Registered users and login activity."
          >
            <div className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              Logged-in users (by lastActive):{" "}
              {users
                .filter((u) => u.lastActive)
                .map((u) => u.email)
                .join(", ") || "None recorded"}
            </div>
            <Table
              headers={["Email", "Role", "Last Active"]}
              rows={users.map((u) => [
                u.email || "—",
                u.role || "user",
                u.lastActive
                  ? new Date(u.lastActive).toLocaleString()
                  : "—",
              ])}
            />
          </Section>

          {/* Destinations */}
          <Section
            title="Destination Management"
            subtitle="All destinations with details."
          >
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span>Total: {destinations.length}</span>
              <span className="text-xs">
                (Add/Edit/Delete managed in Admin tools)
              </span>
            </div>
            <Table
              headers={["Name", "Location", "Price", "Description"]}
              rows={destinations.map((d) => [
                d.title,
                d.location || d.country || "—",
                d.price ? `₹${Number(d.price).toLocaleString()}` : "—",
                d.description || "—",
              ])}
            />
          </Section>

          {/* Booking statistics */}
          <Section
            title="Booking Statistics"
            subtitle="Overview and recent bookings."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Bookings per Destination
                </h4>
                {Object.keys(stats.bookingsPerDestination).length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No bookings recorded.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {Object.entries(stats.bookingsPerDestination).map(
                      ([dest, count]) => (
                        <li
                          key={dest}
                          className="flex items-center justify-between"
                        >
                          <span>{dest}</span>
                          <span className="font-semibold">{count}</span>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Recent Bookings
                </h4>
                <Table
                  compact
                  headers={["User", "Destination", "Start", "Status"]}
                  rows={stats.recentBookings.map((b) => [
                    b.email || "—",
                    b.destinationTitle || "—",
                    b.start
                      ? new Date(b.start).toLocaleDateString()
                      : "—",
                    b.status || "confirmed",
                  ])}
                />
              </div>
            </div>
          </Section>

          {/* Contact / Mail */}
          <Section
            title="Contact / Mail Management"
            subtitle="Received messages (if any)."
          >
            <div className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              Total messages: {messages.length} (No storage endpoint found;
              showing empty list.)
            </div>
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No messages recorded.
              </p>
            ) : (
              <Table
                headers={["Name", "Email", "Subject", "Message"]}
                rows={messages.map((m) => [
                  m.name,
                  m.email,
                  m.subject,
                  m.message,
                ])}
              />
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
        {value}
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-10">
      <div className="mb-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function Table({ headers, rows, compact }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left ${compact ? "text-xs" : "text-sm"}`}>
        <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className={`${compact ? "px-3 py-2" : "px-4 py-3"} font-semibold`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className={`${
                  compact ? "px-3 py-4" : "px-4 py-5"
                } text-slate-500 dark:text-slate-400`}
              >
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`${compact ? "px-3 py-2" : "px-4 py-3"} text-slate-800 dark:text-slate-200`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
