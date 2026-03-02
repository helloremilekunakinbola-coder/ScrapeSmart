"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Globe, Link as LinkIcon, Image as ImageIcon, CheckCircle, ArrowRight, AlertCircle, Database, Code, FileText, List } from "lucide-react";
import { Layers } from "lucide-react";
import axios from "axios";

type AnalysisResult = {
    url: string;
    title: string;
    description: string;
    techStack: {
        server: string;
        poweredBy: string;
        isCloudflare: boolean;
        frontend: string[];
    };
    entities: {
        links: number;
        images: number;
        tables: number;
        paragraphs: number;
        headings: number;
        lists: number;
    };
};

function AnalyzeContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get("url");
    const router = useRouter();

    const [data, setData] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) {
            router.push("/");
            return;
        }

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/analyze?url=${encodeURIComponent(url)}`);
                if (res.data.success) {
                    setData(res.data.data);
                } else {
                    setError(res.data.error || "Unknown error occurred");
                }
            } catch (err: any) {
                setError(err.response?.data?.error || err.message || "Failed to analyze URL");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [url, router]);

    const handleInitiateScrape = () => {
        router.push(`/scrape?url=${encodeURIComponent(url as string)}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    className="mt-8 text-xl font-semibold text-slate-300"
                >
                    Analyzing target domain...
                </motion.h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="glass p-8 max-w-lg w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
                    <p className="text-slate-400">{error}</p>
                    <button onClick={() => router.push("/")} className="px-6 py-3 bg-[#1B2621] hover:bg-[#25352d] text-white rounded-xl transition-colors">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <main className="min-h-screen p-4 md:p-8 lg:p-12 font-sans overflow-x-hidden text-slate-300">
            <div className="max-w-7xl mx-auto space-y-10 z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                    <div className="space-y-3">
                        <div className="inline-block px-3 py-1 bg-[#102a20] text-primary border border-primary/20 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2">
                            Analysis Complete
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Site Analysis Result
                        </h1>
                        <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary/70 flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium">
                            <Globe className="w-4 h-4" /> {data.url}
                        </a>
                    </div>
                    <button onClick={() => router.push("/")} className="px-5 py-2.5 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-sm transition-all font-medium flex items-center gap-2 text-white shadow-sm">
                        <SearchIcon className="w-4 h-4 text-slate-400" /> Analyze Another Site
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-4 space-y-6">

                        {/* Technology Stack Card */}
                        <div className="glass p-6 md:p-8">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-3 text-white">
                                <div className="w-8 h-8 rounded-lg bg-[#142921] text-primary flex items-center justify-center">
                                    <Layers className="w-4 h-4" />
                                </div>
                                Technology Stack
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-bold text-primary/60 mb-3 uppercase tracking-widest">Frontend</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.techStack.frontend.map((tech, i) => (
                                            <span key={i} className="px-4 py-1.5 bg-[#0A1410] border border-white/5 text-slate-300 rounded-lg text-xs font-semibold">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full h-px bg-white/5" />

                                <div>
                                    <h3 className="text-[10px] font-bold text-primary/60 mb-3 uppercase tracking-widest">Backend & Infrastructure</h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 text-sm">Server</span>
                                                {data.techStack.server !== "Unknown" ? (
                                                    <span className="text-primary text-[10px] font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">{data.techStack.server}</span>
                                                ) : (
                                                    <span className="text-slate-500 text-xs">Unknown</span>
                                                )}
                                            </div>
                                        </div>

                                        {data.techStack.isCloudflare && (
                                            <div className="flex items-center gap-2 text-primary text-xs font-medium bg-[#0A1410] border border-primary/20 px-4 py-3 rounded-xl mt-2">
                                                <CheckCircle className="w-4 h-4" /> Protected by Advanced WAF
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Meta Information Card */}
                        <div className="glass p-6 md:p-8">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-3 text-white">
                                <div className="w-8 h-8 rounded-lg bg-[#142921] text-primary flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 fill-primary text-[#142921]" />
                                </div>
                                Meta Information
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-bold text-primary/60 mb-2 uppercase tracking-widest">SEO Title</h3>
                                    <p className="text-white text-sm font-semibold pr-4 leading-relaxed">{data.title}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-primary/60 mb-2 uppercase tracking-widest">Meta Description</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{data.description}</p>
                                </div>
                            </div>
                        </div>

                    </motion.div>

                    {/* Right Column: Entities */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-8 space-y-6">
                        <div className="glass p-6 md:p-8 border-none bg-[#111614]">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-white mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#142921] text-primary flex items-center justify-center">
                                        <Database className="w-4 h-4" />
                                    </div>
                                    Extractable Entities
                                </h2>
                                <p className="text-slate-500 text-sm ml-11">Discovered data objects optimized for structured JSON extraction.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                <EntityCard title="Links" count={data.entities.links} icon={<LinkIcon className="w-4 h-4" />} sub="Total internal/external" />
                                <EntityCard title="Images" count={data.entities.images} icon={<ImageIcon className="w-4 h-4" />} sub="Compressed assets" />
                                <EntityCard title="Tables" count={data.entities.tables} icon={<Database className="w-4 h-4" />} sub="Data grids found" />
                                <EntityCard title="Paragraphs" count={data.entities.paragraphs} icon={<FileText className="w-4 h-4" />} sub="Content blocks" />
                                <EntityCard title="Headings" count={data.entities.headings} icon={<Code className="w-4 h-4" />} sub="Semantic structure" />
                                <EntityCard title="Lists" count={data.entities.lists} icon={<List className="w-4 h-4" />} sub="Unordered/Ordered" />
                            </div>

                            <div className="bg-gradient-to-br from-[#0B2A1E] to-[#0A1A14] rounded-[24px] p-8 mt-4 border border-primary/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                                {/* Abstract shape background */}
                                <div className="absolute -right-10 -bottom-10 opacity-10">
                                    <Layers className="w-64 h-64 text-primary" />
                                </div>
                                <div className="relative z-10 max-w-sm">
                                    <h3 className="text-3xl font-black text-white mb-3">Ready to Extract?</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">Process the discovered entities into a cleaned, structured CSV or JSON dataset.</p>
                                </div>
                                <button
                                    onClick={handleInitiateScrape}
                                    className="relative z-10 w-full md:w-auto px-8 py-5 bg-primary hover:bg-[#2EE59D] text-[#022A1E] font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shrink-0 shadow-[0_4px_24px_rgba(52,211,153,0.2)] hover:shadow-[0_4px_32px_rgba(52,211,153,0.3)] hover:-translate-y-1"
                                >
                                    Initiate Scrape <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                </button>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                <div className="h-px bg-white/5 w-16"></div>
                                <CheckCircle className="w-3 h-3 text-primary" /> SECURE END-TO-END EXTRACTION
                                <div className="h-px bg-white/5 w-16"></div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Context action button (bottom right) */}
            <div className="fixed bottom-8 right-8">
                <button className="w-12 h-12 bg-[#1A231E] border border-white/5 rounded-2xl flex items-center justify-center hover:bg-[#202E27] transition-all text-primary hover:-translate-y-1 shadow-xl">
                    <div className="w-4 h-4 bg-primary rounded-sm" />
                </button>
            </div>
        </main>
    );
}

function EntityCard({ title, count, icon, sub }: { title: string, count: number, icon: React.ReactNode, sub: string }) {
    return (
        <div className="bg-[#0B100E] border border-white/5 rounded-2xl p-6 transition-all hover:border-primary/20 hover:bg-[#0D1512] group">
            <div className="flex items-center justify-between mb-8">
                <div className="text-primary">
                    {icon}
                </div>
                <div className="text-[9px] text-primary/60 font-bold uppercase tracking-widest">
                    {title}
                </div>
            </div>
            <div className="text-4xl font-black text-white mb-2">{count}</div>
            <div className="text-[11px] text-slate-500">{sub}</div>
        </div>
    );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    )
}

export default function AnalyzePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4 bg-[#0D1110]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <AnalyzeContent />
        </Suspense>
    );
}
