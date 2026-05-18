import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, IndianRupee, Monitor } from "lucide-react";

// ✅ Updated to 2026 so the countdown is live
const EXAM_DATE = new Date("2026-05-24T10:00:00+05:30");

const useCountdown = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const diff = Math.max(0, EXAM_DATE.getTime() - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return { d, h, m, s };
};

const Cell = ({ value, label }) => (
  <div className="bg-navy-deep/60 border border-gold/30 rounded-lg p-3 sm:p-4 backdrop-blur min-w-[68px] sm:min-w-[88px]">
    <div className="font-display text-3xl sm:text-5xl text-gradient-gold leading-none tabular-nums">
      {value.toString().padStart(2, "0")}
    </div>
    <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-ivory/60 mt-1">
      {label}
    </div>
  </div>
);

const details = [
  { icon: Calendar,     label: "Date",      value: "24 May 2026" },
  { icon: Monitor,      label: "Mode",      value: "Online" },
  { icon: Clock,        label: "Duration",  value: "45 minutes" },
  { icon: FileText,     label: "Questions", value: "50 MCQs" },
  { icon: IndianRupee,  label: "Fee",       value: "₹500" },
];

const EntranceTest = () => {
  const { d, h, m, s } = useCountdown();

  return (
    <section
      id="exam"
      className="py-20 sm:py-28 bg-hero-gradient text-ivory relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial-gold opacity-40 pointer-events-none" />
      <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
            National Entrance Test
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-5">
            Gateway to{" "}
            <em className="not-italic text-gradient-gold">A-Star Academy</em>
          </h2>
          <p className="text-ivory/75 text-lg">
            Admission is based on selection, potential, communication, confidence, and personality assessment.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-12">
          <Cell value={d} label="Days" />
          <Cell value={h} label="Hours" />
          <Cell value={m} label="Minutes" />
          <Cell value={s} label="Seconds" />
        </div>

        {/* Details */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {details.map((item) => (
            <div
              key={item.label}
              className="bg-navy-deep/40 border border-gold/20 rounded-lg p-4 text-center backdrop-blur"
            >
              <item.icon className="h-5 w-5 text-gold mx-auto mb-2" />
              <div className="text-[10px] uppercase tracking-[0.15em] text-ivory/60">
                {item.label}
              </div>
              <div className="font-display text-base sm:text-lg text-ivory mt-1">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild variant="gold" size="xl" className="text-base">
            <a href="#register">Secure My Seat Now →</a>
          </Button>
          <p className="text-xs text-ivory/60 mt-4 uppercase tracking-[0.2em]">
            Limited Seats • Selection Based Admissions
          </p>
        </div>
      </div>
    </section>
  );
};

export default EntranceTest;