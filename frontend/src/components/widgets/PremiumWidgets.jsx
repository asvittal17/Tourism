import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageCarousel from "../ImageCarousel";
import OptimizedImage from "../OptimizedImage";
import {
  trendingDestinations,
  reviewHighlights,
  festivalCalendar,
  aiSuggestions,
  itineraryTimeline,
  galleryPhotos,
  distanceCities,
} from "../../data/premiumWidgets";

const weatherTemplates = {
  Bali: [
    { day: "Today", high: 30, low: 24, icon: "☀️" },
    { day: "Thu", high: 29, low: 23, icon: "🌤️" },
    { day: "Fri", high: 28, low: 22, icon: "🌦️" },
  ],
  Kyoto: [
    { day: "Today", high: 18, low: 10, icon: "⛅" },
    { day: "Thu", high: 20, low: 11, icon: "🌤️" },
    { day: "Fri", high: 17, low: 9, icon: "🌧️" },
  ],
  "Cape Town": [
    { day: "Today", high: 24, low: 16, icon: "🌤️" },
    { day: "Thu", high: 23, low: 17, icon: "💨" },
    { day: "Fri", high: 22, low: 15, icon: "☀️" },
  ],
};

const currencyRates = {
  USD: 1,
  EUR: 0.92,
  INR: 83.1,
  JPY: 147.5,
  AUD: 1.5,
};

function haversineDistance(a, b) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

