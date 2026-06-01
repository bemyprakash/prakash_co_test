import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heritage Blog",
  description: "Read culinary stories, Darjeeling tea brewing guides, and artisanal food preserves recipes.",
};

const POSTS = [
  {
    title: "The Connoisseur's Guide to Brewing Darjeeling First Flush",
    slug: "guide-brewing-darjeeling-first-flush",
    excerpt: "Learn the precise temperature, steeping timelines, and traditional accessory guides to unlock the floral muscatel notes of spring harvests.",
    date: "May 24, 2026",
    readTime: "4 mins read",
    author: "Pranav Prakash",
    category: "Tea Guides",
    cover: "🍃",
  },
  {
    title: "Curing Mountain Cheddar in Natural High-Altitude Cellars",
    slug: "curing-mountain-cheddar-altitude-cellars",
    excerpt: "Sourcing cow milk from lush high-elevation meadows and aging them inside traditional stone cold cellars in Kurseong Hills since 1950.",
    date: "April 15, 2026",
    readTime: "6 mins read",
    author: "Anoop Prakash",
    category: "Artisan Cheese",
    cover: "🧀",
  },
  {
    title: "The Preservation Art: Authentic 1930s Seville Orange Marmalade",
    slug: "preservation-art-seville-orange-marmalade",
    excerpt: "Unfolding our ancient family recipe of slow-simmering citrus fruits in heavy brass pans to achieve the perfect bitter-sweet morning preserve.",
    date: "March 20, 2026",
    readTime: "5 mins read",
    author: "P. S. Prakash",
    category: "Preserves recipes",
    cover: "🍊",
  },
];

export default function BlogListingPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream)" }} className="pb-16">
        {/* Header */}
        <div
          className="py-14 text-center"
          style={{ borderBottom: "1px solid rgba(10,155,75,0.1)" }}
        >
          <div className="container-heritage space-y-3">
            <span className="badge-heritage">Culinary Stories</span>
            <h1 className="font-serif text-heading-xl text-charcoal">Heritage Blog</h1>
            <p className="text-muted max-w-md mx-auto text-sm">
              Discover tea brewing rituals, artisan recipes, and family chronicles straight from the Himalayas.
            </p>
            <div className="flex justify-center mt-4">
              <HeritageDivider color="gold" size="sm" />
            </div>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="container-heritage py-12 max-w-5xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-sm border shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md hover:border-brand-primary transition-all group"
                style={{ borderColor: "rgba(10,155,75,0.08)" }}
              >
                {/* Visual Cover Icon */}
                <div
                  className="aspect-[16/10] w-full flex items-center justify-center text-5xl transition-transform group-hover:scale-105 duration-300"
                  style={{ background: "var(--brand-light)" }}
                >
                  {post.cover}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-brand-primary bg-brand-light">
                      {post.category}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h2 className="font-serif font-bold text-charcoal text-sm leading-snug group-hover:text-brand-primary transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-muted">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-brand-primary font-serif font-bold hover:underline flex items-center gap-0.5"
                    >
                      Read
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
