import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink,
  Users,
  Search,
  ChevronDown,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { getRegistrationsByEmail } from "../../api";

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PAYMENT_STYLES = {
  paid: { bg: "#dcfce7", color: "#166534", label: "Paid" },
  Paid: { bg: "#dcfce7", color: "#166534", label: "Paid" },
  pending: { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
  Pending: { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
  failed: { bg: "#fee2e2", color: "#991b1b", label: "Failed" },
  Failed: { bg: "#fee2e2", color: "#991b1b", label: "Failed" },
};

const PaymentBadge = ({ status }) => {
  const s = PAYMENT_STYLES[status] ?? {
    bg: "#f3f4f6",
    color: "#374151",
    label: status,
  };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
};

const mapRegToStudent = (reg) => ({
  studentName: reg.student_name ?? reg.studentName ?? "—",
  parentName: reg.parent_name ?? reg.parentName ?? "—",
  mobile: reg.mobile ?? "—",
  whatsapp: reg.whatsapp ?? "—",
  email: reg.email ?? "—",
  city: reg.city ?? "—",
  twelfthStatus: reg.twelfth_status ?? reg.twelfthStatus ?? "—",
  stream: reg.stream ?? "—",
  careerInterest: reg.career_interest ?? reg.careerInterest ?? "—",
  mattersMost: reg.matters_most ?? reg.mattersMost ?? "—",
  payment: reg.payment_status ?? reg.payment ?? "Pending",
  examDate:
    reg.exam_date ?? reg.examDate ?? reg.created_at ?? new Date().toISOString(),
  examLink: reg.exam_link ?? reg.examLink ?? "#",
});

const COLUMNS = [
  { key: "studentName", label: "Student Name" },
  { key: "parentName", label: "Parent Name" },
  { key: "mobile", label: "Mobile" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
  { key: "twelfthStatus", label: "12th Status" },
  { key: "stream", label: "Stream" },
  { key: "careerInterest", label: "Career Interest" },
  { key: "mattersMost", label: "Matters Most" },
  { key: "payment", label: "Payment" },
  { key: "examDate", label: "Exam Date" },
  { key: "examLink", label: "Exam Link" },
];

const StudentRegistration = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [sortKey, setSortKey] = useState("studentName");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          if (user?.email) {
            const res = await getRegistrationsByEmail(user.email);
            const rows = res?.data ?? res ?? [];
            if (Array.isArray(rows) && rows.length > 0) {
              setStudents(rows.map(mapRegToStudent));
              return;
            }
            setStudents([]);
            return;
          }
        } catch (e) {
          console.error("Failed to fetch registrations:", e);
        }
      }

      const raw = localStorage.getItem("registrations");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed.map(mapRegToStudent));
            return;
          }
        } catch (_) {}
      }

      setStudents([]);
    }

    load();
  }, []);

  const visible = students
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.mobile.includes(q);
      const matchPayment =
        paymentFilter === "All" ||
        s.payment.toLowerCase() === paymentFilter.toLowerCase();
      return matchSearch && matchPayment;
    })
    .sort((a, b) => {
      const va = (a[sortKey] ?? "").toString().toLowerCase();
      const vb = (b[sortKey] ?? "").toString().toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // or your auth key
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <ArrowLeft size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  background: "#0a0f2e",
                  borderRadius: 10,
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Users size={20} color="#d4a847" />
              </div>

              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0a0f2e",
                  }}
                >
                  Student Registrations
                </h1>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                  Manage and monitor all enrollments
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div
        style={{ width: "100%", padding: "28px 32px", boxSizing: "border-box" }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: stat.bg,
                borderRadius: 12,
                padding: "16px 20px",
                border: `1px solid ${stat.color}22`,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: stat.color,
                  opacity: 0.8,
                  fontWeight: 500,
                }}
              >
                {stat.label} Students
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: "1", minWidth: 220 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                fontSize: 14,
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{
                padding: "10px 36px 10px 14px",
                fontSize: 14,
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                appearance: "none",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Failed">Failed Only</option>
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Table Container - FIXED FOR FULL WIDTH */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
                minWidth: "1200px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      onClick={() =>
                        col.key !== "examLink" && handleSort(col.key)
                      }
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#475569",
                        whiteSpace: "nowrap",
                        fontSize: 12,
                        textTransform: "uppercase",
                        cursor: col.key !== "examLink" ? "pointer" : "default",
                      }}
                    >
                      {col.label} {sortKey === col.key && (sortAsc ? "↑" : "↓")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: "#94a3b8",
                      }}
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  visible.map((s, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.1s",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {s.studentName}
                      </td>
                      <td style={{ padding: "14px 16px" }}>{s.parentName}</td>
                      <td style={{ padding: "14px 16px" }}>{s.mobile}</td>
                      <td style={{ padding: "14px 16px" }}>{s.whatsapp}</td>
                      <td style={{ padding: "14px 16px" }}>{s.email}</td>
                      <td style={{ padding: "14px 16px" }}>{s.city}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {s.twelfthStatus}
                      </td>
                      <td style={{ padding: "14px 16px" }}>{s.stream}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {s.careerInterest}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {s.mattersMost}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <PaymentBadge status={s.payment} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {formatDate(s.examDate)}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <a
                          href={s.examLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#0a0f2e",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontWeight: 500,
                          }}
                        >
                          View <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
