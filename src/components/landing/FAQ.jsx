import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is the 100% job guarantee real?", a: "Yes. Every student who successfully completes the program is guaranteed a placement — committed in writing at the time of admission. Detailed terms and the formal guarantee letter are shared during counselling." },
  { q: "Will AI disrupt this career like it is disrupting IT?", a: "No. Hospitality is built on human service, hosting, warmth, and live experiences — things AI fundamentally cannot replicate. While IT, BPO and content jobs are shrinking, hotels, restaurants, luxury travel and events are hiring more people every year." },
  { q: "Is hospitality a stable career?", a: "Yes. Hospitality is a global, multi-billion-dollar industry that continues to grow rapidly across hotels, travel, events, luxury brands, and lifestyle services worldwide." },
  { q: "Is the campus safe?", a: "Absolutely. Our campus is a structured, disciplined, and professionally supervised environment that families across India trust." },
  { q: "Is the degree recognized?", a: "Yes. Our programs are industry-recognized and designed in partnership with hospitality leaders for maximum employability." },
  { q: "Can girls apply?", a: "Of course. We welcome and actively encourage female students. Our environment is safe, respectful, and growth-oriented for everyone." },
  { q: "Can average students succeed here?", a: "Yes. Attitude, discipline, and the right training matter far more than marks. Our program is designed to bring out the best in every student." },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-section-gradient">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-4">Parents Often Ask</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy mb-5">
            Your Questions, <em className="not-italic text-gradient-gold">Answered</em>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6 shadow-card-soft data-[state=open]:border-gold/40 data-[state=open]:shadow-elegant transition-smooth">
              <AccordionTrigger className="font-display text-lg text-navy hover:no-underline py-5 text-left">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
