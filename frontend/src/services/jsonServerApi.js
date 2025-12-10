// frontend/src/services/jsonServerApi.js
import axios from "axios";

const DEFAULT_API = "http://localhost:3001";
const API_BASE = import.meta.env.VITE_API_URL || DEFAULT_API;

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 8000, // fail fast for debugging
});

// Response interceptor: normalize success and handle network errors.
// NOTE: we don't show alerts here — let the UI show messages.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Network-level problems (server down, refused connection, DNS, CORS preflight fail)
    const isNetworkError =
      error.code === "ECONNREFUSED" ||
      error.message?.toLowerCase().includes("network error") ||
      error.code === "ERR_NETWORK";

    if (isNetworkError) {
      console.error(
        `JSON-Server unreachable at ${API_BASE}. Start it with: npm run server (or update VITE_API_URL).`
      );
      // attach friendly message for UI
      error.friendlyMessage =
        "Backend server is not reachable. Please start JSON-Server (npm run server) or check API URL.";
    } else if (error.response) {
      // API responded with a non-2xx status
      const status = error.response.status;
      const data = error.response.data;
      error.friendlyMessage =
        data?.message || data || `Server responded with status ${status}`;
    } else {
      error.friendlyMessage = error.message || "Unknown network error";
    }

    return Promise.reject(error);
  }
);

// Helper: return data or throw with friendly message
async function wrapRequest(promise) {
  try {
    const res = await promise;
    // json-server returns plain arrays/objects; just return res.data
    return res.data;
  } catch (err) {
    // rethrow with friendlyMessage available
    throw err;
  }
}

export default {
  // Low-level axios instance (if you need to customize)
  _axios: api,

  // Destinations
  listDestinations() {
    return wrapRequest(api.get("/destinations"));
  },
  getDestination(id) {
    return wrapRequest(api.get(`/destinations/${id}`));
  },
  createDestination(payload) {
    return wrapRequest(api.post("/destinations", payload));
  },
  updateDestination(id, payload) {
    // prefer PATCH for partial updates; use PUT for full replace
    return wrapRequest(api.patch(`/destinations/${id}`, payload));
  },
  deleteDestination(id) {
    return wrapRequest(api.delete(`/destinations/${id}`)).then(() => true);
  },

  // Bookings
  createBooking(booking) {
    const bookingData = { ...booking, status: booking.status || "confirmed" };
    return wrapRequest(api.post("/bookings", bookingData));
  },
  listBookings() {
    return wrapRequest(api.get("/bookings"));
  },
  updateBooking(id, payload) {
    return wrapRequest(api.patch(`/bookings/${id}`, payload));
  },
  deleteBooking(id) {
    return wrapRequest(api.delete(`/bookings/${id}`)).then(() => true);
  },

  // Users / sessions
  listUsers() {
    return wrapRequest(api.get("/users"));
  },
  listSessions() {
    return wrapRequest(api.get("/sessions"));
  },

  // Auth (simple fake auth using json-server)
  async login(email, password) {
    try {
      const users = await wrapRequest(api.get("/users"));
      const user = users.find((x) => x.email === email && x.password === password);
      if (!user) throw new Error("Invalid email or password");
      const token = `fake-token-${user.id}-${Date.now()}`;
      const session = {
        id: String(Date.now()),
        userId: user.id,
        email: user.email,
        role: user.role || "user",
        token,
        lastActive: Date.now(),
      };
      await wrapRequest(api.post("/sessions", session));
      return { id: user.id, email: user.email, role: user.role || "user", token };
    } catch (err) {
      // ensure friendly message
      err.friendlyMessage = err.friendlyMessage || err.message || "Login failed";
      throw err;
    }
  },

  async register(email, password) {
    try {
      const users = await wrapRequest(api.get("/users"));
      if (users.find((x) => x.email === email)) {
        const e = new Error("Email already registered");
        e.friendlyMessage = "Email already registered";
        throw e;
      }
      const newUser = {
        id: String(Date.now()),
        email,
        password,
        role: "user",
        createdAt: Date.now(),
      };
      await wrapRequest(api.post("/users", newUser));
      return { id: newUser.id, email: newUser.email, role: newUser.role };
    } catch (err) {
      err.friendlyMessage = err.friendlyMessage || err.message || "Registration failed";
      throw err;
    }
  },

  logout() {
    // with json-server you can optionally remove the session entry
    return Promise.resolve(true);
  },
};
