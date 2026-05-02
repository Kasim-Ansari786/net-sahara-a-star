import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Brand from "@/components/Brand";
<<<<<<< HEAD
import { loginStudent } from "../../api";
=======
>>>>>>> 5627e73 (remove supabase, use localStorage)

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0a0f2e 0%, #1a1040 60%, #0d1a3a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily: "sans-serif",
    color: "#f5f0e8",
  },
  wrapper: { position: "relative", width: "100%", maxWidth: "440px" },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "24px",
    color: "rgba(245,240,232,0.7)",
    textDecoration: "none",
    fontSize: "14px",
  },
  brand: { marginBottom: "32px" },
  brandTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#d4a847",
    margin: 0,
    letterSpacing: "0.05em",
  },
  brandSubtitle: {
    fontSize: "12px",
    color: "rgba(245,240,232,0.6)",
    margin: "2px 0 0",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid rgba(212,168,71,0.3)",
    overflow: "hidden",
    color: "#1a1a2e",
  },
  cardBody: { padding: "32px" },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.3em",
    color: "#d4a847",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0a0f2e",
    margin: "0 0 8px",
  },
  cardDesc: { fontSize: "14px", color: "#6b7280", margin: "0 0 24px" },
  formGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    color: "#111827",
    background: "#fff",
  },
  btn: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#d4a847",
    color: "#0a0f2e",
    marginTop: "4px",
    transition: "background 0.2s",
  },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
  divider: {
    borderTop: "1px solid #e5e7eb",
    marginTop: "24px",
    paddingTop: "20px",
    textAlign: "center",
  },
  dividerText: { fontSize: "13px", color: "#6b7280", margin: 0 },
  goldLink: { color: "#d4a847", fontWeight: "500", textDecoration: "none" },
  footer: {
    fontSize: "12px",
    color: "rgba(245,240,232,0.6)",
    textAlign: "center",
    marginTop: "24px",
  },
};

// Simple Toast implementation
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const toast = ({ title, description, variant = "default" }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };
  return { toast, toasts };
};

const ToastContainer = ({ toasts }) => (
  <div
    style={{
      position: "fixed",
      top: "16px",
      right: "16px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    {toasts.map((t) => (
      <div
        key={t.id}
        style={{
          background: t.variant === "destructive" ? "#fee2e2" : "#f0fdf4",
          border: `1px solid ${t.variant === "destructive" ? "#fca5a5" : "#86efac"}`,
          borderRadius: "8px",
          padding: "12px 16px",
          maxWidth: "320px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: "600",
            fontSize: "14px",
            color: t.variant === "destructive" ? "#991b1b" : "#166534",
          }}
        >
          {t.title}
        </p>
        {t.description && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              color: t.variant === "destructive" ? "#b91c1c" : "#15803d",
            }}
          >
            {t.description}
          </p>
        )}
      </div>
    ))}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { toast, toasts } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
<<<<<<< HEAD
    //if (user) navigate("/dashboard", { replace: true });
=======
    if (user) navigate("/dashboard", { replace: true });
>>>>>>> 5627e73 (remove supabase, use localStorage)
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

=======
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

>>>>>>> 5627e73 (remove supabase, use localStorage)
    if (!cleanEmail || !cleanPassword) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
<<<<<<< HEAD
      const response = await loginStudent({
        email: cleanEmail,
        password: cleanPassword,
      });

      // Ensure backend returned a user
      if (!response || !response.user) {
        throw new Error(response?.message || "Invalid login response from server");
      }

      // Save logged in user (from backend)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
        })
      );

      toast({ title: "Success", description: "Login successful!" });

      // Redirect to student registration page
      navigate("/registerstudent", { replace: true });

    } catch (error) {
      console.error("Login Error:", error);

      // Support both Error objects thrown by our fetch wrapper and generic errors
      const msg = error?.data?.message || error?.message || "Invalid email or password";
      toast({ title: "Login Failed", description: msg, variant: "destructive" });

=======
      // Check against registrations in localStorage
      const allRegs = JSON.parse(localStorage.getItem("registrations") || "[]");
      const regRow = allRegs.find(
        (r) => r.email.trim().toLowerCase() === cleanEmail
      );

      if (!regRow) {
        toast({
          title: "Not Found",
          description: "This email is not registered in our system.",
          variant: "destructive",
        });
        navigate("/#register", { replace: true });
        return;
      }

      if (regRow.password !== cleanPassword) {
        toast({
          title: "Login Failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setPassword("");
        return;
      }

      // Save logged in user
      localStorage.setItem(
        "user",
        JSON.stringify({ email: cleanEmail, id: regRow.id })
      );

      toast({ title: "Success", description: "Logging you in..." });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });
>>>>>>> 5627e73 (remove supabase, use localStorage)
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <ToastContainer toasts={toasts} />
      <div style={styles.wrapper}>
        <Link to="/" style={styles.backLink}>
          ← Back to home
        </Link>

<<<<<<< HEAD
        <div className="mb-8">
          <Brand to="/" subtitle="Student Portal" priority />
        </div>
=======
         <div className="mb-8">
          <Brand to="/" subtitle="Student Portal" priority />
        </div>

        {/* <div style={styles.brand}>
          <p style={styles.brandTitle}>YourBrand</p>
          <p style={styles.brandSubtitle}>Student Portal</p>
        </div> */}
>>>>>>> 5627e73 (remove supabase, use localStorage)

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.badge}>
              <span style={{ fontSize: "14px" }}>✉</span>
              <span>Login</span>
            </div>

            <h1 style={styles.cardTitle}>Student Login</h1>

            <p style={styles.cardDesc}>
              Enter your registered email and password to login.
            </p>

            <form onSubmit={handleLogin}>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.btn,
                  ...(loading ? styles.btnDisabled : {}),
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div style={styles.divider}>
              <p style={styles.dividerText}>
                New student?{" "}
                <Link to="/#register" style={styles.goldLink}>
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p style={styles.footer}>
          © {new Date().getFullYear()} YourBrand. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Login;