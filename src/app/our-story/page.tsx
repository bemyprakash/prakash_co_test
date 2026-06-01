import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OurStoryClient } from "@/components/story/OurStoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The heritage story of A. Prakash & Co. since 1928. Four generations of dedication to quality tea, coffee, jams, cheese, and confectionery.",
};

export default function OurStoryPage() {
  return (
    <>
      <Navbar />
      <main>
        <OurStoryClient />
      </main>
      <Footer />
    </>
  );
}
