import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle, Phone, X } from "lucide-react";

const PHONE_NUMBER = "+918657411592"; // clean format
const WHATSAPP_NUMBER = "918657411592"; // without +

export const StickyMobileCTA = () => (
  <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-navy-deep/95 backdrop-blur border-t border-gold/30 px-3 py-2.5 flex gap-2 shadow-luxury">
    <Button asChild variant="outline-ivory" size="default" className="flex-1">
<<<<<<< HEAD

      <a href="tel:+918657411592"><Phone className="h-4 w-4" /> Counsellor</a>

=======
      <a href={`tel:${PHONE_NUMBER}`}>
        <Phone className="h-4 w-4" /> Counsellor
      </a>
>>>>>>> 5627e73 (remove supabase, use localStorage)
    </Button>
    <Button asChild variant="gold" size="default" className="flex-1">
      <a href="#register">Register ₹500</a>
    </Button>
  </div>
);

export const WhatsAppFloat = () => (
  <a
<<<<<<< HEAD

    href="https://wa.me/918657411592?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20A-Star%20Academy"

=======
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20A-Star%20`}
>>>>>>> 5627e73 (remove supabase, use localStorage)
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-20 lg:bottom-6 right-4 z-40 h-14 w-14 rounded-full bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] text-white flex items-center justify-center shadow-luxury hover:scale-110 transition-smooth"
  >
    <MessageCircle className="h-7 w-7" />
    <span className="absolute inset-0 rounded-full animate-pulse-gold pointer-events-none" />
  </a>
);

export const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onLeave = (e) => {
      if (shown) return;
      if (e.clientY <= 0) {
        setShown(true);
        setOpen(true);
      }
    };
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, [shown]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-gold/30">
        <div className="bg-hero-gradient text-ivory p-8 relative">
          <div className="absolute inset-0 bg-radial-gold opacity-40" />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-3 right-3 text-ivory/70 hover:text-gold z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
              Wait!
            </div>

            <DialogHeader>
              <DialogTitle className="font-display text-3xl text-ivory leading-tight">
                Still Deciding?
              </DialogTitle>
              <DialogDescription className="text-ivory/75 text-base mt-3">
                Book a{" "}
                <span className="text-gold font-semibold">
                  free counselling call
                </span>{" "}
                with our expert.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-col gap-2">
              <Button asChild variant="gold" size="lg">
<<<<<<< HEAD

                <a href="tel:+918657411592">Get Free Counselling Call</a>

                <a href="tel:+919999999999">Get Free Counselling Call</a>

=======
                <a href={`tel:${PHONE_NUMBER}`}>
                  Get Free Counselling Call
                </a>
>>>>>>> 5627e73 (remove supabase, use localStorage)
              </Button>
              <Button
                variant="outline-ivory"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};