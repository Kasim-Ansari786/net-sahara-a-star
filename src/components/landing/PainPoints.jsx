import { AlertTriangle, UserX, BookX, Bot } from "lucide-react";

const pains = [
  { icon: AlertTriangle, title: "Beyond Classroom Education", desc: "Hospitality is lived through real interactions, practical learning, and industry exposure." },
  { icon: Bot, title: "Personality Matters", desc: "Your spoken English, confidence, appearance, etiquette, and attitude shape your future." },
  { icon: UserX, title: "Learn From The Industry", desc: "Train under hospitality professionals inside a real 5-star hotel ecosystem." },
  { icon: BookX, title: "Career-Focused Selection", desc: "This is not mass admission. We identify students with potential to lead." },
];

const PainPoints = () => {
  return (
    <section className="py-20 sm:py-28 bg-section-gradient">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">FOR AMBITIOUS STUDENTS</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy mb-5">
            One Step Towards a Brighter <em className="not-italic text-gradient-gold">Future</em>?
          </h2>
          <p className="text-muted-foreground text-lg">
            The Hospitality Industry Doesn’t Just Need Degrees. It Needs Personality.

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
            <em className="not-italic text-gradient-gold">A-Star Academy — </em> By The Industry. Of The Industry. For The Industry.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
