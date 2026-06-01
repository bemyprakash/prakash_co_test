"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Loader2, Check } from "lucide-react";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";

export function NewsletterSection() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      className="section-padding"
      style={{ background: "var(--brand-primary)" }}
      aria-label="Newsletter"
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }}
        aria-hidden="true"
      />

      <div className="container-heritage relative flex flex-col items-center w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl w-full mx-auto flex flex-col items-center text-center space-y-6"
        >
          {/* Icon */}
          <div
            className="w-14 h-14 mx-auto rounded-sm flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Mail className="w-6 h-6 text-white" />
          </div>

          <span
            className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-sm"
            style={{ background: "rgba(255,255,255,0.1)", color: "var(--gold)" }}
          >
            Heritage Newsletter
          </span>

          <h2 className="font-serif text-heading-xl text-white">
            Stories From Our Store
          </h2>

          <div className="flex justify-center">
            <HeritageDivider color="light" size="md" />
          </div>

          <p className="text-white/70 leading-relaxed">
            Receive heritage recipes, behind-the-scenes stories, seasonal picks,
            and exclusive offers — delivered gently to your inbox.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-medium">
                Welcome to our heritage family! Check your inbox.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-medium text-sm transition-all flex-shrink-0"
                style={{ background: "var(--gold)", color: "white" }}
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-red-200 text-sm">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="text-white/40 text-xs">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
