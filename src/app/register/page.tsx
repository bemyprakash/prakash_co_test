"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to register");
      } else {
        toast.success("Account created! Please log in.");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-[8px] shadow-sm border border-gray-100/50">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-charcoal">Create Account</h2>
          <p className="mt-2 text-sm text-muted">
            Join the A. Prakash & Co. family
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-heritage w-full bg-gray-50 focus:bg-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-heritage w-full bg-gray-50 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-heritage w-full bg-gray-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center py-3 text-sm flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-primary hover:text-brand-deep transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
