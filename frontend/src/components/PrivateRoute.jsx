// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "asvittal18@gmail.com";

export default function PrivateRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();
  const location = useLocation();

  console.log("PrivateRoute check:", { user, requireAdmin });

  // 1. Not logged in -> go to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 2. If this route needs admin, check by email
  const isAdmin = user.email === ADMIN_EMAIL;

  if (requireAdmin && !isAdmin) {
    // non-admin trying to open admin page -> go home
    return <Navigate to="/" replace />;
  }

  // 3. Auth OK (and admin if needed) -> render the actual page
  return children;
}
