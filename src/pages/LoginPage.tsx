import { Link } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { Navigate } from "react-router-dom";
import { SignIn } from "@/components/SignIn";
import { TestUserLoginSection } from "@/components/TestUserLoginSection";

export function LoginPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative min-h-screen bg-zinc-950">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 size-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-amber-500/3 blur-3xl" />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          {/* Logo */}
          <div className="mx-auto size-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
            <span className="text-black font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Login
          </h1>
          <p className="text-zinc-400 text-sm">
            MahaKarya Digital — Management Dashboard
          </p>
        </div>

        <TestUserLoginSection />
        <SignIn />

        <p className="text-center text-sm text-zinc-500">
          <Link to="/" className="hover:text-amber-400 transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
