import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeritageDivider } from "@/components/heritage/HeritageDivider";
import { Calendar, User, Clock, ArrowLeft, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${title} | Heritage Blog`,
    description: `Read about ${title} on the official A. Prakash & Co. heritage blog.`,
  };
}

const POSTS: Record<
  string,
  {
    title: string;
    date: string;
    readTime: string;
    author: string;
    category: string;
    cover: string;
    content: React.ReactNode;
    relatedProductSlug?: string;
    relatedProductLabel?: string;
  }
> = {
  "guide-brewing-darjeeling-first-flush": {
    title: "The Connoisseur's Guide to Brewing Darjeeling First Flush",
    date: "May 24, 2026",
    readTime: "4 mins read",
    author: "Pranav Prakash",
    category: "Tea Guides",
    cover: "🍃",
    relatedProductSlug: "darjeeling-first-flush-tea",
    relatedProductLabel: "Darjeeling First Flush Tea",
    content: (
      <div className="space-y-6 text-sm text-charcoal leading-relaxed">
        <p className="font-serif italic text-base text-brand-primary">
          Darjeeling First Flush, often called the &ldquo;Champagne of Teas,&rdquo; is the highly anticipated spring harvest. To truly unlock its floral, muscatel aromatics, one must brew it with absolute precision.
        </p>
        
        <h2 className="font-serif text-lg font-bold border-b pb-2">1. The Temperature Rule</h2>
        <p>
          Unlike robust black teas which demand boiling water, the young, tender leaves of the first flush are extremely delicate. Using boiling water will scald the leaves, resulting in a bitter cup.
        </p>
        <p className="bg-cream p-4 rounded-sm border border-brand-primary/10">
          ✨ <strong>Ideal Temperature:</strong> Heat fresh water to precisely <strong>80°C – 85°C</strong> (allow fully boiling water to sit off the heat for 2 minutes).
        </p>

        <h2 className="font-serif text-lg font-bold border-b pb-2">2. Timing Your Steep</h2>
        <p>
          Steeping too long will release excess tannins. We recommend a short, precise steep to preserve the bright floral liquor.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>First Infusion:</strong> 3 Minutes exactly.</li>
          <li><strong>Second Infusion:</strong> 4 Minutes (yes, quality leaves can be infused twice!).</li>
        </ul>

        <h2 className="font-serif text-lg font-bold border-b pb-2">3. Servings Guidelines</h2>
        <p>
          Always enjoy your Darjeeling First Flush black — without milk, sugar, or lemon. The complex flavor profile is complete on its own.
        </p>
      </div>
    ),
  },
  "curing-mountain-cheddar-altitude-cellars": {
    title: "Curing Mountain Cheddar in Natural High-Altitude Cellars",
    date: "April 15, 2026",
    readTime: "6 mins read",
    author: "Anoop Prakash",
    category: "Artisan Cheese",
    cover: "🧀",
    relatedProductSlug: "artisan-aged-cheddar",
    relatedProductLabel: "Artisan Aged Cheddar Block",
    content: (
      <div className="space-y-6 text-sm text-charcoal leading-relaxed">
        <p className="font-serif italic text-base text-brand-primary">
          Deep within the misty valleys of Kurseong, our family has slow-cured artisan cheese blocks in traditional high-altitude cellars since 1950.
        </p>
        
        <h2 className="font-serif text-lg font-bold border-b pb-2">1. The Raw Meadow Advantage</h2>
        <p>
          The secret to rich cheese is raw milk sourced from grass-fed cows residing in high-altitude mountain meadows. Their organic diet gives our cheese its rich, cream-yellow hue.
        </p>

        <h2 className="font-serif text-lg font-bold border-b pb-2">2. The Cold Rock Ageing</h2>
        <p>
          We mature our large cheddar blocks inside natural stone lockers. The constant, natural humidity and cold temperatures of 12°C allow the cheese to dry-cure slowly, forming beautiful salt crystals and deep, sharp aromas.
        </p>

        <h2 className="font-serif text-lg font-bold border-b pb-2">3. Ideal Pairings</h2>
        <p>
          Enjoy our aged cheddar sliced thin on warm crackers, paired with wild mountain wildflower honey or Seville orange preserves.
        </p>
      </div>
    ),
  },
  "preservation-art-seville-orange-marmalade": {
    title: "The Preservation Art: Authentic 1930s Seville Orange Marmalade",
    date: "March 20, 2026",
    readTime: "5 mins read",
    author: "P. S. Prakash",
    category: "Preserves recipes",
    cover: "🍊",
    relatedProductSlug: "heritage-orange-marmalade",
    relatedProductLabel: "Heritage Orange Marmalade Jar",
    content: (
      <div className="space-y-6 text-sm text-charcoal leading-relaxed">
        <p className="font-serif italic text-base text-brand-primary">
          Our Seville Orange Marmalade is hand-prepared using the exact 1930s recipe created by our founders.
        </p>
        
        <h2 className="font-serif text-lg font-bold border-b pb-2">1. Hand-Cutting the Citrus Peels</h2>
        <p>
          Standard commercial marmalades grind their fruits. At A. Prakash & Co., we slice every Seville orange peel by hand to give this conserve its beautiful, chunky look and crunchy bite.
        </p>

        <h2 className="font-serif text-lg font-bold border-b pb-2">2. Copper Pan Slow Simmering</h2>
        <p>
          Slow heat is crucial. We simmer fresh juice, cane sugar, and hand-cut peels in heavy traditional pans, ensuring the citrus pectin caramelizes naturally without any chemical colors or preservatives.
        </p>

        <h2 className="font-serif text-lg font-bold border-b pb-2">3. The Perfect Morning Spread</h2>
        <p>
          The result is a gorgeous, translucent gold preserve balancing bitter-sweet citrus oil notes. Best enjoyed on buttered sourdough bread!
        </p>
      </div>
    ),
  },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--cream)" }} className="pb-16">
        {/* Back Link */}
        <div className="container-heritage pt-8 max-w-4xl">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Content Layout Grid */}
        <div className="container-heritage py-6 max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Content */}
          <article
            className="lg:col-span-8 bg-white rounded-sm p-6 md:p-10 shadow-sm border space-y-6"
            style={{ borderColor: "rgba(10,155,75,0.08)" }}
          >
            {/* Header info */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider text-brand-primary bg-brand-light">
                {post.category}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> By {post.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
              </div>
              <HeritageDivider color="gold" size="sm" className="justify-start mt-2" />
            </div>

            {/* Cover Illustration */}
            <div
              className="aspect-video w-full rounded-sm flex items-center justify-center text-7xl select-none"
              style={{ background: "var(--brand-light)" }}
            >
              {post.cover}
            </div>

            {/* Main content body */}
            <div className="pt-4">{post.content}</div>
          </article>

          {/* Related E-Commerce Product Sidebar */}
          {post.relatedProductSlug && (
            <aside className="lg:col-span-4 space-y-4 sticky top-24">
              <div
                className="bg-white p-5 rounded-sm border shadow-sm space-y-4"
                style={{ borderColor: "rgba(10,155,75,0.12)" }}
              >
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-brand-primary uppercase pb-2 border-b">
                  <ShoppingBag className="w-4 h-4" /> Related Heritage Item
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-charcoal text-sm leading-snug">
                    {post.relatedProductLabel}
                  </h3>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Sourced directly from our family estates and hand-packed with care since 1928.
                  </p>
                </div>
                <Link
                  href={`/shop/${post.relatedProductSlug}`}
                  className="btn-primary w-full justify-center text-xs py-2 flex items-center gap-1 cursor-pointer"
                >
                  View in Shop
                </Link>
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
