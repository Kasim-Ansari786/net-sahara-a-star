import { AlertTriangle, UserX, BookX, Bot } from "lucide-react";

const pains = [
  { icon: AlertTriangle, title: "Traditional Degrees, Unclear Jobs", desc: "Thousands graduate every year without direction or employability." },
  { icon: Bot, title: "AI Is Replacing IT & BPO Jobs", desc: "Coding, content and call-center roles are shrinking fast. Hospitality is not — it runs on people." },
  { icon: UserX, title: "Lack of Confidence", desc: "Many students never become industry ready or feel professionally prepared." },
  { icon: BookX, title: "No Job Promise, Just Hope", desc: "Most colleges offer 'placement support'. We offer a 100% job guarantee in writing." },
];

const PainPoints = () => {
  return (
    <section className="py-20 sm:py-28 bg-section-gradient">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">For Every Concerned Parent</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy mb-5">
            Worried About Your Child's <em className="not-italic text-gradient-gold">Future</em>?
          </h2>
          <p className="text-muted-foreground text-lg">
            You're not alone. Every parent today asks the same questions after their child finishes 12th.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pains.map((p) => (
            <div
              key={p.title}
              className="group bg-card border border-border rounded-xl p-7 shadow-card-soft hover:shadow-elegant hover:border-gold/40 transition-smooth"
            >
              <div className="h-12 w-12 rounded-lg bg-navy/5 group-hover:bg-gold-gradient flex items-center justify-center mb-5 transition-smooth">
                <p.icon className="h-6 w-6 text-navy group-hover:text-navy-deep transition-smooth" />
              </div>
              <h3 className="font-display text-xl text-navy mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <div className="gold-divider-thick mx-auto mb-6" />
          <p className="font-display text-2xl sm:text-3xl text-navy">
            <em className="not-italic text-gradient-gold">A-Star Academy</em> changes that.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