export default function PremiumWidgets() {
  const [weatherCity, setWeatherCity] = useState("Bali");
  const [currencyInput, setCurrencyInput] = useState({ amount: 1000, from: "USD", to: "EUR" });
  const [currencyResult, setCurrencyResult] = useState(920);
  const [availabilityMonth] = useState(new Date());
  const [reviewIndex, setReviewIndex] = useState(0);
  const [activeSuggestion, setActiveSuggestion] = useState(aiSuggestions[0]);
  const [costInputs, setCostInputs] = useState({ travelers: 2, nights: 4, nightly: 180, extras: 200 });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [galleryLightbox, setGalleryLightbox] = useState(null);
  const [distanceForm, setDistanceForm] = useState({ from: "nyc", to: "lhr" });
  const [distanceResult, setDistanceResult] = useState(() =>
    haversineDistance(distanceCities[0], distanceCities[1]).toFixed(0)
  );

  const availabilityMatrix = useMemo(() => {
    const daysInMonth = new Date(availabilityMonth.getFullYear(), availabilityMonth.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      status: i % 5 === 0 ? "sold" : i % 3 === 0 ? "limited" : "open",
    }));
  }, [availabilityMonth]);

  const handleCurrencyConvert = () => {
    const { amount, from, to } = currencyInput;
    const converted = (amount * currencyRates[to]) / currencyRates[from];
    setCurrencyResult(converted.toFixed(2));
  };

  const handleCostEstimate = () => {
    const { travelers, nights, nightly, extras } = costInputs;
    const total = travelers * nights * nightly + Number(extras);
    setEstimatedCost(total.toFixed(0));
  };

  const handleDistanceCalc = () => {
    const fromCity = distanceCities.find((c) => c.code === distanceForm.from);
    const toCity = distanceCities.find((c) => c.code === distanceForm.to);
    if (fromCity && toCity) {
      setDistanceResult(haversineDistance(fromCity, toCity).toFixed(0));
    }
  };

  return (
    <section className="mt-12 space-y-10" aria-label="Premium travel widgets">
      {/* Map + Weather + Currency */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg bg-white dark:bg-slate-900">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Interactive map</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Premium Stays</h3>
            </div>
            <span className="text-xs text-blue-600 dark:text-sky-400">Live</span>
          </div>
          <iframe
            title="Luxury travel map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31517705.52647139!2d105.51658290000002!3d-24.51057755000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a432bc3260fccb1%3A0xe9465d9cb4c9829d!2sIndian%20Ocean!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="280"
            loading="lazy"
            className="border-0"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Weather insight</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{weatherCity}</h3>
            </div>
            <select
              value={weatherCity}
              onChange={(e) => setWeatherCity(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none"
            >
              {Object.keys(weatherTemplates).map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {weatherTemplates[weatherCity].map((day) => (
              <div key={day.day} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
                <div className="text-2xl">{day.icon}</div>
                <div className="text-xs uppercase tracking-wide text-slate-500 mt-1">{day.day}</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {day.high}° / {day.low}°
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Currency converter</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Real-time rates</h3>
            </div>
            <button
              className="text-xs text-blue-600 dark:text-sky-400 font-semibold"
              type="button"
              onClick={handleCurrencyConvert}
            >
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="number"
              value={currencyInput.amount}
              onChange={(e) => setCurrencyInput({ ...currencyInput, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
            />
            <div className="flex items-center gap-3">
              {["from", "to"].map((key) => (
                <select
                  key={key}
                  value={currencyInput[key]}
                  onChange={(e) => setCurrencyInput({ ...currencyInput, [key]: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
                >
                  {Object.keys(currencyRates).map((code) => (
                    <option key={code}>{code}</option>
                  ))}
                </select>
              ))}
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-sm text-slate-700 dark:text-slate-200">
              {currencyInput.amount.toLocaleString()} {currencyInput.from} ≈{" "}
              <span className="font-semibold text-blue-600 dark:text-sky-400">{currencyResult}</span>{" "}
              {currencyInput.to}
            </div>
          </div>
        </div>
      </div>

      {/* Availability + Carousel + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Booking Availability</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {availabilityMonth.toLocaleString("default", { month: "long" })}
              </h3>
            </div>
            <span className="text-xs text-slate-500">Updated hourly</span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {availabilityMatrix.slice(0, 28).map((slot) => (
              <div
                key={slot.date}
                className={`p-3 rounded-lg ${
                  slot.status === "sold"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/40"
                    : slot.status === "limited"
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40"
                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40"
                }`}
              >
                <div className="font-semibold">{slot.date}</div>
                <div className="capitalize">{slot.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Trending</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Destinations carousel</h3>
              </div>
              <span className="text-xs text-blue-600 dark:text-sky-400">Realtime</span>
            </div>
            <ImageCarousel images={trendingDestinations.map((d) => d.image)} />
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {trendingDestinations[0].highlight}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Guest love</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewIndex((prev) => (prev - 1 + reviewHighlights.length) % reviewHighlights.length)}
                  aria-label="Previous review"
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setReviewIndex((prev) => (prev + 1) % reviewHighlights.length)}
                  aria-label="Next review"
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500"
                >
                  →
                </button>
              </div>
            </div>
            <div className="relative h-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reviewHighlights[reviewIndex].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                    “{reviewHighlights[reviewIndex].comment}”
                  </p>
                  <div className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {reviewHighlights[reviewIndex].name}
                    <span className="text-xs text-slate-500"> • {reviewHighlights[reviewIndex].location}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* AI suggestions & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">AI concierge</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{activeSuggestion.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
                  setActiveSuggestion(next);
                }}
                className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs"
              >
                Shuffle
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{activeSuggestion.summary}</p>
            <ul className="text-xs text-slate-500 space-y-2">
              <li>• Smart packing checklist</li>
              <li>• Context-aware reminders</li>
              <li>• Local sim, lounge access, and more</li>
            </ul>
          </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500">Itinerary timeline</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Signature flow</h3>
          <div className="space-y-4">
            {itineraryTimeline.map((item, idx) => (
              <div key={item.day} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  {idx < itineraryTimeline.length - 1 && <div className="flex-1 w-0.5 bg-blue-200 dark:bg-slate-700"></div>}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">{item.day}</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost estimator, Events, Gallery, Distance */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Cost estimator</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Plan budget</h3>
            </div>
            <button
              type="button"
              onClick={handleCostEstimate}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold"
            >
              Calculate
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Travelers", key: "travelers", min: 1, max: 6 },
              { label: "Nights", key: "nights", min: 1, max: 14 },
              { label: "Nightly rate", key: "nightly", min: 80, max: 500 },
              { label: "Extras", key: "extras", min: 0, max: 2000 },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-slate-500 text-xs">{field.label}</label>
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={costInputs[field.key]}
                  onChange={(e) => setCostInputs({ ...costInputs, [field.key]: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4">
            <div className="text-xs uppercase tracking-widest text-slate-500">Estimated total</div>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-sky-400">
              {estimatedCost ? `₹${Number(estimatedCost).toLocaleString()}` : "—"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-4">
          <div>
            <p"className="text-xs uppercase tracking-widest text-slate-500">Upcoming</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Events & festivals</h3>
          </div>
          <ul className="space-y-3">
            {festivalCalendar.map((event) => (
              <li key={event.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{event.title}</span>
                  <span className="text-xs text-slate-500">{event.date}</span>
                </div>
                <div className="text-xs text-slate-500">{event.city}</div>
                <span className="text-xs mt-1 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                  {event.badge}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Distance calculator</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">City to city</h3>
            </div>
            <button type="button" onClick={handleDistanceCalc} className="text-xs text-blue-600 dark:text-sky-400">
              Update
            </button>
          </div>
          {["from", "to"].map((key) => (
            <select
              key={key}
              value={distanceForm[key]}
              onChange={(e) => setDistanceForm({ ...distanceForm, [key]: e.target.value })}
              className="w-full mb-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
            >
              {distanceCities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          ))}
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Great-circle distance:
            <div className="text-2xl font-bold text-blue-600 dark:text-sky-400">{distanceResult} km</div>
          </div>
        </div>
      </div>

      {/* Gallery lightbox */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Photo stories</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Gallery spotlight</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryPhotos.map((src, idx) => (
            <button
              type="button"
              key={src}
              className="rounded-xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-500/40"
              onClick={() => setGalleryLightbox(src)}
            >
              <OptimizedImage src={src} alt={`Gallery ${idx + 1}`} className="w-full h-40 object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <AnimatePresence>
          {galleryLightbox && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative max-w-3xl w-full">
                <button
                  type="button"
                  onClick={() => setGalleryLightbox(null)}
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-slate-900 font-bold shadow-lg"
                >
                  ×
                </button>
                <OptimizedImage src={galleryLightbox} alt="Gallery lightbox" className="w-full h-full rounded-2xl" loading="eager" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

