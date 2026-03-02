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
        // 1. Fetch the URL
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 10000,
        });

        const html = response.data;
        const headers = response.headers;
        const $ = cheerio.load(html);

        // 2. Detect Backend & Server Tech from Headers
        const server = headers["server"] || "Unknown";
        const poweredBy = headers["x-powered-by"] || "Unknown";
        const isCloudflare = server.toLowerCase().includes("cloudflare");

        // 3. Detect Frontend Tech from HTML
        const frontendTech: string[] = [];

        // Check for common framework markers
        if ($("#__next").length > 0 || $("script[id='__NEXT_DATA__']").length > 0) {
            frontendTech.push("Next.js");
            frontendTech.push("React");
        } else if ($("[data-reactroot], #root").length > 0) {
            frontendTech.push("React");
        }

        if ($("#app").length > 0 || $("[data-v-app]").length > 0) {
            frontendTech.push("Vue.js");
        }

        if ($("app-root").length > 0 || $("[ng-version]").length > 0) {
            frontendTech.push("Angular");
        }

        if ($("meta[name='generator'][content*='WordPress']").length > 0 || html.includes("wp-content/themes")) {
            frontendTech.push("WordPress");
        }

        if (html.includes("cdn.tailwindcss.com") || html.includes("tailwind")) {
            frontendTech.push("Tailwind CSS");
        }

        if ($("script[src*='jquery']").length > 0) {
            frontendTech.push("jQuery");
        }

        if (frontendTech.length === 0) {
            frontendTech.push("Vanilla HTML/JS (or undetected)");
        }

        // 4. Discover Scrapable Entities
        const entities = {
            links: $("a[href]").length,
            images: $("img[src]").length,
            tables: $("table").length,
            paragraphs: $("p").length,
            headings: $("h1, h2, h3, h4, h5, h6").length,
            lists: $("ul, ol").length,
        };

        // 5. Title & Meta
        const title = $("title").text() || "No title found";
        const description = $("meta[name='description']").attr("content") || "No description found";

        return NextResponse.json({
            success: true,
            data: {
                url,
                title,
                description,
                techStack: {
                    server,
                    poweredBy,
                    isCloudflare,
                    frontend: [...new Set(frontendTech)], // remove duplicates
                },
                entities,
            },
        });
    } catch (error: any) {
        console.error("Scraping error:", error.message);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to analyze URL. The site might be blocking scrapers or is currently down.",
                details: error.message
            },
            { status: 500 }
        );
    }
}
