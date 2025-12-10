import React, { useState } from "react";

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(form);
      setForm({ name: "", email: "", message: "" });
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Contact Support
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Have a question or need assistance with your booking? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-blue-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-blue-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Customer Service</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Available 24/7 for urgent booking issues.
            </p>
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium">
              <span>📞</span>
              <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
            </div>
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium mt-2">
              <span>✉️</span>
              <a href="mailto:support@tourism.com" className="hover:underline">support@tourism.com</a>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-purple-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Office HQ</h3>
            <p className="text-slate-600 dark:text-slate-400">
              123 Travel Lane, Adventure City<br />
              World 54321
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-3xl mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Thanks for reaching out, <span className="font-semibold text-slate-900 dark:text-white">{submitted.name}</span>.
                We've sent a confirmation to <span className="font-semibold text-slate-900 dark:text-white">{submitted.email}</span>.
              </p>

              <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-left mb-6 border border-slate-200 dark:border-slate-700">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Your Message</div>
                <p className="text-slate-700 dark:text-slate-300 italic">"{submitted.message}"</p>
              </div>

              <button
                onClick={() => setSubmitted(null)}
                className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Send us a message</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                <textarea
                  required
                  rows="4"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


