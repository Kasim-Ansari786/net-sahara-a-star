import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  inputOtp: {
    textAlign: "center",
    fontSize: "24px",
    letterSpacing: "0.5em",
    fontFamily: "monospace",
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
  otpActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    fontSize: "13px",
  },
  textBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    fontSize: "13px",
    color: "#6b7280",
  },
  resendBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    fontSize: "13px",
    color: "#d4a847",
    textDecoration: "underline",
  },
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
      4000,
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
  const [step, setStep] = useState("email"); // "email" or "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpInputRef = useRef(null);

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  // Handle Resend Timer
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Focus OTP input when switching to OTP step
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

const handleSendOtp = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) throw error;

    setStep("otp");
  } catch (err) {
    console.error(err);
    alert("Cannot connect to Supabase");
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (code.length !== 6) {
      toast({
        title: "Wait",
        description: "Please enter the full 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Logic for verifying OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: code,
        type: "email",
      });

      if (error) throw error;
      if (!data.session) throw new Error("Verification failed. Try again.");

      // Check user registration
      const { data: regRows, error: regErr } = await supabase
        .from("registrations")
        .select("id, auth_user_id")
        .ilike("email", cleanEmail)
        .single();

      if (regErr || !regRows) {
        await supabase.auth.signOut();
        toast({
          title: "Not Found",
          description: "This email is not registered in our system.",
          variant: "destructive",
        });
        navigate("/#register", { replace: true });
        return;
      }

      // Link auth ID
      if (!regRows.auth_user_id) {
        await supabase
          .from("registrations")
          .update({ auth_user_id: data.session.user.id })
          .eq("id", regRows.id);
      }

      toast({ title: "Success", description: "Logging you in..." });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });
      setOtp("");
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

        <div style={styles.brand}>
          <p style={styles.brandTitle}>YourBrand</p>
          <p style={styles.brandSubtitle}>Student Portal</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardBody}>
            <div style={styles.badge}>
              <span style={{ fontSize: "14px" }}>
                {step === "email" ? "✉" : "🔑"}
              </span>
              <span>{step === "email" ? "Login" : "Verification"}</span>
            </div>

            <h1 style={styles.cardTitle}>
              {step === "email" ? "Student Login" : "Check your Inbox"}
            </h1>

            <p style={styles.cardDesc}>
              {step === "email"
                ? "Enter your registered email to receive a one-time login code."
                : `We sent a 6-digit code to ${email}`}
            </p>

            {step === "email" ? (
              <form onSubmit={handleSendOtp}>
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
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.btn,
                    ...(loading ? styles.btnDisabled : {}),
                  }}
                >
                  {loading ? "Sending..." : "Get OTP Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={styles.formGroup}>
                  <label htmlFor="otp" style={styles.label}>
                    6-digit OTP
                  </label>
                  <input
                    id="otp"
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    style={{ ...styles.input, ...styles.inputOtp }}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  style={{
                    ...styles.btn,
                    ...(loading || otp.length < 6 ? styles.btnDisabled : {}),
                  }}
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                <div style={styles.otpActions}>
                  <button
                    type="button"
                    style={styles.textBtn}
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                    }}
                  >
                    Use different email
                  </button>
                  <button
                    type="button"
                    disabled={resendIn > 0 || loading}
                    onClick={() => handleSendOtp()}
                    style={{
                      ...styles.resendBtn,
                      ...(resendIn > 0 || loading ? styles.btnDisabled : {}),
                    }}
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}

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
      </div>
    </main>
  );
};

export default Login;
