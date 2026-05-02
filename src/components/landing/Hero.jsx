import { Button } from "@/components/ui/button";
import { ChefHat, Building2, GraduationCap } from "lucide-react";
import Brand from "@/components/Brand";
import saharaAtrium from "@/assets/sahara-star-atrium.jpg.jpeg";
import heroKitchen from "@/assets/hero-kitchen.jpg";

const BROCHURE_URL =
  "https://drive.google.com/file/d/1X0WdEM7Dait-bqAgPNaarWBxcvaoSBFK/view?usp=sharing";

const Hero = () => {
  return (
    <section className="relative bg-hero-gradient text-ivory overflow-hidden">

      {/* Hero background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroKitchen}
          alt="A-Star Academy student chefs training in a professional kitchen at Sahara Star"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-transparent to-navy-deep/80" />
      </div>

      {/* Decorative gold radial */}
      <div className="absolute inset-0 bg-radial-gold opacity-40 pointer-events-none mix-blend-overlay" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      {/* Logo lockup */}
      <div className="relative container pt-6 flex items-center justify-between">
        <Brand to="/" priority />
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8 text-sm text-ivory/80">
            <a href="#why" className="hover:text-gold transition-smooth">Why A-Star</a>
            <a href="#exam" className="hover:text-gold transition-smooth">Entrance Test</a>
            <a href="#faq" className="hover:text-gold transition-smooth">FAQ</a>
          </div>
          <Button asChild variant="gold" size="sm" className="h-9">
            <a href="/login" aria-label="Login to your student dashboard">Login</a>
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="relative container py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left: copy */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-navy-deep/40 backdrop-blur text-xs uppercase tracking-[0.2em] text-gold mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-gold" />
            100% Job Guarantee · Batch 2026
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-6">
            A Career <em className="not-italic text-gradient-gold font-semibold">You</em>
            <br />
            Will Be <em className="not-italic text-gradient-gold font-semibold">Proud</em> Of.
          </h1>

          <p className="text-lg sm:text-xl text-ivory/85 max-w-xl mb-4 font-light leading-relaxed">
            Give your child a future in the global hospitality industry through{" "}
            <span className="text-gold">A-Star Academy</span>, powered by Hotel Sahara Star
            <br />
            with <span className="text-gold font-medium">100% job guarantee</span>.
          </p>

          <p className="text-base text-ivory/65 max-w-xl mb-8">
            A real career, not just a degree. Graduate with hands-on experience, professional
            confidence <span className="text-ivory/85 font-medium">and</span> a clear career path
            from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button asChild variant="gold" size="xl" className="text-base">
              <a href="#register">Register for Entrance Test →</a>
            </Button>
            <Button asChild variant="outline-ivory" size="xl">
              <a href={BROCHURE_URL} target="_blank" rel="noopener noreferrer">
                Download Syllabus
              </a>
            </Button>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ivory/80">
            {[
              "100% Job Guarantee",
              "AI-proof, future-safe career",
              "Learn inside Hotel Sahara Star",
              "Pathway to 2.3 million Hospitality Careers",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: visual stack */}
        <div className="relative animate-fade-up [animation-delay:0.2s]">
          <div className="relative aspect-[4/5] max-w-md mx-auto">

            {/* Main card */}
            <div className="absolute inset-0 rounded-2xl bg-dark-card border border-gold/20 shadow-luxury overflow-hidden">
              <img
                src={saharaAtrium}
                alt="Sahara Star luxury hotel atrium — A-Star Academy campus"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/20" />
              <div className="absolute inset-0 bg-radial-gold opacity-30 mix-blend-overlay" />

              <div className="relative h-full flex flex-col items-center justify-end p-8 text-center">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="h-16 w-16 rounded-xl bg-navy-deep/70 backdrop-blur border border-gold/30 flex items-center justify-center">
                    <ChefHat className="h-8 w-8 text-gold" />
                  </div>
                  <div className="h-16 w-16 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
                    <GraduationCap className="h-8 w-8 text-navy-deep" />
                  </div>
                  <div className="h-16 w-16 rounded-xl bg-navy-deep/70 backdrop-blur border border-gold/30 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gold" />
                  </div>
                </div>

                <div className="gold-divider-thick mx-auto mb-4" />

                <p className="font-display text-2xl text-ivory mb-1 leading-tight drop-shadow-lg">
                  From Student
                  <br />
                  to Professional
                </p>
                <p className="text-sm text-ivory/80 mb-4">Learn where hospitality lives</p>

                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gold">
                  <span>Hotel</span>
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  <span>Retail</span>
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  <span>Events</span>
                </div>
              </div>
            </div>

            {/* Floating badge — left */}
            <div className="absolute -left-4 top-10 bg-ivory text-navy-deep rounded-lg shadow-elegant px-4 py-3 text-xs hidden sm:block">
              <div className="text-elegant-grey uppercase tracking-wider text-[10px]">Powered by</div>
              <div className="font-display font-semibold">Sahara Star</div>
            </div>

            {/* Floating badge — right */}
            <div className="absolute -right-4 bottom-12 bg-gold-gradient text-navy-deep rounded-lg shadow-gold px-4 py-3 text-xs hidden sm:block">
              <div className="font-bold text-base">Day Campus</div>
              <div className="uppercase tracking-wider text-[8.6px]">Hotel Sahara Star</div>
            </div>

          </div>
        </div>

      </div>

      {/* Trust badge strip */}
      <div className="relative border-t border-gold/15 bg-navy-deep/60 backdrop-blur">
        <div className="container py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs sm:text-sm text-ivory/75 uppercase tracking-[0.2em]">
          {["Degree Programmes", "Diploma Programmes", "Certificate Programmes", "Culinary Workshops"].map(
            (t, i) => (
              <span key={t} className="flex items-center gap-3">
                <span>{t}</span>
                {i < 3 && <span className="h-1 w-1 rounded-full bg-gold/60" />}
              </span>
            )
          )}
        </div>
      </div>

    </section>
  );
};

export default Hero;