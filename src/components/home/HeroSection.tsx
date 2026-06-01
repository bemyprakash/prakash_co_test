"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--cream)" }}
      aria-label="Hero"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            var(--brand-primary) 0px,
            var(--brand-primary) 1px,
            transparent 1px,
            transparent 40px
          )`,
        }}
        aria-hidden="true"
      />

      {/* Green vertical accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ background: "linear-gradient(to bottom, var(--brand-primary), var(--brand-deep))" }}
        aria-hidden="true"
      />

      {/* Gold top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }}
        aria-hidden="true"
      />

      <div className="container-heritage relative py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heritage badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-12" style={{ background: "var(--gold)" }} />
              <span className="badge-heritage">Est. 1920s</span>
              <div className="h-px w-12" style={{ background: "var(--gold)" }} />
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-3"
            >
              <h1
                className="font-serif leading-tight"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "var(--charcoal)",
                  letterSpacing: "-0.02em",
                }}
              >
                Serving Generations
                <br />
                <span style={{ color: "var(--brand-primary)" }}>Since the 1920s</span>
              </h1>

              <p
                className="font-heritage italic text-xl lg:text-2xl"
                style={{ color: "var(--gold)" }}
              >
                A heritage of quality, trust &amp; craftsmanship.
              </p>
            </motion.div>

            {/* Ornate divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <HeritageDivider color="gold" size="md" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-base lg:text-lg leading-relaxed max-w-md"
              style={{ color: "var(--muted)" }}
            >
              Historic grocery store dedicated to homemade peanut butter, fresh artisan cheeses, and handmade preserves. Trusted by families since the 1920s.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/shop" className="btn-primary group">
                <ShoppingBag className="w-4 h-4" />
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/our-story" className="btn-secondary">
                Our Story
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center gap-6 pt-4"
            >
              {[
                { num: "95+", label: "Years of Trust" },
                { num: "3L+", label: "Happy Customers" },
                { num: "500+", label: "Products" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="font-serif text-2xl font-bold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {stat.num}
                  </p>
                  <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Heritage Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main image frame */}
            <div className="relative">
              {/* Decorative border frame */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: "1px solid var(--gold)",
                  transform: "translate(12px, 12px)",
                }}
                aria-hidden="true"
              />
              <div
                className="relative rounded-sm overflow-hidden aspect-[4/5] bg-brand-light"
                style={{ border: "1px solid rgba(10, 155, 75, 0.2)" }}
              >
                {/* Placeholder — replace with hero product image */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                  style={{ background: "linear-gradient(135deg, var(--brand-light) 0%, #d6f0e4 100%)" }}
                >
                  <div className="text-center space-y-3 px-8">
                    {/* Logo-inspired ornament */}
                    <div className="flex justify-center">
                      <HeritageDivider color="green" size="lg" />
                    </div>
                    <p
                      className="font-serif text-4xl font-bold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      PRAKASH'S
                    </p>
                    <p
                      className="font-heritage tracking-[0.3em] text-sm uppercase"
                      style={{ color: "var(--brand-deep)" }}
                    >
                      Since 1920s
                    </p>
                    <div className="flex justify-center">
                      <HeritageDivider color="gold" size="md" />
                    </div>
                    <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
                      Peanut Butter · Cheese · Jams · Preserves
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating heritage badge */}
            <div
              className="absolute -bottom-5 -left-5 px-5 py-3 rounded-sm shadow-lg"
              style={{ background: "var(--brand-deep)", border: "1px solid var(--gold)" }}
            >
              <p className="font-heritage italic text-white/80 text-xs">A Heritage Brand</p>
              <p className="font-serif text-white font-bold text-lg leading-none">Since 1920s</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
