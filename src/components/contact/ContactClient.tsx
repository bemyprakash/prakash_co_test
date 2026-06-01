"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2 } from "lucide-react";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { toast } from "sonner";
import { useState } from "react";

const contactSchema = z.object({
  name:    z.string().min(2, "Name required"),
  email:   z.string().email("Valid email required"),
  phone:   z.string().optional(),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(20, "Please write at least 20 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactClient() {
  const [sent, setSent] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you within 24 hours.");
        setSent(true);
        reset();
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <section className="section-padding" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <div className="py-14 text-center" style={{ background: "var(--brand-deep)", marginTop: "-5rem", paddingTop: "7rem" }}>
        <div className="container-heritage space-y-3">
          <span className="badge-heritage" style={{ background: "rgba(255,255,255,0.1)", color: "var(--gold)" }}>Get In Touch</span>
          <h1 className="font-serif text-heading-xl text-white">Contact Us</h1>
          <HeritageDivider color="gold" size="sm" className="justify-center" />
          <p className="text-white/60 max-w-md mx-auto text-sm">
            We&apos;re a family business. Every message is read personally.
          </p>
        </div>
      </div>

      <div className="container-heritage mt-20 max-w-4xl mx-auto">
        <div className="flex flex-col gap-20" ref={ref}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-5">Reach Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: MapPin,       label: "Visit Us",    value: "Sisters' Bazaar, Landour\nMussoorie, Uttarakhand" },
                  { icon: Phone,        label: "Call Us",     value: process.env.NEXT_PUBLIC_STORE_PHONE || "+91 XXXXXXXXXX" },
                  { icon: Mail,         label: "Email Us",    value: process.env.NEXT_PUBLIC_STORE_EMAIL || "contact@aprakashco.com" },
                  { icon: Clock,        label: "Store Hours", value: "Daily: 10:30 AM – 7:00 PM" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4 p-6 bg-white rounded-[8px] shadow-sm border border-gray-100/50">
                    <div className="w-12 h-12 rounded-[8px] flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--brand-light)" }}>
                      <Icon className="w-6 h-6" style={{ color: "var(--brand-primary)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted uppercase tracking-wider">{label}</p>
                      <p className="text-base text-charcoal whitespace-pre-line mt-1 leading-relaxed">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919999999999"}?text=Hello%20A.%20Prakash%20%26%20Co.%2C%20I%20have%20a%20query.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-sm transition-all hover:-translate-y-0.5"
              style={{ background: "#25D366", color: "white" }}
            >
              <MessageCircle className="w-5 h-5" />
              <div>
                <p className="font-medium text-sm">Chat on WhatsApp</p>
                <p className="text-xs opacity-80">Usually replies within the hour</p>
              </div>
            </a>

            {/* Hidden map placeholder for now */}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full"
          >
            <div className="bg-white rounded-[8px] p-10 md:p-12 shadow-sm" style={{ border: "1px solid rgba(10,155,75,0.1)" }}>
              <h2 className="font-serif text-xl font-semibold text-charcoal mb-6">Send a Message</h2>

              {sent ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ background: "var(--brand-light)" }}>
                    <Send className="w-7 h-7" style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <h3 className="font-serif text-lg text-charcoal">Message Sent!</h3>
                  <p className="text-sm text-muted">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary mt-4 text-sm">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Name *</label>
                      <input {...register("name")} className="input-heritage" placeholder="Your full name" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Email *</label>
                      <input {...register("email")} className="input-heritage" placeholder="your@email.com" type="email" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
                      <input {...register("phone")} className="input-heritage" placeholder="Optional" type="tel" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Subject *</label>
                      <input {...register("subject")} className="input-heritage" placeholder="How can we help?" />
                      {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Message *</label>
                    <textarea {...register("message")} rows={6} className="input-heritage resize-none"
                      placeholder="Tell us how we can help you…" />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary group w-full justify-center py-3 mt-4">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
