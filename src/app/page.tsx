"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Activity, Code2, Database, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Simple validation
    let targetUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      targetUrl = `https://${url}`;
    }

    setIsLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(targetUrl)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl w-full space-y-12 z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-400">
            Intelligent Web Scraper
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Instantly analyze any website's technology stack and extract structured data with precision. Enter a URL to begin the deep scan.
          </p>
        </motion.div>

        {/* Search Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <form onSubmit={handleAnalyze} className="relative group mx-auto max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

            <div className="relative flex items-center glass p-2 rounded-2xl">
              <Search className="w-6 h-6 text-slate-400 ml-4 hidden sm:block" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-transparent border-none outline-none text-slate-200 px-4 py-4 text-lg placeholder:text-slate-500 focus:ring-0"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-4 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Analyzing..." : "Analyze"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12"
        >
          <div className="glass p-8 flex flex-col gap-4 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Tech Stack Detection</h3>
            <p className="text-slate-400">Automatically identify frontend frameworks, backend servers, and analytics tools used by the target site.</p>
          </div>

          <div className="glass p-8 flex flex-col gap-4 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Smart Extraction</h3>
            <p className="text-slate-400">Discover extractable entities like images, links, or text automatically. Choose what to scrape and export easily.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

