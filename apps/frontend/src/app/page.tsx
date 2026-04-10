import Link from "next/link";
import { ArrowRight, LayoutDashboard, Database, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Simple Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b dark:border-zinc-800">
        <span className="text-xl font-bold tracking-tight">JobTracker</span>
        <Link 
          href="/login" 
          className="text-sm font-medium hover:text-indigo-600 transition-colors"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50">
            Organize your <span className="text-indigo-600">career move.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Stop using messy spreadsheets. Track applications, manage contacts, 
            and visualize your interview progress in one powerful dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25"
            >
              Get Started for Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl">
          <FeatureCard 
            icon={<LayoutDashboard className="w-6 h-6 text-indigo-600" />}
            title="Visual Pipeline"
            description="Track every stage from Wishlist to Offer with clear status badges."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-indigo-600" />}
            title="Real-time Stats"
            description="Automatic calculation of interview and offer rates powered by Redis."
          />
          <FeatureCard 
            icon={<Database className="w-6 h-6 text-indigo-600" />}
            title="Centralized Data"
            description="Keep recruiters, company notes, and reminders in one secure place."
          />
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-zinc-500 border-t dark:border-zinc-800">
        © 2026 JobTracker Monorepo. Built with Next.js & Prisma.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-left space-y-3">
      {icon}
      <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
