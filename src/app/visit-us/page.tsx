import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Visit Our Shop",
  description: "Stop by our historic storefront since the 1920s in the quaint Sisters' Bazaar in Landour, Mussoorie.",
};

const STATS = [
  { label: "Founded", value: "1920s" },
  { label: "Location", value: "Landour" },
  { label: "Generations", value: "Four" },
];

export default function VisitUsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream)" }}>
        {/* Header banner */}
        <div
          className="py-14 text-center"
          style={{ borderBottom: "1px solid rgba(10,155,75,0.1)" }}
        >
          <div className="container-heritage space-y-3">
            <span className="badge-heritage">Historic Landmark</span>
            <h1 className="font-serif text-heading-xl text-charcoal">Visit Our Store</h1>
            <p className="text-muted max-w-md mx-auto text-sm leading-loose">
              Experience the legacy firsthand at our iconic shop nestled in Sisters' Bazaar.
            </p>
            <div className="flex justify-center mt-4">
              <HeritageDivider color="gold" size="sm" />
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="container-heritage py-24 max-w-4xl mx-auto space-y-24">
          <div className="flex flex-col gap-24">
            {/* Top Section — Coordinates & Details */}
            <div className="flex flex-col justify-between bg-white rounded-[12px] p-12 md:p-16 shadow-sm border border-gray-100/50">
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">A. Prakash & Co. Store</h2>
                  <p className="text-xs text-muted mt-1 uppercase tracking-wider font-mono">ESTD. 1920s</p>
                </div>

                <div className="space-y-8 text-base text-charcoal">
                  <div className="flex gap-3.5 items-start">
                    <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-lg">Shop Address</p>
                      <p className="text-muted text-base leading-loose mt-2">
                        Sisters' Bazaar, Landour Cantonment,<br />
                        Mussoorie, Uttarakhand
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <Phone className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Contact Call</p>
                      <p className="text-muted text-sm mt-1">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <Mail className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Email Dispatch</p>
                      <p className="text-muted font-mono text-sm mt-1">orders@aprakashco.com</p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <Clock className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-lg">Business Hours</p>
                      <p className="text-muted text-base leading-loose mt-2">
                        Open daily from 10:30 AM to 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct chat link */}
              <div className="pt-8 border-t border-gray-50 mt-6">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center text-xs py-3 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Chat Direct via WhatsApp
                </a>
              </div>
            </div>

            {/* Bottom Section — Large Map Placeholder & stats */}
            <div className="flex flex-col gap-10">
              {/* Stats card banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-white p-8 text-center rounded-[8px] border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold font-serif text-brand-primary">{s.value}</p>
                    <p className="text-[12px] text-muted uppercase tracking-wider font-semibold mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Map Canvas Box */}
              <div
                className="w-full rounded-[8px] border overflow-hidden relative min-h-[400px] flex items-center justify-center text-center p-12 bg-white"
                style={{ borderColor: "rgba(10,155,75,0.08)" }}
              >
                <div className="space-y-6 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal">Location Interactive Map</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Located in the quaint Sisters' Bazaar, next to Landour Bakehouse. A landmark in itself.
                  </p>
                  <div className="rounded border overflow-hidden mt-4 shadow-inner bg-gray-50 text-[12px] p-3 text-muted uppercase font-mono">
                    🗺️ Mock Map: Coordinates [30.4619° N, 78.1068° E]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor's Guide */}
          <div
            className="bg-white rounded-[8px] p-10 md:p-14 shadow-sm border space-y-10"
            style={{ borderColor: "rgba(10,155,75,0.08)" }}
          >
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-charcoal">Visitor&apos;s Heritage Guide</h3>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">What to expect when visiting us</p>
              <HeritageDivider color="gold" size="sm" className="justify-start mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-charcoal leading-loose pt-4">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-brand-primary text-base flex items-center gap-2">
                  🥜 Famous Peanut Butter
                </h4>
                <p className="text-muted">
                  We are globally famous for our homemade peanut butter, available in both crunchy and creamy varieties. Perfect for taking a piece of Landour back home with you.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-brand-primary text-base flex items-center gap-2">
                  🧀 Artisanal Cheddar
                </h4>
                <p className="text-muted">
                  Discover our fresh artisan cheeses. Carefully crafted and matured in our cool mountain climate to develop the perfect sharpness and rich flavor.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-brand-primary text-base flex items-center gap-2">
                  🍯 Handmade Preserves
                </h4>
                <p className="text-muted">
                  Explore our wide selection of fruit jams, marmalades, and chutneys. Made from fresh local fruits following recipes that have been cherished for decades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
