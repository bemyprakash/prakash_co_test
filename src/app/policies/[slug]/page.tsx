import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${title} | Policies`,
    description: `Official policy guidelines for A. Prakash & Co. e-commerce store.`,
  };
}

const POLICIES: Record<
  string,
  { title: string; subtitle: string; content: React.ReactNode }
> = {
  "privacy-policy": {
    title: "Privacy Policy",
    subtitle: "How we collect, protect, and manage your personal data.",
    content: (
      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">1. Information We Collect</h2>
          <p className="text-sm text-muted leading-relaxed">
            We collect personal information that you provide directly to us when you make a purchase, create an account, subscribe to our newsletter, or fill out our contact form. This includes your name, email address, shipping and billing address, phone number, and transaction history.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">2. How We Use Your Information</h2>
          <p className="text-sm text-muted leading-relaxed">
            We use the information we collect to process and fulfill your orders, manage payments, communicate shipping updates, respond to customer service requests, send promotional newsletters (which you can opt out of at any time), and comply with legal or tax obligations.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">3. Payment Security & Third Parties</h2>
          <p className="text-sm text-muted leading-relaxed">
            All online transactions are securely processed through our certified payment gateways (e.g. Razorpay). We do not store or retain your raw credit card or net banking details on our servers. We only share delivery details with our trusted shipment courier partners.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">4. Cookies Policy</h2>
          <p className="text-sm text-muted leading-relaxed">
            Our website uses cookies to enhance your shopping experience, remember items in your cart, analyze site traffic, and optimize visual performance. You can disable cookies in your browser settings if you wish.
          </p>
        </section>
      </div>
    ),
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    subtitle: "Rules and terms governing the use of our heritage e-commerce platform.",
    content: (
      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">1. Agreement to Terms</h2>
          <p className="text-sm text-muted leading-relaxed">
            By accessing or using our website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please refrain from using our e-commerce platform.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">2. Accuracy of Products and Pricing</h2>
          <p className="text-sm text-muted leading-relaxed">
            We strive to display our specialty foods, teas, and variants with absolute accuracy. However, we cannot guarantee that your monitor&apos;s display of colors will perfectly match the physical items. Base pricing, GST, and variant stock counts are subject to change without prior notice.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">3. Purchases & Checkout Billing</h2>
          <p className="text-sm text-muted leading-relaxed">
            You agree to provide current, complete, and accurate billing and shipment details for all purchases. We reserve the right to cancel or refuse any orders that appear to be placed by dealers, resellers, or unauthorized wholesale agents.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">4. Intellectual Property</h2>
          <p className="text-sm text-muted leading-relaxed">
            All content including the &ldquo;Since 1928&rdquo; branding, logo layout, descriptive texts, photographs, custom SVG flourishes, and site structure are the intellectual property of A. Prakash & Co. and may not be reproduced without written permission.
          </p>
        </section>
      </div>
    ),
  },
  "shipping-policy": {
    title: "Shipping & Delivery Policy",
    subtitle: "Shipping timelines, GST fees, and geographical transit coverages.",
    content: (
      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">1. Order Dispatch Timelines</h2>
          <p className="text-sm text-muted leading-relaxed">
            All orders placed on our website are processed and dispatched within 24 to 48 hours. Orders are not packed or shipped on national holidays or Sundays to ensure courier quality.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">2. Shipment Fees & Thresholds</h2>
          <p className="text-sm text-muted leading-relaxed">
            We charge a standard delivery fee of ₹80 for local shipping across India. However, we offer **FREE Standard Delivery** on all cart orders whose subtotal value exceeds ₹500.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">3. Delivery Durations</h2>
          <p className="text-sm text-muted leading-relaxed">
            Estimated transit times vary by region. Metro locations across India typically receive packages within 3 to 5 business days, while deep mountain ranges, tourist centers, and remote zones might take 5 to 7 business days.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">4. Tracking & Damage Liability</h2>
          <p className="text-sm text-muted leading-relaxed">
            Once dispatched, a tracking number will be sent to your registered email. In the rare event that glass jars, artisan cheeses, or tea tins are damaged during transit, please contact us at orders@aprakashco.com with parcel photographs within 24 hours for a replacement.
          </p>
        </section>
      </div>
    ),
  },
  "refund-policy": {
    title: "Refunds & Cancellations",
    subtitle: "Our policies regarding order cancellations and payment refunds.",
    content: (
      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">1. Order Cancellation</h2>
          <p className="text-sm text-muted leading-relaxed">
            You can request to cancel your order within 6 hours of purchase, provided the package has not already been physically packed or dispatched. Once shipped, cancellations are no longer possible.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">2. Return Eligibility (Perishable Foods)</h2>
          <p className="text-sm text-muted leading-relaxed">
            Due to the organic nature of our fine foods (specialty teas, roasted coffee beans, high-altitude cheeses, and preserves), we cannot accept physical returns of food products for hygiene and food safety reasons.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">3. Damaged or Incorrect Shipments</h2>
          <p className="text-sm text-muted leading-relaxed">
            If you receive an incorrect product, or if the packaging is damaged, please reach out to us with photos of the package. We will immediately ship out a replacement package at no extra cost, or issue a full transaction refund.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-charcoal">4. Processing Refunds</h2>
          <p className="text-sm text-muted leading-relaxed">
            Approved refunds are credited back to the customer&apos;s original online payment account (e.g. source credit card/UPI) within 5 to 7 bank working days, as regulated by payment gateway schedules.
          </p>
        </section>
      </div>
    ),
  },
};

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[75vh]" style={{ background: "var(--cream)" }}>
        {/* Header */}
        <div
          className="py-14 text-center"
          style={{
            background: "var(--cream)",
            borderBottom: "1px solid rgba(10,155,75,0.1)",
          }}
        >
          <div className="container-heritage space-y-3">
            <span className="badge-heritage">A. Prakash & Co.</span>
            <h1 className="font-serif text-heading-xl text-charcoal">
              {policy.title}
            </h1>
            <p className="text-muted max-w-md mx-auto text-sm">
              {policy.subtitle}
            </p>
            <div className="flex justify-center mt-4">
              <HeritageDivider color="gold" size="sm" />
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="container-heritage py-12 max-w-3xl">
          <div
            className="bg-white rounded-sm p-8 md:p-12 shadow-sm border"
            style={{ borderColor: "rgba(10,155,75,0.08)" }}
          >
            {policy.content}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
