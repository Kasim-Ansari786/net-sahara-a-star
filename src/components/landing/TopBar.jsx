import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-navy-deep text-ivory text-xs sm:text-sm border-b border-gold/20">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 py-2">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-ivory/85">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-gold" />
            Limited Seats
          </span>
          <span className="hidden sm:inline text-gold/40">|</span>
          <span>National Entrance Test</span>
          <span className="hidden sm:inline text-gold/40">|</span>
          <span>
            Exam Date: <span className="text-gold font-medium">24 May</span>
          </span>
          <span className="hidden sm:inline text-gold/40">|</span>
          <span>₹500 Registration</span>
        </div>
        <a
          href="tel:+918657411592"
          className="hidden md:inline-flex items-center gap-1.5 text-ivory/80 hover:text-gold transition-smooth"
        >
          <Phone className="h-3.5 w-3.5" /> Counsellor
        </a>
      </div>
    </div>
  );
};

export default TopBar;
