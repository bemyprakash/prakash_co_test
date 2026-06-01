import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { LegacySection } from "@/components/home/LegacySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { MediaMentions } from "@/components/home/MediaMentions";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LegacySection />
        <FeaturedProducts />
        <WhyChooseUs />
        <TestimonialsSection />
        <MediaMentions />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
