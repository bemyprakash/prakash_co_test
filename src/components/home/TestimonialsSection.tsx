"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Meera Sharma",
    location: "Delhi",
    rating: 5,
    source: "Google",
    text: "I have been buying Prakash's Darjeeling tea for over 20 years. The quality is absolutely consistent — exactly what my grandmother used to bring home. A heritage brand that truly lives up to its legacy.",
    initial: "M",
  },
  {
    id: 2,
    name: "Rohan Gupta",
    location: "Mumbai",
    rating: 5,
    source: "TripAdvisor",
    text: "Visited the store while travelling and was blown away by the selection. The cheese and the jams are exceptional. The owner was incredibly knowledgeable. Will definitely order online now that I'm back home.",
    initial: "R",
  },
  {
    id: 3,
    name: "Sunita Bose",
    location: "Kolkata",
    rating: 5,
    source: "Google",
    text: "Three generations of my family have shopped here. My mother used to send me with a list every month. Now I order online and the quality is exactly the same. True heritage.",
    initial: "S",
  },
  {
    id: 4,
    name: "Arjun Mehta",
    location: "Bangalore",
    rating: 5,
    source: "Google",
    text: "The Heritage Blend Coffee is something else. Rich, smooth, and unlike anything I've had from the big brands. Ordered 3 packs since my first order. Highly recommend.",
    initial: "A",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  const t = TESTIMONIALS[current];

  return (
    <section className="section-padding bg-white" aria-label="Customer Testimonials">
      <div className="container-heritage flex flex-col items-center w-full">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4 mb-14"
        >
          <span className="badge-heritage">Testimonials</span>
          <h2 className="font-serif text-heading-xl text-charcoal">
            What Our Customers Say
          </h2>
          <HeritageDivider color="gold" size="md" className="justify-center" />
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative p-8 lg:p-12 rounded-[8px] flex flex-col items-center text-center w-full"
            style={{
              background: "var(--cream)",
              border: "1px solid rgba(201, 162, 74, 0.2)",
            }}
          >
            {/* Quote icon */}
            <Quote
              className="absolute top-6 left-8 opacity-10 w-10 h-10"
              style={{ color: "var(--brand-primary)" }}
              aria-hidden="true"
            />
            <Quote
              className="absolute bottom-6 right-8 opacity-10 w-10 h-10 rotate-180"
              style={{ color: "var(--brand-primary)" }}
              aria-hidden="true"
            />

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5"
                  style={{ fill: "var(--gold)", color: "var(--gold)" }}
                />
              ))}
            </div>

            {/* Text */}
            <p className="font-heritage text-xl lg:text-2xl italic leading-relaxed text-charcoal mb-8">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Avatar + Name */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg"
                style={{ background: "var(--brand-primary)" }}
              >
                {t.initial}
              </div>
              <div>
                <p className="font-semibold text-charcoal">{t.name}</p>
                <p className="text-sm text-muted">{t.location}</p>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-sm mt-1 inline-block"
                  style={{ background: "var(--brand-light)", color: "var(--brand-primary)" }}
                >
                  {t.source} Review
                </span>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === current ? "w-6" : "bg-gray-300"
                  )}
                  style={{ background: i === current ? "var(--brand-primary)" : undefined }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
