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

    let targetUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      targetUrl = `https://${url}`;
    }

    setIsLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(targetUrl)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0D1110]">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#102A20]/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl w-full space-y-16 z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center p-4 bg-[#131A17] border border-white/5 shadow-xl rounded-[20px] mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
            Intelligent <span className="text-primary">Site Analysis</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Analyze any website's underlying stack and effortlessly extract structured data with precision. Enter a URL below to begin the scan.
          </p>
        </motion.div>

        {/* Search Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <form onSubmit={handleAnalyze} className="relative group mx-auto max-w-2xl">
            {/* Ambient glow container */}
            <div className="absolute -inset-2 bg-primary/10 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500" />

            <div className="relative flex items-center bg-[#131A17] border border-white/10 p-2.5 rounded-[24px] shadow-2xl">
              <Search className="w-6 h-6 text-primary ml-4 hidden sm:block" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://target-domain.com"
                className="w-full bg-transparent border-none outline-none text-white px-5 py-4 text-lg placeholder:text-slate-500 focus:ring-0"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-primary hover:bg-[#2EE59D] text-[#022A1E] font-bold rounded-[16px] transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(52,211,153,0.2)] hover:shadow-[0_4px_32px_rgba(52,211,153,0.3)] shrink-0"
              >
                {isLoading ? "Scanning" : "Analyze"}
                {!isLoading ? <ArrowRight className="w-5 h-5" strokeWidth={3} /> : <div className="w-4 h-4 border-2 border-[#022A1E] border-t-transparent rounded-full animate-spin" />}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 max-w-3xl mx-auto"
        >
          <div className="bg-[#131A17] border border-white/5 p-8 rounded-[24px] flex flex-col gap-6 hover:border-primary/20 hover:bg-[#14201A] transition-colors group">
            <div className="w-14 h-14 bg-[#0A1410] border border-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Tech Stack Detection</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Automatically identify frontend frameworks, backend servers, and WAF protections used by the target site.</p>
            </div>
          </div>

          <div className="bg-[#131A17] border border-white/5 p-8 rounded-[24px] flex flex-col gap-6 hover:border-primary/20 hover:bg-[#14201A] transition-colors group">
            <div className="w-14 h-14 bg-[#0A1410] border border-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Extraction</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Discover extractable entities like images, links, tables, and structured data automatically.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
