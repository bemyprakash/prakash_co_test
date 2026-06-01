import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { Star, Quote, Award, Heart, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews & Recognition",
  description: "Read what tea connoisseurs and heritage food lovers say about A. Prakash & Co.",
};

export const revalidate = 60; // Cache refresh every minute

export default async function ReviewsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const mediaMentions = await prisma.mediaMention.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream)" }} className="pb-16">
        {/* Header */}
        <div
          className="py-14 text-center"
          style={{ borderBottom: "1px solid rgba(10,155,75,0.1)" }}
        >
          <div className="container-heritage space-y-3">
            <span className="badge-heritage">Generations of Trust</span>
            <h1 className="font-serif text-heading-xl text-charcoal">Reviews & Recognition</h1>
            <p className="text-muted max-w-md mx-auto text-sm">
              Since 1928, our commitment has been absolute customer satisfaction. Read our historic reviews.
            </p>
            <div className="flex justify-center mt-4">
              <HeritageDivider color="gold" size="sm" />
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="container-heritage py-20 max-w-6xl space-y-24">
          {/* Section 1: Customer quotes */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-charcoal">Connoisseur Feedback</h2>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">What our patrons write</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-[8px] p-10 shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow relative"
                  style={{ borderColor: "rgba(10,155,75,0.08)" }}
                >
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-brand-light pointer-events-none opacity-40" />
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-gold text-gold"
                          style={{
                            color: "var(--gold)",
                            fill: i < t.rating ? "var(--gold)" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-charcoal leading-loose italic">&ldquo;{t.text}&rdquo;</p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center font-bold text-brand-primary text-xs font-serif">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-serif font-bold text-charcoal text-xs">{t.name}</p>
                      <p className="text-[10px] text-muted">{t.location || "Darjeeling"} • via {t.source || "Direct"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Press & Recognitions */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-charcoal">Press & Media Mention</h2>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Featured on prestigious editorials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {mediaMentions.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-[8px] p-8 border shadow-inner flex items-center gap-4 hover:border-brand-primary hover:shadow-sm transition-all"
                  style={{ borderColor: "rgba(10,155,75,0.08)" }}
                >
                  <div className="w-10 h-10 rounded-sm bg-brand-light flex items-center justify-center flex-shrink-0 text-brand-primary text-lg">
                    📰
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-charcoal text-xs leading-snug">{m.title}</h3>
                    <p className="text-[10px] text-brand-primary font-semibold uppercase tracking-wider mt-1">{m.publication}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
