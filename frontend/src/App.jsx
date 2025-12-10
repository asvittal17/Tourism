import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddDestination from "./pages/AddDestination";
import EditDestination from "./pages/EditDestination";
import ViewDestination from "./pages/ViewDestination";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import BudgetPlanner from "./pages/BudgetPlanner";
import Support from "./pages/Support";
import About from "./pages/About";
import Destinations from "./pages/Destinations";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-grow w-full" role="main">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/view/:id" element={<ViewDestination />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/budget-planner" element={<BudgetPlanner />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />

          {/* User-protected pages */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddDestination />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditDestination />
              </PrivateRoute>
            }
          />

          {/* /booking and /booking/:id both work because of :id? */}
          <Route
            path="/booking/:id?"
            element={
              <PrivateRoute>
                <Booking />
              </PrivateRoute>
            }
          />

          <Route
            path="/booking-history"
            element={
              <PrivateRoute>
                <BookingHistory />
              </PrivateRoute>
            }
          />

          {/* Admin-only pages */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requireAdmin={true}>
                <Admin />
              </PrivateRoute>
            }
          />

          {/* If you want a separate admin list of bookings */}
          <Route
            path="/bookings"
            element={
              <PrivateRoute requireAdmin={true}>
                <BookingHistory />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
