import {
  ShieldCheck,
  BriefcaseBusiness,
  Bot,
  HandshakeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const points = [
  {
    icon: ShieldCheck,
    title: "Learn Inside A 5-Star Hotel",
    desc: "Train within the Hotel Sahara Star ecosystem and experience hospitality first-hand.",
  },
  {
    icon: Bot,
    title: "Industry Exposure From Day One",
    desc: "Understand real hotel operations, guest interactions, teamwork, and service standards.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Mentorship By Professionals",
    desc: "Learn directly from hospitality experts and experienced industry leaders.",
  },
  {
    icon: HandshakeIcon,
    title: "Career With Identity",
    desc: "Graduate with confidence, personality, communication skills, and practical exposure.",
  },
];

const JobGuarantee = () => {
  return (
    <section className="py-20 sm:py-28 bg-navy-deep text-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gold-gradient" />

      <div className="relative container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-xs uppercase tracking-[0.25em] text-gold mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            OUR PROMISE TO EVERY STUDENT
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
            <span className="whitespace-nowrap">
              Begin Your Hospitality Journey
            </span>
            <br />
             <span className="text-gold">Inside The Real Industry.</span>
          </h2>
          <div className="gold-divider-thick mx-auto mb-6" />
          <p className="text-ivory/80 text-lg sm:text-xl leading-relaxed">
            At A-Star Academy, you don’t prepare for the industry later — 
            <span className="text-gold"> you begin inside it from day one. </span>Learn in the environment where luxury, 
            service, professionalism, and leadership are created every single day.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {points.map((p) => (
            <div
              key={p.title}
              className="bg-navy/60 border border-gold/25 rounded-xl p-7 backdrop-blur hover:border-gold/60 hover:-translate-y-1 transition-smooth"
            >
              <div className="h-12 w-12 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold mb-5">
                <p.icon className="h-6 w-6 text-navy-deep" />
              </div>
              <h3 className="font-display text-xl text-ivory mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-ivory/70 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="gold" size="xl" className="text-base">
            <a href="#register">Claim Your Guaranteed Seat →</a>
          </Button>
          <p className="mt-4 text-xs text-ivory/50 uppercase tracking-[0.2em]">
            Conditions apply · Detailed guarantee terms shared at counselling
          </p>
        </div>
      </div>
    </section>
  );
};

export default JobGuarantee;
