import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  Check,
  CreditCard,
  Download,
  GraduationCap,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Ticket,
  User as UserIcon,
  UserCheck,
} from "lucide-react";
import jsPDF from "jspdf";
import logo from "@/assets/logo.png";
import Brand from "@/components/Brand";

const EXAM_DATE = "17 May 2026";
const EXAM_TIME = "10:00 AM IST";
const EXAM_VENUE = "Sahara Star Campus, Vile Parle (E), Mumbai";
const EXAM_DATETIME_ISO = "2026-05-17T10:00:00+05:30";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reg, setReg] = useState(null);
  const [counsellor, setCounsellor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    localStorage.removeItem("dev_bypass_email");
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/login", { replace: true });
        return;
      }
      const email = sess.session.user.email ?? "";
      const { data: rows, error } = await supabase
        .from("registrations")
        .select("*")
        .ilike("email", email)
        .limit(1);
      if (cancelled) return;
      if (error) {
        toast({ title: "Could not load your dashboard", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!rows || rows.length === 0) {
        await supabase.auth.signOut();
        toast({ title: "No registration found for your email" });
        navigate("/login", { replace: true });
        return;
      }
      setReg(rows[0]);

      if (rows[0].assigned_counsellor_id) {
        const { data: c } = await supabase
          .from("counsellors")
          .select("id,name,email,phone")
          .eq("id", rows[0].assigned_counsellor_id)
          .maybeSingle();
        if (!cancelled && c) setCounsellor(c);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  const downloadHallTicket = async () => {
    if (!reg) return;
    const isPaid = reg.payment_status === "paid";
    if (!isPaid) {
      toast({
        title: "Payment pending",
        description: "Hall ticket unlocks once your ₹500 registration fee is confirmed.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const NAVY = [10, 31, 61];
    const GOLD = [196, 159, 71];
    const INK = [40, 40, 40];

    const logoDataUrl = await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = logo;
    });

    // Header band
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, W, 90, "F");
    doc.setFillColor(...GOLD);
    doc.rect(0, 90, W, 4, "F");

    if (logoDataUrl) {
      const logoH = 44;
      const logoW = logoH * (329 / 79);
      doc.addImage(logoDataUrl, "PNG", 40, 23, logoW, logoH);
    }

    const textX = logoDataUrl ? 40 + 44 * (329 / 79) + 18 : 40;
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("A-STAR ACADEMY", textX, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text("BY SAHARA STAR  •  HOSPITALITY EXCELLENCE", textX, 58);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ENTRANCE EXAM HALL TICKET", textX, 78);

    // Exam ID box
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.2);
    doc.roundedRect(40, 120, W - 80, 60, 6, 6);
    doc.setTextColor(...INK);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("EXAM ID", 56, 140);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...NAVY);
    doc.text(reg.exam_id ?? `AST-${reg.id.slice(0, 8).toUpperCase()}`, 56, 165);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text("PAYMENT", W - 200, 140);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(34, 139, 34);
    doc.text("PAID  •  ₹" + reg.payment_amount, W - 200, 162);

    // Candidate details
    let y = 220;
    const row = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...GOLD);
      doc.text(label.toUpperCase(), 40, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(...INK);
      doc.text(value || "—", 40, y + 16);
      y += 42;
    };
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...NAVY);
    doc.text("Candidate Details", 40, 200);

    row("Student Name", reg.student_name);
    row("Parent / Guardian", reg.parent_name);
    row("Mobile", reg.mobile);
    row("Email", reg.email);
    row("City", reg.city);

    // Exam details panel
    doc.setFillColor(245, 240, 224);
    doc.roundedRect(40, y, W - 80, 110, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...NAVY);
    doc.text("Exam Details", 56, y + 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(`Date: ${EXAM_DATE}`, 56, y + 50);
    doc.text(`Reporting Time: ${EXAM_TIME}`, 56, y + 70);
    doc.text(`Venue: ${EXAM_VENUE}`, 56, y + 90);

    // Footer instructions
    y += 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text("Instructions", 40, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    const instructions = [
      "• Carry a printed copy of this hall ticket on the exam day.",
      "• Bring a valid government photo ID (Aadhaar, Passport, School ID).",
      "• Reach the venue 30 minutes before reporting time.",
      "• Mobile phones and electronic devices are not permitted in the exam hall.",
      "• Dress code: Smart formals.",
    ];
    instructions.forEach((line, i) => doc.text(line, 40, y + 18 + i * 16));

    // Footer band
    doc.setFillColor(...NAVY);
    doc.rect(0, 800, W, 42, "F");
    doc.setTextColor(...GOLD);
    doc.setFontSize(9);
    doc.text("A-Star Academy by Sahara Star  •  100% Job Guarantee  •  AI-Proof Career", 40, 822);

    doc.save(`A-Star-HallTicket-${(reg.exam_id ?? reg.id.slice(0, 8)).toString()}.pdf`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-hero-gradient flex items-center justify-center text-ivory">
        <div className="animate-pulse text-sm uppercase tracking-[0.3em] text-gold">Loading your dashboard…</div>
      </main>
    );
  }
  if (!reg) return null;

  const isPaid = reg.payment_status === "paid";
  const examId = reg.exam_id ?? `AST-${reg.id.slice(0, 8).toUpperCase()}`;

  return (
    <main className="min-h-screen bg-ivory text-foreground">
      {/* Top bar */}
      <header className="bg-navy-deep text-ivory">
        <div className="container flex items-center justify-between py-4">
          <Brand to="/" subtitle="Student Dashboard" priority />
          <Button variant="outline-ivory" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1.5" /> Logout
          </Button>
        </div>
      </header>

      {/* Hero strip */}
      <section className="bg-navy text-ivory border-b-4 border-gold/60">
        <div className="container py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Welcome back</div>
            <h1 className="font-display text-3xl md:text-4xl">{reg.student_name}</h1>
            <p className="text-ivory/70 text-sm mt-1">Your seat at India's most exciting hospitality academy.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={isPaid ? "bg-emerald-500 text-white" : "bg-amber-500 text-navy-deep"}>
              {isPaid ? "Payment Confirmed" : "Payment Pending"}
            </Badge>
            <Badge variant="outline" className="border-gold text-gold">Exam ID: {examId}</Badge>
          </div>
        </div>
      </section>

      {/* Progress Tracker */}
      <ProgressTracker isPaid={isPaid} examId={examId} />

      {/* Countdown */}
      <ExamCountdown isPaid={isPaid} />

      <section className="container pt-6 pb-10 grid lg:grid-cols-3 gap-6">
        {/* Hall ticket / payment CTA */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-elegant p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold mb-2">
                <ShieldCheck className="h-3.5 w-3.5" /> Entrance Test
              </div>
              <h2 className="font-display text-2xl text-navy">National Entrance Exam</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your seat is locked. Show this hall ticket on exam day.
              </p>
            </div>
            <Button variant="gold" size="lg" onClick={downloadHallTicket}>
              <Download className="h-4 w-4 mr-2" />
              {isPaid ? "Download Hall Ticket" : "Locked"}
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl bg-gold/5 border border-gold/30 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-1">
                <CalendarDays className="h-3.5 w-3.5" /> Date
              </div>
              <div className="font-display text-lg text-navy">{EXAM_DATE}</div>
              <div className="text-xs text-muted-foreground">{EXAM_TIME}</div>
            </div>
            <div className="rounded-xl bg-gold/5 border border-gold/30 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-1">
                <MapPin className="h-3.5 w-3.5" /> Venue
              </div>
              <div className="font-display text-base text-navy leading-snug">{EXAM_VENUE}</div>
            </div>
            <div className="rounded-xl bg-gold/5 border border-gold/30 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-1">
                <GraduationCap className="h-3.5 w-3.5" /> Exam ID
              </div>
              <div className="font-display text-base text-navy break-all">{examId}</div>
            </div>
          </div>

          {!isPaid && (
            <div className="mt-6 rounded-xl bg-amber-50 border border-amber-300 p-4 text-sm text-amber-900">
              <strong>Payment pending:</strong> Pay your ₹500 registration fee to unlock your hall ticket.
              Our counsellor will share a secure payment link shortly.
            </div>
          )}
        </div>

        {/* Counsellor card */}
        <div className="bg-navy text-ivory rounded-2xl shadow-luxury p-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Your Counsellor</div>
          {counsellor ? (
            <>
              <div className="font-display text-xl">{counsellor.name}</div>
              <p className="text-ivory/60 text-xs mt-1">Personal guide for your A-Star journey.</p>
              <div className="mt-5 space-y-2 text-sm">
                {counsellor.phone && (
                  <a href={`tel:${counsellor.phone}`} className="flex items-center gap-2 hover:text-gold transition-smooth">
                    <Phone className="h-4 w-4 text-gold" /> {counsellor.phone}
                  </a>
                )}
                {counsellor.phone && (
                  <a
                    href={`https://wa.me/${counsellor.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-gold transition-smooth"
                  >
                    <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp
                  </a>
                )}
                {counsellor.email && (
                  <a href={`mailto:${counsellor.email}`} className="flex items-center gap-2 hover:text-gold transition-smooth">
                    <Mail className="h-4 w-4 text-gold" /> {counsellor.email}
                  </a>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="font-display text-lg">Assignment in progress</div>
              <p className="text-ivory/60 text-sm mt-1">
                A counsellor will be assigned to you within 24 hours. They will personally walk you through the next steps.
              </p>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-gold hover:underline text-sm"
              >
                <MessageCircle className="h-4 w-4" /> Reach our admissions desk
              </a>
            </>
          )}
        </div>

        {/* Registration details */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold mb-4">
            <UserIcon className="h-3.5 w-3.5" /> Registration Details
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <Field label="Student Name" value={reg.student_name} />
            <Field label="Parent / Guardian" value={reg.parent_name} />
            <Field label="Mobile" value={reg.mobile} />
            <Field label="WhatsApp" value={reg.whatsapp} />
            <Field label="Email" value={reg.email} />
            <Field label="City" value={reg.city} />
            <Field label="12th Status" value={reg.twelfth_status} />
            <Field label="Stream" value={reg.stream} />
            <Field label="Career Interest" value={reg.career_interest} />
            <Field label="Matters Most" value={reg.matters_most} />
          </div>
        </div>

        {/* Payment summary */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold mb-4">
            <CreditCard className="h-3.5 w-3.5" /> Payment
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={isPaid ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                {isPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-navy">₹{reg.payment_amount}</span>
            </div>
            {reg.payment_id && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs">{reg.payment_id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registered</span>
              <span>{new Date(reg.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const Field = ({ label, value }) => (
  <div>
    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    <div className="font-medium text-navy mt-0.5">{value || "—"}</div>
  </div>
);

const ProgressTracker = ({ isPaid, examId }) => {
  const examPassed = new Date() > new Date("2026-05-17T23:59:59+05:30");

  const steps = [
    {
      key: "registered",
      title: "Registered",
      desc: "Your application is submitted.",
      icon: UserCheck,
      state: "done",
    },
    {
      key: "payment",
      title: "Payment Confirmed",
      desc: isPaid ? "₹500 fee received." : "Pay ₹500 to lock your seat.",
      icon: CreditCard,
      state: isPaid ? "done" : "current",
    },
    {
      key: "ticket",
      title: "Hall Ticket Ready",
      desc: isPaid ? `Exam ID ${examId}` : "Unlocks after payment.",
      icon: Ticket,
      state: isPaid ? (examPassed ? "done" : "current") : "upcoming",
    },
    {
      key: "instructions",
      title: "Exam Instructions",
      desc: "Reporting, ID proof, dress code.",
      icon: ShieldCheck,
      state: examPassed ? "done" : isPaid ? "current" : "upcoming",
    },
  ];

  const completedCount = steps.filter((s) => s.state === "done").length;
  const progressPct = (completedCount / steps.length) * 100;

  return (
    <section className="container -mt-6 md:-mt-8 relative z-10">
      <div className="bg-card rounded-2xl border border-border shadow-luxury p-5 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">Your Journey</div>
            <h2 className="font-display text-lg md:text-xl text-navy">
              {completedCount === steps.length
                ? "All steps complete — you're ready!"
                : `Step ${completedCount + 1} of ${steps.length}`}
            </h2>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Progress</div>
            <div className="font-display text-xl text-navy">{Math.round(progressPct)}%</div>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="sm:hidden mb-5 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-gradient transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps */}
        <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-0 relative">
          <div className="hidden sm:block absolute left-0 right-0 top-5 h-0.5 bg-muted -z-0">
            <div
              className="h-full bg-gold transition-all duration-700"
              style={{ width: `${(completedCount / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isDone = step.state === "done";
            const isCurrent = step.state === "current";
            return (
              <li key={step.key} className="relative flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 sm:text-center">
                <div
                  className={[
                    "relative z-10 h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all",
                    isDone
                      ? "bg-gold border-gold text-navy-deep shadow-gold"
                      : isCurrent
                      ? "bg-card border-gold text-gold ring-4 ring-gold/20 animate-pulse-gold"
                      : "bg-card border-border text-muted-foreground",
                  ].join(" ")}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="sm:px-2">
                  <div
                    className={[
                      "font-display text-sm leading-tight",
                      isDone || isCurrent ? "text-navy" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{step.desc}</div>
                  {isCurrent && (
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                      In progress
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

const ExamCountdown = ({ isPaid }) => {
  const target = new Date(EXAM_DATETIME_ISO).getTime();

  const computeRemaining = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      done: false,
    };
  };

  const [t, setT] = useState(computeRemaining);

  useEffect(() => {
    const id = setInterval(() => setT(computeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const nextStep = t.done
    ? { label: "Exam Day", desc: "Best of luck — show your hall ticket at entry." }
    : !isPaid
    ? { label: "Hall ticket unlocks after payment", desc: "Pay ₹500 to lock your seat and reveal your hall ticket." }
    : { label: "Exam instructions go live 7 days before exam", desc: "Reporting time, ID proof checklist, dress code." };

  const Cell = ({ n, label }) => (
    <div className="flex-1 min-w-[64px]">
      <div className="bg-navy-deep text-ivory rounded-xl border border-gold/30 shadow-gold/10 shadow-inner py-3 sm:py-4 text-center">
        <div className="font-display text-2xl sm:text-4xl tabular-nums tracking-tight text-gold">
          {String(n).padStart(2, "0")}
        </div>
      </div>
      <div className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground text-center">
        {label}
      </div>
    </div>
  );

  return (
    <section className="container mt-6">
      <div className="bg-card rounded-2xl border border-border shadow-elegant p-5 md:p-7 overflow-hidden relative">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative">
          <div className="md:max-w-sm">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">Countdown</div>
            <h2 className="font-display text-lg md:text-xl text-navy">
              {t.done ? "The exam is here" : `${EXAM_DATE} • ${EXAM_TIME}`}
            </h2>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              <span className="font-semibold text-navy">Next:</span> {nextStep.label}.{" "}
              {nextStep.desc}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 md:flex-1 md:max-w-md">
            <Cell n={t.days} label="Days" />
            <Cell n={t.hours} label="Hours" />
            <Cell n={t.minutes} label="Minutes" />
            <Cell n={t.seconds} label="Seconds" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;