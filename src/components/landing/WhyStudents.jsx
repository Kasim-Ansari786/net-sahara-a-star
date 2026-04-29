import { ChefHat, Building, Users, Calendar, Plane, Crown, Smile, Star } from "lucide-react";

const items = [
  { icon: ChefHat, label: "Chef Training" },
  { icon: Building, label: "Hotel Management" },
  { icon: Users, label: "Guest Relations" },
  { icon: Calendar, label: "Events" },
  { icon: Plane, label: "Travel Opportunities" },
  { icon: Crown, label: "Luxury Brand Careers" },
  { icon: Smile, label: "Confidence Boost" },
  { icon: Star, label: "Leadership Skills" },
];

const WhyStudents = () => {
  return (
    <section className="py-20 sm:py-28 bg-section-gradient">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">For Students</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy mb-5">
            Not Just Study. <em className="not-italic text-gradient-gold">Become Impressive.</em>
          </h2>
          <p className="text-muted-foreground text-lg">
            A modern, exciting career — with travel, prestige, lifestyle, and growth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <div
              key={it.label}
              className="group bg-card border border-border rounded-xl p-6 text-center hover:border-gold/50 hover:shadow-gold transition-smooth"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-navy/5 group-hover:bg-gold-gradient flex items-center justify-center mb-4 transition-smooth">
                <it.icon className="h-7 w-7 text-navy group-hover:text-navy-deep transition-smooth" />
              </div>
              <div className="font-display text-base sm:text-lg text-navy">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyStudents;
