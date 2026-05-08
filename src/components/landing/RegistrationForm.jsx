import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Lock, ShieldCheck, Sparkles, CheckCircle2, CreditCard } from "lucide-react";
import { z } from "zod";
import { registerStudent } from "../../../api";

// ─── PayU payment link ───────────────────────────────────────────────────────
const PAYU_LINK = "https://u.payu.in/PAYUMN/2raSPHLNDEcz";

const schema = z.object({
  studentName: z.string().trim().min(2, "Min 2 characters").max(100),
  parentName: z.string().trim().min(2, "Min 2 characters").max(100),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "10-digit mobile required"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "10-digit WhatsApp required"),
  email: z.string().trim().email("Invalid email").max(255),
  city: z.string().trim().min(2).max(100),
  twelfthStatus: z.string().min(1, "Required"),
  stream: z.string().min(1, "Required"),
  careerInterest: z.string().min(1, "Required"),
  mattersMost: z.string().min(1, "Required"),
});

const RegistrationForm = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  // step: "form" | "pay" | "done"
  const [step, setStep] = useState("form");
  const [registeredData, setRegisteredData] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  const fd = new FormData(e.currentTarget);

  const raw = {
    studentName: String(fd.get("studentName") ?? ""),
    parentName: String(fd.get("parentName") ?? ""),
    mobile: String(fd.get("mobile") ?? ""),
    whatsapp: String(fd.get("whatsapp") ?? ""),
    email: String(fd.get("email") ?? ""),
    city: String(fd.get("city") ?? ""),
    twelfthStatus: String(fd.get("twelfthStatus") ?? ""),
    stream: String(fd.get("stream") ?? ""),
    careerInterest: String(fd.get("careerInterest") ?? ""),
    mattersMost: String(fd.get("mattersMost") ?? ""),
  };

  const parsed = schema.safeParse(raw);

  // ❌ Validation error
  if (!parsed.success) {
    toast({
      title: "Please check your details",
      description: parsed.error.errors[0]?.message ?? "Invalid input",
      variant: "destructive",
    });
    return;
  }

  // no password fields for student registration

  setSubmitting(true);
  try {
    // Save details to backend before redirecting to payment
    const payload = {
      studentName: parsed.data.studentName,
      parentName: parsed.data.parentName,
      mobile: parsed.data.mobile,
      whatsapp: parsed.data.whatsapp,
      email: parsed.data.email,
      city: parsed.data.city,
      twelfthStatus: parsed.data.twelfthStatus,
      stream: parsed.data.stream,
      careerInterest: parsed.data.careerInterest,
      mattersMost: parsed.data.mattersMost,
    };

    const res = await registerStudent(payload);

    // backend returns { success: true, data: student }
    const saved = res?.data ?? res;
    setRegisteredData(saved);
    setStep("pay");

    toast({
      title: "Details saved",
      description: "Your details have been saved. Proceed to payment.",
    });
  } catch (err) {
    console.error("Registration save failed:", err);
    const msg = err?.data?.message || err?.message || "Unable to save registration";
    toast({ title: "Save failed", description: msg, variant: "destructive" });
  } finally {
    setSubmitting(false);
  }
};

  // Called when user clicks "I have paid" after returning from PayU
  const handlePaymentDone = () => {
    setStep("done");
    toast({
      title: "Payment received!",
      description: "Your hall ticket will be sent shortly.",
    });
  };

  // ── PAYMENT STEP ──────────────────────────────────────────────────────────
  if (step === "pay") {
    return (
      <section id="register" className="py-20 sm:py-28 bg-section-gradient">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <div className="bg-card rounded-2xl shadow-luxury border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-navy text-ivory p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gold opacity-30" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">
                      Step 2 of 2
                    </div>
                    <h3 className="font-display text-2xl">Complete Payment</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ivory/60 uppercase tracking-wider">Amount</div>
                    <div className="font-display text-3xl text-gradient-gold">₹500</div>
                  </div>
                </div>
              </div>

              <div className="p-8 text-center">
                {/* Student info summary */}
                <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/20 text-left">
                  <div className="text-xs uppercase tracking-widest text-gold mb-3">Registration Summary</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student</span>
                      <span className="font-medium text-navy">{registeredData?.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium text-navy">{registeredData?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exam Date</span>
                      <span className="font-medium text-navy">24 May 2025</span>
                    </div>
                    <div className="flex justify-between border-t border-gold/20 pt-2 mt-2">
                      <span className="text-muted-foreground">Registration Fee</span>
                      <span className="font-bold text-navy text-base">₹500</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold mb-4">
                    <CreditCard className="h-8 w-8 text-navy-deep" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">
                    Your details are saved. Click below to pay securely via PayU.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You will be redirected to PayU's secure payment page.
                  </p>
                </div>

                {/* Main PayU Button */}
                <a
                  href={PAYU_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="gold" size="xl" className="w-full text-base mb-4">
                    Pay ₹500 via PayU →
                  </Button>
                </a>

                {/* After returning from PayU */}
                <div className="mt-4 p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3">
                    ✅ Completed payment on PayU? Click below to confirm.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handlePaymentDone}
                  >
                    I Have Paid — Confirm Registration
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                    256-bit SSL
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-green-600" />
                    Secure Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── SUCCESS STEP ──────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <section id="register" className="py-20 sm:py-28 bg-section-gradient">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <div className="bg-card rounded-2xl shadow-luxury border border-border overflow-hidden">
              <div className="bg-navy text-ivory p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gold opacity-30" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Registration Complete</div>
                  <h3 className="font-display text-2xl">All Done!</h3>
                </div>
              </div>
              <div className="p-8 sm:p-12 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold mb-5">
                  <CheckCircle2 className="h-9 w-9 text-navy-deep" />
                </div>
                <h3 className="font-display text-3xl text-navy mb-3">
                  Thank you, {registeredData?.studentName}!
                </h3>
                <p className="text-muted-foreground mb-2">
                  Your registration & payment are confirmed.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  Your hall ticket will be sent to{" "}
                  <span className="text-navy font-medium">{registeredData?.email}</span>{" "}
                  via SMS, WhatsApp & Email.
                </p>
                <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 text-sm text-navy mb-8">
                  📅 <span className="font-semibold">Exam Date: 24 May 2025</span>
                  <br />
                  <span className="text-muted-foreground text-xs">Keep your hall ticket ready</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("form");
                    setRegisteredData(null);
                  }}
                >
                  Register Another Student
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── FORM STEP (default) ───────────────────────────────────────────────────
  return (
    <section id="register" className="py-20 sm:py-28 bg-section-gradient">
      <div className="container">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
          {/* Left: emotional copy */}
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
              Reserve Your Seat
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy mb-5 leading-tight">
              Your Child's Future{" "}
              <em className="not-italic text-gradient-gold">Starts Here.</em>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Complete the registration in under 2 minutes. Pay ₹500 to confirm
              your seat for the National Entrance Test on{" "}
              <span className="text-navy font-semibold">24 May</span>.
            </p>

            {/* Steps indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gold-gradient flex items-center justify-center text-navy-deep text-xs font-bold shadow-gold">1</div>
                <span className="text-sm font-medium text-navy">Fill Details</span>
              </div>
              <div className="flex-1 h-px bg-gold/30" />
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold border border-gold/40">2</div>
                <span className="text-sm text-muted-foreground">Pay ₹500</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Secure Payment",
                  desc: "256-bit encrypted via PayU gateway.",
                },
                {
                  icon: Sparkles,
                  title: "Instant Confirmation",
                  desc: "Hall ticket via SMS, WhatsApp & Email.",
                },
                {
                  icon: Lock,
                  title: "Your Data is Safe",
                  desc: "We never share your details with third parties.",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border"
                >
                  <div className="h-10 w-10 rounded-lg bg-gold-gradient flex items-center justify-center shrink-0 shadow-gold">
                    <b.icon className="h-5 w-5 text-navy-deep" />
                  </div>
                  <div>
                    <div className="font-display text-base text-navy">{b.title}</div>
                    <div className="text-sm text-muted-foreground">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl shadow-luxury border border-border overflow-hidden">
              <div className="bg-navy text-ivory p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gold opacity-30" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">
                      Step 1 of 2 — Registration Form
                    </div>
                    <h3 className="font-display text-2xl">Fill Your Details</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ivory/60 uppercase tracking-wider">Total</div>
                    <div className="font-display text-3xl text-gradient-gold">₹500</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input id="studentName" name="studentName" required placeholder="Full name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="parentName">Parent Name *</Label>
                    <Input id="parentName" name="parentName" required placeholder="Full name" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="mobile">Mobile *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="10-digit WhatsApp"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required placeholder="Your city" />
                  </div>
                </div>

                {/* <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" name="password" type="password" required placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="••••••••" />
                  </div>
                </div> */}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="twelfthStatus">12th Status *</Label>
                    <Select name="twelfthStatus" required>
                      <SelectTrigger id="twelfthStatus">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appearing">Appearing</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stream">Stream *</Label>
                    <Select name="stream" required>
                      <SelectTrigger id="stream">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="commerce">Commerce</SelectItem>
                        <SelectItem value="arts">Arts / Humanities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="careerInterest">Preferred Career Interest *</Label>
                  <Select name="careerInterest" required>
                    <SelectTrigger id="careerInterest">
                      <SelectValue placeholder="Select your interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chef">Chef / Culinary</SelectItem>
                      <SelectItem value="hotel">Hotel Management</SelectItem>
                      <SelectItem value="events">Events & Banquets</SelectItem>
                      <SelectItem value="guest">Guest Relations</SelectItem>
                      <SelectItem value="luxury">Luxury Brand Careers</SelectItem>
                      <SelectItem value="undecided">Undecided</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mattersMost">What matters most to you? *</Label>
                  <Select name="mattersMost" required>
                    <SelectTrigger id="mattersMost">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placement">Placement</SelectItem>
                      <SelectItem value="confidence">Confidence</SelectItem>
                      <SelectItem value="career">Good Career</SelectItem>
                      <SelectItem value="practical">Practical Education</SelectItem>
                      <SelectItem value="prestige">Prestige College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full text-base"
                  disabled={submitting}
                >
                  {submitting ? "Saving details…" : "Next: Pay ₹500 →"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By registering you agree to our Terms & Privacy Policy. You'll
                  receive your hall ticket on SMS, WhatsApp, and Email.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
