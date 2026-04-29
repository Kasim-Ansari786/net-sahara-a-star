import TopBar from "@/components/landing/TopBar";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import WhyParents from "@/components/landing/WhyParents";
import JobGuarantee from "@/components/landing/JobGuarantee";
import WhyStudents from "@/components/landing/WhyStudents";
import SuccessVision from "@/components/landing/SuccessVision";
import EntranceTest from "@/components/landing/EntranceTest";
import Testimonials from "@/components/landing/Testimonials";
import RegistrationForm from "@/components/landing/RegistrationForm";
import FAQ from "@/components/landing/FAQ";
import Urgency from "@/components/landing/Urgency";
import Footer from "@/components/landing/Footer";
import { StickyMobileCTA, WhatsAppFloat, ExitIntentPopup } from "@/components/landing/Floating";

const Index = () => {
  return (
    <main className="min-h-screen bg-background pb-16 lg:pb-0">
      <TopBar />
      <Hero />
      <PainPoints />
      <JobGuarantee />
      <WhyParents />
      <WhyStudents />
      <SuccessVision />
      <EntranceTest />
      <Testimonials />
      <RegistrationForm />
      <FAQ />
      <Urgency />
      <Footer />

      <WhatsAppFloat />
      <StickyMobileCTA />
      <ExitIntentPopup />
    </main>
  );
};

export default Index;