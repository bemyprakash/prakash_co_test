"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";

const MEDIA = [
  { name: "The Hindu",          initial: "TH", year: "2022" },
  { name: "Times of India",     initial: "TOI", year: "2021" },
  { name: "India Today",        initial: "IT", year: "2023" },
  { name: "Outlook India",      initial: "OL", year: "2020" },
  { name: "Deccan Herald",      initial: "DH", year: "2022" },
  { name: "Business Standard",  initial: "BS", year: "2023" },
];

export function MediaMentions() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="section-padding"
      style={{ background: "var(--cream)" }}
      aria-label="Media Mentions"
    >
      <div className="container-heritage">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="badge-heritage">As Featured In</span>
          <h2 className="font-serif text-heading-lg text-charcoal">
            Media Recognition
          </h2>
          <HeritageDivider color="gold" size="sm" className="justify-center" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MEDIA.map((pub, i) => (
            <motion.div
              key={pub.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex flex-col items-center justify-center p-5 rounded-sm border border-gray-100 hover:border-brand-primary hover:shadow-heritage transition-all duration-300 bg-white cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mb-3 font-serif font-bold text-xs text-white"
                style={{ background: "var(--brand-primary)" }}
              >
                {pub.initial}
              </div>
              <p className="text-xs font-semibold text-center text-charcoal leading-tight group-hover:text-brand-primary transition-colors">
                {pub.name}
              </p>
              <p className="text-[10px] text-muted mt-1">{pub.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
