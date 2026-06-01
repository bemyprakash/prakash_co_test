"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HeritageDivider, HeritageSectionDivider } from "@/components/heritage/HeritageDivider";

const STATS = [
  { value: "1928",  label: "Year Founded",       suffix: "" },
  { value: "95",    label: "Years of Heritage",   suffix: "+" },
  { value: "3,00,000", label: "Families Served",  suffix: "+" },
  { value: "4",     label: "Generations",          suffix: "" },
];

const TIMELINE = [
  {
    year: "1928",
    title: "The Beginning",
    desc: "A. Prakash & Co. opens its doors with a commitment to quality and honest trade.",
  },
  {
    year: "1950s",
    title: "A Growing Legacy",
    desc: "Expanding the product range and earning the trust of families across the region.",
  },
  {
    year: "1970s",
    title: "Third Generation",
    desc: "The family tradition passes on, with new products and deeper community roots.",
  },
  {
    year: "2000s",
    title: "Heritage Preserved",
    desc: "Modernising operations while keeping the soul of the 1928 founding intact.",
  },
  {
    year: "Today",
    title: "Still Serving You",
    desc: "Online or in-store — the same quality your grandparents trusted, now at your doorstep.",
  },
];

export function LegacySection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-white" aria-label="Our Legacy">
      <div className="container-heritage">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="badge-heritage">Our Heritage</span>
          <h2 className="font-serif text-heading-xl text-charcoal">
            A Legacy Built on Trust
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Since 1928, four generations of the Prakash family have devoted themselves
            to bringing you the finest quality products with unwavering integrity.
          </p>
          <div className="flex justify-center mt-4">
            <HeritageDivider color="gold" size="md" />
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center p-6 rounded-sm"
              style={{
                background: i % 2 === 0 ? "var(--brand-light)" : "var(--cream)",
                border: "1px solid rgba(10,155,75,0.1)",
              }}
            >
              <p
                className="font-serif text-3xl lg:text-4xl font-bold"
                style={{ color: "var(--brand-primary)" }}
              >
                {stat.value}
                <span style={{ color: "var(--gold)" }}>{stat.suffix}</span>
              </p>
              <p className="text-sm text-muted mt-1 uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, var(--gold), transparent)", transform: "translateX(-50%)" }}
            aria-hidden="true"
          />

          <div className="space-y-12">
            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? -32 : 32 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                  className={`relative flex md:items-center gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`md:w-[calc(50%-2rem)] ${isLeft ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                    <div
                      className="inline-block p-5 rounded-sm card-heritage"
                      style={{ maxWidth: 340 }}
                    >
                      <p
                        className="font-heritage text-2xl font-semibold mb-1"
                        style={{ color: "var(--gold)" }}
                      >
                        {item.year}
                      </p>
                      <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div
                    className="absolute left-1/2 top-1/2 hidden md:flex w-4 h-4 rounded-full items-center justify-center"
                    style={{
                      transform: "translate(-50%, -50%)",
                      background: "var(--brand-primary)",
                      border: "3px solid var(--gold)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Spacer */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <HeritageSectionDivider color="gold" />
        </div>
      </div>
    </section>
  );
}
