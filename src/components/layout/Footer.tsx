import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";

const FOOTER_LINKS = {
  shop: [
    { label: "Tea & Coffee",     href: "/shop?category=tea-coffee" },
    { label: "Jams & Preserves", href: "/shop?category=jams" },
    { label: "Cheese & Dairy",   href: "/shop?category=cheese" },
    { label: "Confectionery",    href: "/shop?category=confectionery" },
    { label: "Souvenir Items",   href: "/shop?category=souvenirs" },
    { label: "All Products",     href: "/shop" },
  ],
  company: [
    { label: "Our Story",       href: "/our-story" },
    { label: "Reviews",         href: "/reviews" },
    { label: "Visit Our Store", href: "/visit-us" },
    { label: "Blog",            href: "/blog" },
    { label: "Contact Us",      href: "/contact" },
  ],
  policies: [
    { label: "Privacy Policy",    href: "/policies/privacy" },
    { label: "Shipping Policy",   href: "/policies/shipping" },
    { label: "Return Policy",     href: "/policies/returns" },
    { label: "Terms & Conditions",href: "/policies/terms" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-deep text-white">
      {/* Heritage band */}
      <div className="bg-brand-primary py-4">
        <div className="container-heritage flex items-center justify-center gap-4">
          <HeritageDivider color="light" size="sm" />
          <span className="font-heritage italic text-white/90 text-lg tracking-wide whitespace-nowrap">
            Serving Generations Since 1928
          </span>
          <HeritageDivider color="light" size="sm" />
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-heritage py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 bg-white rounded-sm p-1.5">
                <Image
                  src="/images/logo.png"
                  alt="A. Prakash & Co."
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-white leading-tight">
                  A. Prakash <span className="text-gold">&amp;</span> Co.
                </p>
                <p className="font-heritage text-xs text-white/60 tracking-[0.2em] uppercase">
                  Since 1928
                </p>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              A heritage specialty store trusted by generations. Bringing you the finest
              teas, coffees, jams, cheese, and confectionery since 1928.
            </p>

            {/* Contact Details */}
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5 text-white/80">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold" />
                <span>Store Address, City, State — PIN</span>
              </div>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_STORE_PHONE}`}
                className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0 text-gold" />
                <span>{process.env.NEXT_PUBLIC_STORE_PHONE || "+91 XXXXXXXXXX"}</span>
              </a>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_STORE_EMAIL}`}
                className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-gold" />
                <span>{process.env.NEXT_PUBLIC_STORE_EMAIL || "contact@aprakashco.com"}</span>
              </a>
              <div className="flex items-center gap-2.5 text-white/80">
                <Clock className="w-4 h-4 flex-shrink-0 text-gold" />
                <span>Mon–Sat: 9 AM – 7 PM</span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-sm hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold mb-4">
              Our Products
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-gold transition-colors hover:pl-1 duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-serif text-white text-base font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-gold transition-colors hover:pl-1 duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Newsletter */}
          <div className="space-y-8">
            <div>
              <h4 className="font-serif text-white text-base font-semibold mb-4">
                Policies
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.policies.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 text-sm hover:text-gold transition-colors hover:pl-1 duration-200 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="font-serif text-white text-sm font-semibold mb-3">
                Heritage Newsletter
              </h4>
              <p className="text-white/60 text-xs mb-3">
                Stories, recipes, and offers from our store.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-sm text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gold text-white text-xs font-medium rounded-sm hover:bg-gold-dark transition-colors flex-shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Heritage Divider */}
      <div className="border-t border-white/10">
        <div className="container-heritage py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs text-center md:text-left">
            © {currentYear} A. Prakash &amp; Co. All rights reserved. Est. 1928.
          </p>
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span>Made with heritage &amp; care in India</span>
            <span>·</span>
            <Link href="/admin" className="hover:text-white/70 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
