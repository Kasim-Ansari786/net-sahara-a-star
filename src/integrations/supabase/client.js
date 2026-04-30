import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useMock = import.meta.env.VITE_SUPABASE_MOCK === "true";

if (!useMock) {
  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error("Missing VITE_SUPABASE_ANON_KEY");
  }
}

// DEBUG LOG (check in browser console)
console.log("Supabase URL:", supabaseUrl, "(mock enabled:", useMock, ")");

function createMockSupabase() {
  const mockDB = {
    registrations: [
      {
        id: "mock-1",
        student_name: "Mock Student",
        parent_name: "Mock Parent",
        mobile: "8657411592",
        whatsapp: "8657411592",
        email: import.meta.env.VITE_MOCK_EMAIL || "mock@example.com",
        city: "Mock City",
        twelfth_status: "passed",
        stream: "science",
        career_interest: "chef",
        matters_most: "placement",
        payment_status: "paid",
        payment_amount: 500,
        payment_id: "MOCKPAY123",
        created_at: new Date().toISOString(),
      },
    ],
    counsellors: [
      {
        id: "c1",
        name: "Mock Counsellor",
        email: "counsellor@example.com",
        phone: "8657411592",
      },
    ],
  };

  const pendingOtps = new Map();

  const from = (table) => {
    const rows = mockDB[table] || [];
    return {
      select: (cols) => ({
        ilike: (field, val) => ({
          limit: (n) => Promise.resolve({
            data: rows
              .filter((r) => {
                const v = (r[field] || "").toString().toLowerCase();
                const search = val.toString().replace(/%/g, "").toLowerCase();
                return v.includes(search);
              })
              .slice(0, n),
            error: null,
          }),
        }),
        eq: (field, val) => ({
          maybeSingle: async () => ({ data: rows.find((r) => String(r[field]) === String(val)) ?? null, error: null }),
          select: () => ({ maybeSingle: async () => ({ data: rows.find((r) => String(r[field]) === String(val)) ?? null, error: null }) }),
        }),
        maybeSingle: async () => ({ data: rows[0] ?? null, error: null }),
        single: async () => (rows.length ? { data: rows[0], error: null } : { data: null, error: new Error("Not found") }),
      }),
      insert: async (newRows) => {
        const added = newRows.map((r, idx) => ({ id: `mock-${rows.length + idx + 1}`, ...r, created_at: new Date().toISOString() }));
        rows.push(...added);
        return { data: added, error: null };
      },
      update: async (upd) => {
        rows.forEach((r) => Object.assign(r, upd));
        return { data: rows, error: null };
      },
    };
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signInWithOtp: async ({ email }) => {
        const code = "123456";
        pendingOtps.set(email, code);
        console.info(`[mock supabase] Sent OTP ${code} for ${email}`);
        return { data: { user: null, session: null }, error: null };
      },
      verifyOtp: async ({ email, token, type }) => {
        const expected = pendingOtps.get(email);
        if (token === expected) {
          const session = { user: { id: "mock-user-id", email } };
          return { data: { session }, error: null };
        }
        return { data: null, error: new Error("Invalid verification code") };
      },
      signOut: async () => ({ error: null }),
    },
    from,
  };
}

export const supabase = useMock ? createMockSupabase() : createClient(supabaseUrl, supabaseKey);