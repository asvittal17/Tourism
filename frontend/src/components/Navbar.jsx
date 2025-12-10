// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "asvittal18@gmail.com"; // change if your admin email is different

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const onLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/destinations", label: "Destinations" },
    { to: "/booking", label: "Booking" },
    { to: "/booking-history", label: "Booking History" },
    { to: "/budget-planner", label: "Budget Planner" },
    { to: "/about", label: "About" },
    { to: "/support", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 header-glass shadow-sm">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 md:gap-2">
          <span className="text-2xl md:text-3xl drop-shadow-[0_0_18px_rgba(59,130,246,0.75)]">
            ✈️
          </span>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
            Tourism
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-btn-glass text-sm px-4 py-1.5 ${
                location.pathname === item.to ? "nav-btn-active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Admin link visible only for admin email */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-btn-glass text-sm px-4 py-1.5 ${
                location.pathname.startsWith("/admin") ? "nav-btn-active" : ""
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs uppercase">
                {user.email?.[0] ?? "U"}
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-200 max-w-[140px] truncate">
                {user.email}
              </span>
              <button
                onClick={onLogout}
                className="ml-1.5 text-xs px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:inline px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Login
            </button>
          )}

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform"
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {!user && (
            <button
              onClick={() => navigate("/register")}
              className="hidden md:inline px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:scale-105 transition-transform"
            >
              Sign up
            </button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <nav className="flex flex-col px-4 py-3 gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}

            {/* Admin (mobile) */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="py-2 px-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="py-2 px-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setOpen(false);
                  }}
                  className="py-2 px-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  Sign up
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
