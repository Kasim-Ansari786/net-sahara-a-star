import { Quote } from "lucide-react";

const testimonials = [
  // { quote: "My son became more confident within months. He talks like a professional now.", name: "Mrs. Anjali Sharma", role: "Parent · Mumbai" },
  // { quote: "We wanted a practical career option for our daughter. This was the best decision.", name: "Mr. Rajesh Iyer", role: "Parent · Pune" },
  // { quote: "My daughter found direction, confidence, and a career she's genuinely excited about.", name: "Mrs. Fatima Khan", role: "Parent · Hyderabad" },
];

const Testimonials = () => {
  return (
    <section className="py-20 sm:py-28 bg-section-gradient">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">
            Complete your registration and take the first step toward becoming
            part of India’s next generation of hospitality professionals
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy mb-5">
            Secure Your{" "}
            <em className="not-italic text-gradient-gold">Career Path Today</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-border rounded-xl p-8 shadow-card-soft hover:shadow-elegant hover:border-gold/40 transition-smooth relative"
            >
              <Quote className="h-8 w-8 text-gold/40 mb-4" />
              <p className="font-serif-elegant text-xl text-navy leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="gold-divider-thick mb-4" />
              <div>
                <div className="font-display text-base text-navy">{t.name}</div>
                <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-1">
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
