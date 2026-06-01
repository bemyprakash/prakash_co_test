"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Phone, Search, ChevronDown, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Our Story",  href: "/our-story" },
  { label: "Shop",       href: "/shop" },
  { label: "Reviews",    href: "/reviews" },
  { label: "Visit Us",   href: "/visit-us" },
  { label: "Blog",       href: "/blog" },
  { label: "Contact",    href: "/contact" },
];

interface NavbarProps {
  cartCount?: number;
}

export function Navbar({ cartCount = 0 }: NavbarProps) {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [count, setCount]               = useState(cartCount);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dynamic cart count sync
  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("prakashco_cart");
      if (stored) {
        try {
          const items = JSON.parse(stored);
          const totalQty = items.reduce((s: number, i: any) => s + (i.quantity || i.qty || 0), 0);
          setCount(totalQty);
        } catch {
          setCount(0);
        }
      } else {
        setCount(0);
      }
    };
    
    updateCount();
    
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);
    
    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setShopDropdown(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-deep text-white text-xs py-2 hidden md:block">
        <div className="container-heritage flex justify-between items-center">
          <span className="font-heritage italic tracking-wide text-sm opacity-90">
            "Serving Generations Since 1928"
          </span>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${process.env.NEXT_PUBLIC_STORE_PHONE}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{process.env.NEXT_PUBLIC_STORE_PHONE || "+91 XXXXXXXXXX"}</span>
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gold transition-colors"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white shadow-md border-b border-gray-100"
            : "bg-cream border-b border-brand-light"
        )}
      >
        <div className="container-heritage flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative w-12 h-12 lg:w-14 lg:h-14">
              <Image
                src="/images/logo.png"
                alt="A. Prakash & Co. Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-serif text-brand-deep text-lg lg:text-xl font-bold leading-tight">
                A. Prakash <span className="text-gold">&amp;</span> Co.
              </p>
              <p className="font-heritage text-xs text-muted tracking-[0.2em] uppercase">
                Since 1928
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) =>

              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-4 py-2.5 text-[15px] font-medium rounded-[8px] transition-colors",
                    "hover:text-brand-primary hover:bg-brand-light",
                    isActive(link.href)
                      ? "text-brand-primary font-semibold"
                      : "text-charcoal"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search — desktop */}
            <Link
              href="/search"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-[8px] hover:bg-brand-light text-charcoal hover:text-brand-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Auth Desktop */}
            {session ? (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 px-2 py-2 hover:bg-brand-light rounded-[8px] transition-colors">
                  <UserCircle className="w-5 h-5 text-charcoal" />
                  <span className="text-sm font-medium text-charcoal truncate max-w-[80px]">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-[8px] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {(session.user as any)?.role === "SUPER_ADMIN" || (session.user as any)?.role === "ADMIN" ? (
                    <Link href="/admin" className="block px-4 py-3 text-sm text-charcoal hover:bg-brand-light hover:text-brand-primary">
                      Admin Dashboard
                    </Link>
                  ) : null}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block text-sm font-medium text-charcoal hover:text-brand-primary px-3">
                Sign In
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-[8px] hover:bg-brand-light text-charcoal hover:text-brand-primary transition-colors"
              aria-label={`Cart (${count} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-brand-primary text-white text-[10px] font-bold rounded-full">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[8px] hover:bg-brand-light text-charcoal hover:text-brand-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container-heritage py-4 space-y-1">
              {NAV_LINKS.map((link) =>

                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-3 py-2.5 text-sm font-medium rounded-[8px] transition-colors",
                    isActive(link.href)
                      ? "bg-brand-light text-brand-primary font-semibold"
                      : "text-charcoal hover:bg-brand-light hover:text-brand-primary"
                  )}
                >
                  {link.label}
                </Link>
              )}

              {/* Mobile CTA */}
              <div className="pt-3 border-t border-gray-100 mt-3 flex flex-col gap-2">
                {session ? (
                  <>
                    <div className="px-3 py-2 text-sm text-charcoal font-medium">
                      Hi, {session.user?.name}
                    </div>
                    {((session.user as any)?.role === "SUPER_ADMIN" || (session.user as any)?.role === "ADMIN") && (
                      <Link href="/admin" className="block px-3 py-2.5 text-sm text-brand-primary font-medium hover:bg-brand-light rounded-[8px]">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-3 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-[8px]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block px-3 py-2.5 text-sm text-brand-primary font-medium hover:bg-brand-light rounded-[8px]">
                    Sign In
                  </Link>
                )}
                
                <Link
                  href="/shop"
                  className="btn-primary w-full justify-center text-xs py-2.5 mt-2"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
