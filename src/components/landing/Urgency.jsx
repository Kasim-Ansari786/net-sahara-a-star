import { Button } from "@/components/ui/button";

const Urgency = () => {
  return (
    <section className="py-20 sm:py-28 bg-navy-deep text-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gold-gradient" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gold-gradient" />

      <div className="relative container text-center max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-5">Final Call</div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
          Seats Are <em className="not-italic text-gradient-gold">Limited.</em>
          <br />Your Job Is <em className="not-italic text-gradient-gold">Guaranteed.</em>
        </h2>
        <p className="text-ivory/75 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Don't let your child drift after 12th — or risk a career being eaten by AI.
          Choose an industry that hires humans, with a 100% job guarantee.
        </p>
        <Button asChild variant="gold" size="xl" className="text-base">
          <a href="#register">Secure Guaranteed Seat →</a>
        </Button>
        <p className="mt-5 text-xs text-ivory/50 uppercase tracking-[0.2em]">Exam Date: 17 May · Online · 45 minutes</p>
      </div>
    </section>
  );
};

export default Urgency;
