import { ShieldCheck, BriefcaseBusiness, Bot, HandshakeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const points = [
  {
    icon: ShieldCheck,
    title: "Career in Industries",
    desc: "Hotels, Cruise lines, Airlines, Airports, Facility Management, Retail, Events, Healthcare & Wellness.",
  },
  {
    icon: Bot,
    title: "High-demand in jobs",
    desc: "As per Govt of India, hospitality is the 3rd largest employer with 2.3 million jobs and growing.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Industry Hiring Network",
    desc: "Direct hiring pipeline with Sahara Star and partner luxury hotels, restaurants & event brands.",
  },
  {
    icon: HandshakeIcon,
    title: "Career, Not Just a Degree",
    desc: "You don't graduate hoping for a job. You graduate already placed in one.",
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
            Our Promise to Every Parent
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
            <em className="not-italic text-gradient-gold">A Career Built On</em>
            <br />
            Industry Exposure <span className="text-gold">& Skills.</span>
          </h2>
          <div className="gold-divider-thick mx-auto mb-6" />
          <p className="text-ivory/80 text-lg sm:text-xl leading-relaxed">
            Hospitality continues to grow because it is powered by people, service, and real experiences 
            — not automation. At A-Star Academy,<span className="text-gold"> our pedagogy</span> blends expert guidance
             with hands-on training, equipping students with industry-leading skills.
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
              <h3 className="font-display text-xl text-ivory mb-2">{p.title}</h3>
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
