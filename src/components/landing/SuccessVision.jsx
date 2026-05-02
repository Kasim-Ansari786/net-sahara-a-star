import { Mic, Hotel, CalendarCheck, Wallet } from "lucide-react";

const visions = [
  {
    icon: Mic,
    label: "Year 1 — Foundation",
    title: "Building confidence in real environments.",
    desc: "Interacting with guests, teams, and professionals from the start.",
  },
  {
    icon: Hotel,
    label: "Year 2 — Skill Development",
    title: "Working across hotel departments",
    desc: "Gaining hands-on experience in culinary, service, and operations.",
  },
  {
    icon: CalendarCheck,
    label: "Year 3 — Industry Exposure",
    title: "Taking responsibility in real scenarios",
    desc: "Understanding operations, teamwork, and service standards.",
  },
  {
    icon: Wallet,
    label: "After Graduation — Stable Job",
    title: "Earning, growing, and becoming independent",
    desc: "Take up jobs prepared for real roles with experience and confidence.",
  },
];

const SuccessVision = () => {
  return (
    <section className="py-20 sm:py-28 bg-navy-deep text-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-25 pointer-events-none" />
      <div className="relative container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
            The Future, Three Years From Now
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-5">
            Imagine Your Child{" "}
            <em className="not-italic text-gradient-gold">Three Years</em> From Now
          </h2>
          <div className="gold-divider mx-auto max-w-xs" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative pl-8 sm:pl-12 border-l-2 border-gold/30 space-y-10">
            {visions.map((v, i) => (
              <div key={v.title} className="relative">
                <div className="absolute -left-[42px] sm:-left-[58px] top-0 h-12 w-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                  <v.icon className="h-5 w-5 text-navy-deep" />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-gold/70 mb-1">
                  {v.label}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-ivory mb-2">
                  {v.title}
                </h3>
                <p className="text-ivory/70 text-base sm:text-lg max-w-xl">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessVision;