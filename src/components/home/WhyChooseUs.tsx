"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Shield, Leaf, Clock, Heart } from "lucide-react";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";

const WHY_CARDS = [
  {
    icon: Clock,
    title: "Since the 1920s",
    desc: "Over 95 years of unbroken heritage. Four generations of expertise in every product.",
    color: "var(--brand-primary)",
    bg: "var(--brand-light)",
  },
  {
    icon: Users,
    title: "Trusted by Generations",
    desc: "Families have returned to us for decades. Their loyalty is our greatest achievement.",
    color: "var(--gold)",
    bg: "#FFF8EC",
  },
  {
    icon: Leaf,
    title: "Premium Quality",
    desc: "We source directly and curate carefully. No compromise — ever. Just as it was in the 1920s.",
    color: "var(--brand-primary)",
    bg: "var(--brand-light)",
  },
  {
    icon: Shield,
    title: "Authentic Products",
    desc: "Every product is genuine, traceable, and exactly as described. Honest trade since day one.",
    color: "var(--gold)",
    bg: "#FFF8EC",
  },
  {
    icon: Award,
    title: "Heritage Brand",
    desc: "Featured in leading publications and awarded for our contribution to India's food heritage.",
    color: "var(--brand-primary)",
    bg: "var(--brand-light)",
  },
  {
    icon: Heart,
    title: "Family Run",
    desc: "Still owned and operated by the Prakash family. Personal care in every order.",
    color: "var(--gold)",
    bg: "#FFF8EC",
  },
];

export function WhyChooseUs() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="section-padding"
      style={{ background: "var(--brand-deep)" }}
      aria-label="Why Choose Us"
    >
      <div className="container-heritage">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4 mb-14"
        >
          <span
            className="badge-heritage"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--gold)", border: "1px solid var(--gold)" }}
          >
            Why Prakash&apos;s
          </span>
          <h2 className="font-serif text-heading-xl text-white">
            Why Generations Choose Us
          </h2>
          <p className="text-white/60 max-w-lg mx-auto">
            We don&apos;t just sell products. We deliver a promise that has been kept for over 95 years.
          </p>
          <div className="flex justify-center">
            <HeritageDivider color="gold" size="md" />
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-7 rounded-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-5"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.color === "var(--gold)" ? "var(--gold)" : "white" }} />
                </div>

                {/* Content */}
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{card.desc}</p>

                {/* Bottom accent */}
                <div
                  className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: "linear-gradient(to right, var(--gold), transparent)" }}
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
