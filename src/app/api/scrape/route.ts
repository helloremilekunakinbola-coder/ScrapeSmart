import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 10000,
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Extract Links (clean & resolved if possible, but basic href extraction is fine for now)
        const links: { text: string; href: string }[] = [];
        $("a").each((_, element) => {
            const href = $(element).attr("href");
            const text = $(element).text().trim().replace(/\s+/g, ' ');
            if (href) links.push({ text: text || "[No Text]", href });
        });

        // Extract Images
        const images: { src: string; alt: string }[] = [];
        $("img").each((_, element) => {
            const src = $(element).attr("src") || $(element).attr("data-src");
            const alt = $(element).attr("alt")?.trim();
            if (src) images.push({ src, alt: alt || "[No Alt Text]" });
        });

        // Extract Headings
        const headings: { tag: string; text: string }[] = [];
        $("h1, h2, h3, h4, h5, h6").each((_, element) => {
            headings.push({
                tag: element.tagName.toUpperCase(),
                text: $(element).text().trim().replace(/\s+/g, ' '),
            });
        });

        // Extract Metadata
        const meta: Record<string, string> = {};
        $("meta").each((_, element) => {
            const name = $(element).attr("name") || $(element).attr("property");
            const content = $(element).attr("content");
            if (name && content) {
                meta[name] = content;
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                url,
                extracts: {
                    links,
                    images,
                    headings,
                    meta
                }
            },
        });
    } catch (error: any) {
        console.error("Scraping error:", error.message);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to scrape the URL.",
                details: error.message
            },
            { status: 500 }
        );
    }
}
