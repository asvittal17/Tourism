import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScrollAnimation from "../components/ScrollAnimation";
import OptimizedImage from "../components/OptimizedImage";
import { useAuth } from "../context/AuthContext";
import localApi from "../services/localApi";

/**
 * Booking page (create + edit).
 * - /booking          → create new booking
 * - /booking/:id      → edit existing booking
 */
export default function Booking() {
  const { id } = useParams(); // booking id (optional)
  const navigate = useNavigate();
  const { user } = useAuth();

  const [destinations, setDestinations] = useState([]);
  const [selectedDestId, setSelectedDestId] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const priceManuallySet = useRef(false);

  const [form, setForm] = useState({
    destinationId: "",
    destinationTitle: "",
    start: "",
    end: "",
    guests: 1,
    price: "",
    notes: "",
  });

  // Load destinations and booking (if editing)
  useEffect(() => {
    async function load() {
      try {
        const dests = await localApi.listDestinations();
        setDestinations(dests || []);

        if (id) {
          const allBookings = await localApi.listBookings();
          const found = allBookings.find((b) => String(b.id) === String(id));
          if (found) {
            setBookingData(found);
            setSelectedDestId(found.destinationId || "");
            setForm({
              destinationId: found.destinationId || "",
              destinationTitle: found.destinationTitle || "",
              start: found.start || "",
              end: found.end || "",
              guests: found.guests || 1,
              price: found.price ? String(found.price) : "",
              notes: found.notes || "",
            });
          }
        }
      } catch (e) {
        console.error("Load error", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Auto-select first destination for new booking
  useEffect(() => {
    if (!id && destinations.length && !selectedDestId) {
      const first = destinations[0];
      setSelectedDestId(first.id);
      setForm((prev) => ({
        ...prev,
        destinationId: first.id,
        destinationTitle: first.title,
      }));
    }
  }, [destinations, id, selectedDestId]);

  const selectedDestination = useMemo(
    () => destinations.find((d) => d.id === selectedDestId),
    [destinations, selectedDestId]
  );

  // Auto-calc price unless manually set
  useEffect(() => {
    if (selectedDestination && form.guests) {
      const calc = selectedDestination.price * (Number(form.guests) || 1);
      if (!form.price || !priceManuallySet.current) {
        setForm((prev) => ({ ...prev, price: String(calc) }));
      }
    }
  }, [selectedDestination, form.guests, form.price]);

  const today = new Date().toISOString().split("T")[0];

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "price") priceManuallySet.current = true;
  }

  function onSelectDestination(destId) {
    const dest = destinations.find((d) => d.id === destId);
    if (!dest) return;
    setSelectedDestId(destId);
    priceManuallySet.current = false;
    setForm((prev) => ({
      ...prev,
      destinationId: destId,
      destinationTitle: dest.title,
      price: dest.price * (Number(prev.guests) || 1),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDestination) {
      alert("Please select a destination");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        destinationId: selectedDestination.id,
        destinationTitle: selectedDestination.title,
        price: Number(form.price) || selectedDestination.price * (Number(form.guests) || 1),
        guests: Number(form.guests) || 1,
        start: form.start,
        end: form.end,
        notes: form.notes,
        email: user?.email,
        status: bookingData?.status || "confirmed",
      };

      let booking;
      if (bookingData) {
        booking = await localApi.updateBooking(bookingData.id, payload);
      } else {
        booking = await localApi.createBooking(payload);
      }

      window.dispatchEvent(new CustomEvent("bookingUpdated", { detail: booking }));
      setConfirmMsg(bookingData ? "Booking updated!" : "Booking confirmed!");

      setTimeout(() => {
        navigate("/booking-history");
      }, 800);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to save booking. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-blue-600 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollAnimation variant="fadeIn" duration={0.6}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {bookingData ? "Edit Booking" : "New Booking"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse destinations, select one, and book your trip.
          </p>
          {confirmMsg && (
            <div className="mt-2 rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-4 py-3 text-green-700 dark:text-green-300">
              {confirmMsg} Redirecting to history...
            </div>
          )}
        </div>

        {/* Destination selector */}
        <div className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Choose Destination</h2>
            <select
              value={selectedDestId}
              onChange={(e) => onSelectDestination(e.target.value)}
              className="text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} — ₹{(d.price || 0).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((d) => {
              const active = d.id === selectedDestId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDestination(d.id)}
                  className={`text-left rounded-2xl border transition-all duration-200 overflow-hidden group ${
                    active
                      ? "border-blue-500 dark:border-blue-400 shadow-lg ring-2 ring-blue-200 dark:ring-blue-500/30 scale-[1.01]"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400/70"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={d.image}
                      alt={d.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70" />
                    <div className="absolute bottom-3 left-3 right-3 text-white drop-shadow">
                      <div className="font-semibold">{d.title}</div>
                      <div className="text-xs opacity-80">₹{(d.price || 0).toLocaleString()} / person</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Travel start date
                </label>
                <input
                  type="date"
                  name="start"
                  value={form.start}
                  onChange={onChange}
                  min={today}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Travel end date
                </label>
                <input
                  type="date"
                  name="end"
                  value={form.end}
                  onChange={onChange}
                  min={form.start || today}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Travelers
                </label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  value={form.guests}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Total Price (₹)
                  {selectedDestination && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      Base: ₹{(selectedDestination.price || 0).toLocaleString()} per person
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows="3"
                placeholder="Special requests, preferences, or reminders"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : bookingData ? "Update Booking" : "Book Now"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/booking-history")}
                className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              >
                Go to Booking History
              </button>
            </div>
          </form>
        </div>
      </div>
    </ScrollAnimation>
  );
}

