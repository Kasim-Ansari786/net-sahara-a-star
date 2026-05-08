import { Building2, Sparkles, Briefcase, ShieldCheck, Award, Globe2 } from "lucide-react";

const reasons = [
  {
    icon: Building2,
    title: "Real Industry Environment",
    desc: "Students learn in a professional hospitality atmosphere from the beginning.",
  },
  {
    icon: Sparkles,
    title: "Personality Development",
    desc: "Confidence, communication, grooming, etiquette, and leadership become part of daily learning.",
  },
  {
    icon: Briefcase,
    title: "Practical Hospitality Training",
    desc: "Students experience hospitality operations beyond textbooks and classrooms.",
  },
  {
    icon: Award,
    title: "Structured Professional Culture",
    desc: "Discipline, responsibility, punctuality, and teamwork are built into the learning journey.",
  },
  {
    icon: ShieldCheck,
    title: "Career-Oriented Learning",
    desc: "Every aspect of training is aligned with real hospitality careers and industry expectations.",
  },
  {
    icon: Globe2,
    title: "Future-Ready Industry",
    desc: "Hospitality remains one of the world’s strongest people-driven industries.",
  },
];

const WhyParents = () => {
  return (
    <section id="why" className="py-20 sm:py-28 bg-navy text-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="relative container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">WHY PARENTS TRUST US</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-5">
           A Career Environment <em className="not-italic text-gradient-gold">Built Around</em> Discipline & Growth
          </h2>
          <div className="gold-divider-thick mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group relative bg-navy-deep/50 border border-gold/20 rounded-xl p-7 backdrop-blur hover:border-gold/60 hover:-translate-y-1 transition-smooth"
            >
              <div className="absolute top-0 left-7 -translate-y-1/2 h-12 w-12 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
                <r.icon className="h-6 w-6 text-navy-deep" />
              </div>
              <h3 className="font-display text-xl mt-6 mb-2 text-ivory">{r.title}</h3>
              <p className="text-sm text-ivory/70 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyParents;
