"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Server, Code, FileText, Globe, Layers, Link as LinkIcon, Image as ImageIcon, CheckCircle, ArrowRight, Loader2, AlertCircle, Database } from "lucide-react";
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
        // Navigate to scrape configuration or directly to scrape results
        router.push(`/scrape?url=${encodeURIComponent(url as string)}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    className="mt-8 text-2xl font-semibold text-slate-300"
                >
                    Analyzing {url}...
                </motion.h2>
                <p className="mt-4 text-slate-400">Detecting technologies & scanning for entities</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="glass p-8 max-w-lg w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-400">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
                    <p className="text-slate-400">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <main className="min-h-screen p-4 md:p-8 lg:p-12 relative overflow-x-hidden">
            {/* Background gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-10 z-10">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary">
                            Site Analysis Complete
                        </h1>
                        <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 mt-2 flex items-center gap-2 hover:text-blue-400 transition-colors">
                            <Globe className="w-4 h-4" /> {data.url}
                        </a>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors"
                    >
                        Analyze Another Site
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="glass p-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Server className="w-5 h-5 text-blue-400" /> Technology Stack
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Frontend</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.techStack.frontend.map((tech, i) => (
                                            <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full h-px bg-white/5" />

                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Backend & Server</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-300">Server</span>
                                            <span className="text-white font-medium">{data.techStack.server}</span>
                                        </div>
                                        {data.techStack.poweredBy !== "Unknown" && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300">Powered By</span>
                                                <span className="text-white font-medium">{data.techStack.poweredBy}</span>
                                            </div>
                                        )}
                                        {data.techStack.isCloudflare && (
                                            <div className="flex items-center gap-2 text-orange-400 mt-2">
                                                <CheckCircle className="w-4 h-4" /> Protected by Cloudflare
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" /> Meta Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm text-slate-500 mb-1">Title</h3>
                                    <p className="text-slate-200 line-clamp-2">{data.title}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm text-slate-500 mb-1">Description</h3>
                                    <p className="text-slate-200 text-sm line-clamp-3">{data.description}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Entities & Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="glass p-6 md:p-8">
                            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                                <Layers className="w-6 h-6 text-primary" /> Extractable Entities
                            </h2>
                            <p className="text-slate-400 mb-8">We found the following data points available for extraction on this page.</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                                <EntityCard title="Links" count={data.entities.links} icon={<LinkIcon className="w-5 h-5" />} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                                <EntityCard title="Images" count={data.entities.images} icon={<ImageIcon className="w-5 h-5" />} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
                                <EntityCard title="Tables" count={data.entities.tables} icon={<Database className="w-5 h-5" />} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                                <EntityCard title="Paragraphs" count={data.entities.paragraphs} icon={<FileText className="w-5 h-5" />} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
                                <EntityCard title="Headings" count={data.entities.headings} icon={<Code className="w-5 h-5" />} color="text-rose-400" bg="bg-rose-500/10" border="border-rose-500/20" />
                                <EntityCard title="Lists" count={data.entities.lists} icon={<Layers className="w-5 h-5" />} color="text-cyan-400" bg="bg-cyan-500/10" border="border-cyan-500/20" />
                            </div>

                            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Ready to Extract?</h3>
                                        <p className="text-slate-300">Authorize the scraper to collect the discovered data.</p>
                                    </div>
                                    <button
                                        onClick={handleInitiateScrape}
                                        className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] flex items-center justify-center gap-3 shrink-0"
                                    >
                                        Initiate Scrape <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}

function EntityCard({ title, count, icon, color, bg, border }: { title: string, count: number, icon: React.ReactNode, color: string, bg: string, border: string }) {
    return (
        <div className={`flex flex-col gap-3 p-5 rounded-xl border ${border} ${bg} backdrop-blur-sm transition-transform hover:-translate-y-1`}>
            <div className={`flex items-center gap-2 ${color} font-medium`}>
                {icon}
                {title}
            </div>
            <div className="text-3xl font-bold text-white">{count}</div>
            <div className="text-xs text-slate-400">Found on page</div>
        </div>
    );
}

export default function AnalyzePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <AnalyzeContent />
        </Suspense>
    );
}
