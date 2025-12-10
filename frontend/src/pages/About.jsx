import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: "🌍",
      title: "Global Destinations",
      description: "Explore amazing destinations worldwide with curated travel packages."
    },
    {
      icon: "💰",
      title: "Budget Planning",
      description: "Plan your trips effectively with our advanced budget calculator."
    },
    {
      icon: "📅",
      title: "Easy Booking",
      description: "Book your dream trips with just a few clicks."
    },
    {
      icon: "📊",
      title: "Track History",
      description: "Keep track of all your bookings and travel history."
    },
    {
      icon: "🎯",
      title: "Smart Recommendations",
      description: "Get personalized recommendations based on your preferences."
    },
    {
      icon: "🔒",
      title: "Secure & Safe",
      description: "Your data and bookings are protected with enterprise-grade security."
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Travelers" },
    { number: "500+", label: "Destinations" },
    { number: "50+", label: "Countries" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          About Tourism Platform
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Your trusted partner in creating unforgettable travel experiences. We make travel planning simple, affordable, and enjoyable.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stat.number}
            </div>
            <div className="text-sm md:text-base text-slate-600 dark:text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-8 md:p-12 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Our Mission
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          We believe that travel should be accessible to everyone. Our mission is to simplify the travel planning process,
          making it easy for people to discover new destinations, plan their trips within budget, and create lasting memories.
          We combine cutting-edge technology with personalized service to deliver exceptional travel experiences.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Join thousands of travelers who trust us for their vacation planning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate("/budget-planner")}
                className="px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Plan Your Budget
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Team Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Built with ❤️ for Travelers
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Our team is passionate about travel and technology, working together to bring you the best travel planning experience.
        </p>
      </div>
    </div>
  );
}


