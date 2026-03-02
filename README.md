# ScrapeSmart ✨

ScrapeSmart is an intelligent web scraper and site analysis tool built with modern web technologies. It allows you to enter any URL, dynamically analyzes the underlying technology stack, and visualizes the extractable entities before providing a seamless way to scrape and download the data.

## Features

- **Technology Stack Detection:** Intelligently detects frontend frameworks (React, Next.js, Vue, Angular, WordPress), backend technologies, server software, and CDNs (Cloudflare) using headers and DOM markers.
- **Pre-Scrape Entity Discovery:** Scans the target URL and provides a statistical breakdown of available entities (Links, Images, Headings, Paragraphs, Tables, and Metadata) before you commit to scraping.
- **Smart Extraction:** Extracts rich, structured data using `cheerio` for lightning-fast parsing.
- **Interactive UI:** Built with Next.js App Router, Tailwind CSS, and Framer Motion for a stunning, glassmorphism-inspired dark mode experience.
- **Export Capabilities:** Instantly copy scraped JSON to your clipboard or download it directly as a `.json` file for further data processing.

## Tech Stack

* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v4)
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **HTTP Client:** Axios
* **HTML Parsing:** Cheerio

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Navigate to the project directory:
   ```bash
   cd scraper-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Usage

1. Open the application in your browser.
2. Enter a valid URL (e.g., `https://example.com`) in the search bar and click **Analyze**.
3. View the discovered **Technology Stack** and the tally of **Extractable Entities**.
4. If satisfied with the discovery, click **Initiate Scrape**.
5. Browse the scraped data through the interactive tabs (Links, Images, Headings, Metadata).
6. Click **Download Full JSON** to save the structured data to your local machine.

## Limitations

- **Client-Side Rendering:** Currently, ScrapeSmart uses `cheerio` which does not execute JavaScript. If a website heavily relies on client-side rendering (like heavily obfuscated Single Page Applications without SSR), some dynamic content may not be detected.
- **Anti-Bot Protection:** Some websites actively block automated scrapers. ScrapeSmart attempts to bypass basic blocks using standard User-Agents, but sophisticated protections (like strict Cloudflare challenges or CAPTCHAs) may prevent analysis or scraping.

## License

This project is created for educational and utility purposes. Please respect the `robots.txt` and Terms of Service of the websites you scrape.
