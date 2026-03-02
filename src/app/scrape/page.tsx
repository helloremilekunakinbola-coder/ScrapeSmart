"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, AlertCircle, ArrowLeft, Check, Link as LinkIcon, Image as ImageIcon, Heading, Globe } from "lucide-react";
import axios from "axios";

type ScrapeResult = {
    url: string;
    extracts: {
        links: { text: string; href: string }[];
        images: { src: string; alt: string }[];
        headings: { tag: string; text: string }[];
        meta: Record<string, string>;
    };
};

type TabType = "links" | "images" | "headings" | "meta";

function ScrapeContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get("url");
    const router = useRouter();

    const [data, setData] = useState<ScrapeResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("links");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!url) {
            router.push("/");
            return;
        }

        const fetchScrapedData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/scrape?url=${encodeURIComponent(url)}`);
                if (res.data.success) {
                    setData(res.data.data);
                } else {
                    setError(res.data.error || "Unknown error occurred");
                }
            } catch (err: any) {
                setError(err.response?.data?.error || err.message || "Failed to scrape URL");
            } finally {
                setLoading(false);
            }
        };

        fetchScrapedData();
    }, [url, router]);

    const handleCopy = () => {
        if (!data) return;
        navigator.clipboard.writeText(JSON.stringify(data.extracts[activeTab], null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!data) return;
        const blob = new Blob([JSON.stringify(data.extracts, null, 2)], { type: "application/json" });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `scrape-${new URL(url!).hostname}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full z-10"
                    />
                    <motion.div
                        animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-16 h-16 bg-primary/20 rounded-full blur-xl"
                    />
                </div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-2xl font-semibold text-white tracking-wide"
                >
                    Extracting Data
                </motion.h2>
                <p className="mt-3 text-slate-400">Please wait while we parse {url}</p>
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
                    <h2 className="text-2xl font-bold text-white">Extraction Failed</h2>
                    <p className="text-slate-400">{error}</p>
                    <button
                        onClick={() => router.push(`/analyze?url=${encodeURIComponent(url as string)}`)}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                    >
                        Back to Analysis
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const tabs: { id: TabType; label: string; icon: React.ReactNode; count: number }[] = [
        { id: "links", label: "Links", icon: <LinkIcon className="w-4 h-4" />, count: data.extracts.links.length },
        { id: "images", label: "Images", icon: <ImageIcon className="w-4 h-4" />, count: data.extracts.images.length },
        { id: "headings", label: "Headings", icon: <Heading className="w-4 h-4" />, count: data.extracts.headings.length },
        { id: "meta", label: "Metadata", icon: <Globe className="w-4 h-4" />, count: Object.keys(data.extracts.meta).length },
    ];

    return (
        <main className="min-h-screen flex flex-col p-4 md:p-8 relative overflow-x-hidden">
            {/* Background gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col space-y-8 z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass p-6"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(`/analyze?url=${encodeURIComponent(url as string)}`)}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Extraction Results</h1>
                            <p className="text-sm text-slate-400 mt-1 max-w-xl truncate">{data.url}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" /> Download Full JSON
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass flex-1 flex flex-col overflow-hidden"
                >
                    {/* Tabs Navigation */}
                    <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {tab.icon} {tab.label}
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-primary/30' : 'bg-white/10'}`}>
                                        {tab.count}
                                    </span>
                                </span>
                            </button>
                        ))}

                        <div className="ml-auto flex items-center pr-2">
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors text-slate-300 hover:text-white flex items-center gap-2"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Details"}
                            </button>
                        </div>
                    </div>

                    {/* Tab Content Area */}
                    <div className="flex-1 overflow-auto p-0 md:p-6 bg-black/20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
                            >
                                {activeTab === "links" && <LinksTable links={data.extracts.links} />}
                                {activeTab === "images" && <ImagesGrid images={data.extracts.images} />}
                                {activeTab === "headings" && <HeadingsTable headings={data.extracts.headings} />}
                                {activeTab === "meta" && <MetaTable meta={data.extracts.meta} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </motion.div>

            </div>
        </main>
    );
}

function LinksTable({ links }: { links: { text: string; href: string }[] }) {
    if (links.length === 0) return <EmptyState label="Links" />;
    return (
        <div className="w-full rounded-xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                    <tr>
                        <th className="px-6 py-4 font-medium border-b border-white/10 w-1/3">Link Text</th>
                        <th className="px-6 py-4 font-medium border-b border-white/10">Destination URL</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {links.map((link, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4 text-white line-clamp-2">{link.text}</td>
                            <td className="px-6 py-4 text-blue-400 hover:underline max-w-lg truncate">
                                <a href={link.href} target="_blank" rel="noopener noreferrer">{link.href}</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ImagesGrid({ images }: { images: { src: string; alt: string }[] }) {
    if (images.length === 0) return <EmptyState label="Images" />;
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-0">
            {images.map((img, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                    <div className="aspect-square bg-slate-900/50 p-4 flex items-center justify-center relative">
                        <img src={img.src} alt={img.alt} className="object-contain max-w-full max-h-full opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
                    </div>
                    <div className="p-4 border-t border-white/10">
                        <p className="text-xs text-slate-400 truncate mb-1" title={img.src}>{img.src}</p>
                        <p className="text-sm text-white font-medium truncate" title={img.alt}>{img.alt}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function HeadingsTable({ headings }: { headings: { tag: string; text: string }[] }) {
    if (headings.length === 0) return <EmptyState label="Headings" />;
    return (
        <div className="w-full rounded-xl overflow-hidden border border-white/10">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                    <tr>
                        <th className="px-6 py-4 font-medium border-b border-white/10 w-24">Level</th>
                        <th className="px-6 py-4 font-medium border-b border-white/10">Heading Text</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {headings.map((h, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300 font-mono">{h.tag}</span>
                            </td>
                            <td className="px-6 py-4 text-white">{h.text}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function MetaTable({ meta }: { meta: Record<string, string> }) {
    const entries = Object.entries(meta);
    if (entries.length === 0) return <EmptyState label="Metadata" />;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map(([key, value], i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                    <div className="text-xs text-primary font-mono mb-2 bg-primary/10 px-2 py-1 inline-block rounded">{key}</div>
                    <div className="text-sm text-slate-200 font-medium break-words">{value}</div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-500 mb-4">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No {label} Found</h3>
            <p className="text-slate-400">The scraper couldn't find any {label.toLowerCase()} on this page.</p>
        </div>
    );
}

export default function ScrapePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <ScrapeContent />
        </Suspense>
    );
}
