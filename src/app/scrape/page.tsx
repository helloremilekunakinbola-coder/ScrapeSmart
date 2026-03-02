"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, AlertCircle, Check, Link as LinkIcon, Image as ImageIcon, Heading, Globe, Search } from "lucide-react";
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
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0D1110]">
                <div className="relative w-32 h-32 flex items-center justify-center text-primary">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full z-10" />
                </div>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-2xl font-bold text-white tracking-wide">
                    Extracting Data
                </motion.h2>
                <p className="mt-3 text-slate-400">Parsing structure for target URI</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0D1110]">
                <div className="glass p-8 max-w-lg w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Extraction Failed</h2>
                    <p className="text-slate-400">{error}</p>
                    <button onClick={() => router.push(`/analyze?url=${encodeURIComponent(url as string)}`)} className="px-6 py-3 bg-[#1B2621] hover:bg-[#25352d] text-white rounded-xl transition-colors">
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
        <main className="min-h-screen flex flex-col p-4 md:p-8 relative overflow-x-hidden bg-[#0D1110]">
            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col space-y-8 z-10">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-block px-3 py-1 bg-[#102a20] text-primary border border-primary/20 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2">
                            Extraction Results
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Data Extracted Successfully</h1>
                        <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary/70 flex items-center gap-2 hover:text-primary transition-colors text-sm font-medium">
                            <Globe className="w-4 h-4" /> {data.url}
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push(`/analyze?url=${encodeURIComponent(url as string)}`)} className="p-3.5 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm">
                            <Search className="w-5 h-5" />
                        </button>
                        <button onClick={handleDownload} className="px-6 py-4 bg-primary hover:bg-[#2EE59D] text-[#022A1E] font-bold rounded-xl transition-all shadow-[0_4px_24px_rgba(52,211,153,0.2)] hover:shadow-[0_4px_32px_rgba(52,211,153,0.3)] flex items-center gap-3">
                            <Download className="w-5 h-5" strokeWidth={2.5} /> Download JSON
                        </button>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass flex-1 flex flex-col overflow-hidden bg-[#131A17] border-white/5 shadow-none">

                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-2 p-4 border-b border-white/5 overflow-x-auto no-scrollbar bg-[#0E1512]">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-200"}`}>
                                {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#162720] border-b-2 border-primary rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                                <span className="relative z-10 flex items-center gap-2">
                                    {tab.icon} {tab.label}
                                    <span className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400'}`}>
                                        {tab.count}
                                    </span>
                                </span>
                            </button>
                        ))}

                        <div className="ml-auto flex items-center pr-2">
                            <button onClick={handleCopy} className="px-5 py-2.5 bg-[#0B100E] hover:bg-[#14201A] border border-white/5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-slate-300 flex items-center gap-2">
                                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied" : "Copy Raw"}
                            </button>
                        </div>
                    </div>

                    {/* Tab Content Area */}
                    <div className="flex-1 overflow-auto p-0 md:p-6 bg-[#0B100E]">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full">
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
        <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-[#131A17]">
            <table className="w-full text-left text-sm">
                <thead className="bg-[#0B100E] text-primary/60 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                    <tr>
                        <th className="px-6 py-4 border-b border-white/5 w-1/3">Link Text</th>
                        <th className="px-6 py-4 border-b border-white/5">Destination URL</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                    {links.map((link, i) => (
                        <tr key={i} className="hover:bg-[#1A2621] transition-colors">
                            <td className="px-6 py-4 line-clamp-2 text-white font-medium">{link.text}</td>
                            <td className="px-6 py-4 text-primary max-w-lg truncate"><a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">{link.href}</a></td>
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
                <div key={i} className="bg-[#131A17] border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="aspect-square bg-[#0B100E] p-4 flex items-center justify-center relative">
                        <img src={img.src} alt={img.alt} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity rounded-xl" loading="lazy" />
                    </div>
                    <div className="p-4 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 truncate mb-1" title={img.src}>{img.src}</p>
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
        <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-[#131A17]">
            <table className="w-full text-left text-sm">
                <thead className="bg-[#0B100E] text-primary/60 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                    <tr>
                        <th className="px-6 py-4 border-b border-white/5 w-24">Level</th>
                        <th className="px-6 py-4 border-b border-white/5">Heading Text</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                    {headings.map((h, i) => (
                        <tr key={i} className="hover:bg-[#1A2621] transition-colors">
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-[#102a20] border border-primary/20 rounded font-mono text-[10px] uppercase font-bold text-primary">{h.tag}</span>
                            </td>
                            <td className="px-6 py-4 text-white font-medium">{h.text}</td>
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
                <div key={i} className="bg-[#131A17] border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-colors">
                    <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3">{key}</div>
                    <div className="text-[13px] text-slate-300 font-medium leading-relaxed break-words">{value}</div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#162720] rounded-2xl flex items-center justify-center text-primary mb-6">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No {label} Found</h3>
            <p className="text-sm text-slate-400">The engine could not identify any {label.toLowerCase()} embedded in the document.</p>
        </div>
    );
}

export default function ScrapePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4 bg-[#0D1110]"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <ScrapeContent />
        </Suspense>
    );
}
