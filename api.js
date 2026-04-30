// src/api/index.js

const API_BASE = import.meta.env.VITE_API_URL || "https://backend.comdata.in";

// 🔗 Build full URL safely
function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

// 🌐 Common request handler
async function request(path, options = {}) {
  const { method = "GET", body = null, headers = {}, signal } = options;

  const url = buildUrl(path);

  const opts = {
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    },
    signal,
  };

  // 📦 Handle body
  if (body !== null) {
    if (body instanceof FormData) {
      opts.body = body; // let browser set headers
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkError) {
    throw new Error("Network error: Unable to connect to server");
  }

  // 🧠 Parse response safely
  let data;
  const text = await res.text();

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  // ❌ Handle API errors
  if (!res.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}



export async function registerStudent(payload) {
  return request("/api/students/register", {
    method: "POST",
    body: payload,
  });
}

export async function loginStudent(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function getRegistrationsByEmail(email) {
  const qs = `?email=${encodeURIComponent(email)}`;
  try {
    return await request(`/api/students${qs}`, {
      method: "GET",
    });
  } catch (err) {
    console.warn("getRegistrationsByEmail failed:", err?.message || err);
    // Return an empty array as a safe fallback for callers
    return [];
  }
}

export async function fetchRegistrations() {
  return request("/api/registrations");
}

export default {
  request,
  registerStudent,
  loginStudent,
  fetchRegistrations,
};