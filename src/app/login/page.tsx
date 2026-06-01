"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Successfully logged in");
        router.push("/admin"); // Middleware will redirect to home if not admin
        router.refresh();
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
          <h2 className="font-serif text-3xl font-bold text-charcoal">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-brand-primary hover:text-brand-deep transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
