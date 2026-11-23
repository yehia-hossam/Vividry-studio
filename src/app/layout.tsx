import type { Metadata, Viewport } from "next";
import { DM_Mono, Fraunces, Oswald } from "next/font/google";
import { site } from "@/config/site";
import { theme } from "@/config/theme";
import { themeCssVars } from "@/lib/theme";
import { StoreProvider } from "@/components/providers/StoreProvider";
import "./globals.css";
import "./gallery.css";
import "./sections.css";
import "./overlays.css";

const display = Oswald({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display", display: "swap" });
const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], variable: "--font-serif", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: { title: site.title, description: site.description, type: "website", siteName: site.name },
};
export const viewport: Viewport = { themeColor: theme.colors.wall, width: "device-width", initialScale: 1 };

// Runs before first paint: enables the intro animation + scroll reveals only when JS is available.
const boot = `document.documentElement.classList.add('js','intro-pending')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={themeCssVars()} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: boot }} /></head>
      <body className={`${display.variable} ${serif.variable} ${mono.variable}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
