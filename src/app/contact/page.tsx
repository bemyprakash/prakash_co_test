import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactClient } from "@/components/contact/ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with A. Prakash & Co. — call, email, WhatsApp, or visit our store.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactClient />
      </main>
      <Footer />
    </>
  );
}
