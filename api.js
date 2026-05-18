// src/api/index.js

const API_BASE = "https://backend.comdata.in";

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, "");
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

async function request(path, options = {}) {
  const { method = "GET", body = null, headers = {}, signal } = options;

  const url = buildUrl(path);

  // ✅ Log URL in development to catch wrong endpoints
  if (import.meta.env.DEV) {
    console.log(`[API] ${method} → ${url}`);
  }

  const opts = {
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    },
    signal,
  };

  if (body !== null) {
    if (body instanceof FormData) {
      opts.body = body;
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    }
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkError) {
    // ✅ More specific network error
    throw new Error(
      `Network error: Cannot reach server at ${url}. Check if backend is running.`
    );
  }

  let data;
  const text = await res.text();

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    // ✅ Show status code in error so you know if it's 404, 401, 500 etc.
    const error = new Error(
      data?.message || `Request failed with status ${res.status}`
    );
    error.status = res.status;
    error.data = data;
    error.url = url; // ✅ Know exactly which URL failed
    console.error(`[API ERROR] ${res.status} on ${url}`, data);
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
  return request("/api/auth/login", { method: "POST", body: payload });
}

export async function getRegistrationsByEmail(email) {
  const qs = `?email=${encodeURIComponent(email)}`;
  return request(`/api/students${qs}`);
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
