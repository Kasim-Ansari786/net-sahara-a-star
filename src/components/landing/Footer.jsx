const Footer = () => {
  return (
    <footer className="bg-navy text-ivory/70 py-12 border-t border-gold/20">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-md bg-gold-gradient flex items-center justify-center">
                <span className="font-display text-navy-deep text-xl font-bold">A</span>
              </div>
              <div>
                <div className="font-display text-lg text-ivory">A-Star Academy</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold/70">By Sahara Star</div>
              </div>
            </div>
            <p className="text-sm max-w-md">
              India's premier hospitality academy — built inside the Sahara Star ecosystem. Real industry, real careers, real respect.
            </p>
          </div>
          <div>
            <div className="font-display text-ivory mb-4">Quick Links</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#why" className="hover:text-gold transition-smooth">Why A-Star</a></li>
              <li><a href="#exam" className="hover:text-gold transition-smooth">Entrance Test</a></li>
              <li><a href="#register" className="hover:text-gold transition-smooth">Register</a></li>
              <li><a href="#faq" className="hover:text-gold transition-smooth">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-ivory mb-4">Contact</div>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+918657411592" className="hover:text-gold transition-smooth">+91 99999 99999</a></li>
              <li><a href="mailto:info@astaracademy.in" className="hover:text-gold transition-smooth">admissions@astaracademy.in</a></li>
              <li>Sahara Star, Mumbai</li>
            </ul>
          </div>
        </div>
        <div className="gold-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/50">
          <div>© {new Date().getFullYear()} A-Star Academy by Sahara Star. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold transition-smooth">Privacy</a>
            <a href="#" className="hover:text-gold transition-smooth">Terms</a>
            <a href="#" className="hover:text-gold transition-smooth">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
