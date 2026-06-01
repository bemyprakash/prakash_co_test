"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HeritageDivider, HeritageSectionDivider } from "@/components/heritage/HeritageDivider";
import { Leaf, Heart, Award, Users } from "lucide-react";

const STORY_TIMELINE = [
  {
    year: "1916",
    era: "Seeking Refuge",
    story: `Anil Prakash's grandfather sought refuge in the misty hills of Landour from the outbreak of plague. Little did he know that this decision to move to the enchanting town would shape the destiny of the Prakash family for over a century.`,
    values: ["Resilience", "New Beginnings"],
    image: "⛰️",
  },
  {
    year: "1918",
    era: "Humble Beginnings",
    story: `Prakash Stores began as a humble establishment in Sister's Bazaar, selling groceries and disposable cutlery. Nestled amidst the Himalayas near Mussoorie, right next to the Landour Bakehouse, the small store laid the foundations for a century-old legacy.`,
    values: ["Heritage", "Community"],
    image: "🏪",
  },
  {
    year: "1940s",
    era: "The Art of Cheese-making",
    story: `As the British residents bid adieu to Landour, Inder Prakash cannily recognised an opportunity. With ingenuity and guidance from an American missionary, he delved into the art of cheese-making, crafting delectable varieties that captivated locals and luminaries alike.

Legends whisper that the flavours of Landour's cheese even found favour with Jawaharlal Nehru, India's first Prime Minister.`,
    values: ["Adaptation", "Craftsmanship"],
    image: "🧀",
  },
  {
    year: "Today",
    era: "A Century-Old Legacy",
    story: `Today, as the fourth generation prepares to take the reins, the legacy of Landour's cheese lives on. From parmesan to cheddar, each variety is meticulously crafted by hand, eschewing artificial processes for a taste that transcends time.

Twenty-something Dhairya Prakash looks towards the future with hope and determination. "Landour cheese will always be our family's pride," he declared, a promise echoing through the corridors of time.`,
    values: ["Tradition", "Family Pride"],
    image: "✨",
  },
];

const VALUES = [
  { icon: Leaf,  title: "Quality",     desc: "Every product is personally curated. Nothing reaches you that hasn't met our family's standard." },
  { icon: Heart, title: "Legacy",      desc: "95+ years of heritage is a responsibility we take seriously. We don't take shortcuts." },
  { icon: Users, title: "Community",   desc: "We are a family business. Our customers are part of our extended family." },
  { icon: Award, title: "Authenticity",desc: "We source directly. We verify personally. We deliver genuinely." },
];

export function OurStoryClient() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <article>
      {/* Hero */}
      <section
        className="py-24 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--brand-deep) 0%, var(--brand-primary) 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 40px)" }}
          aria-hidden="true"
        />
        <div className="container-heritage relative space-y-6">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-sm"
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--gold)" }}>
              Est. 1918
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-white font-bold">
              Our Story
            </h1>
            <HeritageDivider color="gold" size="lg" className="justify-center" />
            <p className="font-heritage italic text-xl text-white/80 max-w-xl mx-auto">
              Four generations. One commitment. Your trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="container-heritage max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-heading-lg text-charcoal">
            A 100-Year-Old Legacy in Landour
          </h2>
          <p className="text-muted leading-relaxed text-base lg:text-lg">
            In the heart of the misty hills of Uttarakhand lies the enchanting town of Landour, home to one of India's favourite authors, Ruskin Bond, and our cheese shop that is deeply rooted in the history of its cobblestone streets and colonial-era cottages.
          </p>
          <p className="text-muted leading-relaxed">
            Every block of cheese tells a story, bearing the names of villages across the globe while carrying the essence of Landour within its folds. "Every cheese is named after its village, across the world. I want to give Landour its own cheese," says Anil Prakash, reflecting the pride of his ancestral homeland.
          </p>
          <HeritageSectionDivider color="gold" />
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding" style={{ background: "var(--cream)" }}>
        <div className="container-heritage">
          <div className="text-center mb-16 space-y-3">
            <span className="badge-heritage">Our Journey</span>
            <h2 className="font-serif text-heading-xl text-charcoal">Decades of Heritage</h2>
            <HeritageDivider color="gold" size="md" className="justify-center" />
          </div>

          <div className="space-y-0">
            {STORY_TIMELINE.map((entry, i) => {
              const isEven = i % 2 === 0;
              const ref    = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });

              return (
                <motion.div
                  key={entry.year}
                  ref={ref}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-0 mb-1`}
                >
                  {/* Content */}
                  <div className={`flex-1 p-8 lg:p-12 ${isEven ? "lg:text-right" : "lg:text-left"}`}
                    style={{ background: i % 4 < 2 ? "white" : "var(--brand-light)" }}>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="text-4xl">{entry.image}</div>
                      <p className="font-heritage text-3xl font-semibold" style={{ color: "var(--gold)" }}>
                        {entry.year}
                      </p>
                      <h3 className="font-serif text-xl font-bold text-charcoal">{entry.era}</h3>
                      <div className="space-y-3">
                        {entry.story.split("\n\n").map((para, j) => (
                          <p key={j} className="text-sm text-muted leading-relaxed">{para}</p>
                        ))}
                      </div>
                      <div className={`flex flex-wrap gap-2 mt-4 ${isEven ? "lg:justify-end" : ""}`}>
                        {entry.values.map((v) => (
                          <span key={v} className="badge-heritage text-[11px]">{v}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Year marker */}
                  <div
                    className="hidden lg:flex w-24 flex-col items-center justify-center flex-shrink-0"
                    style={{ background: "var(--brand-deep)" }}
                  >
                    <div
                      className="w-1 flex-1"
                      style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }}
                    />
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center z-10"
                      style={{ background: "var(--gold)", border: "3px solid white" }}
                    >
                      <span className="text-[9px] font-bold text-white">{i + 1}</span>
                    </div>
                    <div
                      className="w-1 flex-1"
                      style={{ background: "linear-gradient(to top, var(--gold), transparent)" }}
                    />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block" style={{ background: i % 4 < 2 ? "var(--brand-light)" : "white" }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" style={{ background: "var(--brand-deep)" }}>
        <div className="container-heritage">
          <div className="text-center mb-14 space-y-3">
            <span className="badge-heritage" style={{ background: "rgba(255,255,255,0.1)", color: "var(--gold)" }}>
              Our Values
            </span>
            <h2 className="font-serif text-heading-xl text-white">
              What We Stand For
            </h2>
            <HeritageDivider color="gold" size="md" className="justify-center" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              const ref  = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-40px" });
              return (
                <motion.div
                  key={v.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-7 rounded-sm text-center space-y-4"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="w-12 h-12 mx-auto rounded-sm flex items-center justify-center"
                    style={{ background: "var(--gold)" }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">{v.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
