import config from "@/config";
import { mono, sans } from "@/lib/fonts";
import { cx } from "cva";
import type { Metadata, Viewport } from "next";
import PlausibleProvider from "next-plausible";
import "../styles/globals.css";
import { Providers } from "./providers";

// See
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#twitter
// Jim's <head>: https://blog.jim-nielsen.com/2024/cold-blooded-software/
export const metadata: Metadata = {
  metadataBase: new URL(config.PUBLIC_URL),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${config.PUBLIC_URL}/feed.xml`,
    },
  },
  title: {
    default: "Callum Flack",
    template: "%s — Callum Flack",
  },
  description: "Designer who codes. Writes about creativity and process.",
};

// https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport: Viewport = {
  // Indicating multiple color schemes indicates that the first scheme is preferred by the document, but that the second specified scheme is acceptable if the user prefers it.
  // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name
  colorScheme: "light dark",
  // Customize the surrounding browser chrome UI
  // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* https://github.com/4lejandrito/next-plausible */}
        <PlausibleProvider domain={config.PUBLIC_DOMAIN} trackOutboundLinks />
      </head>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={cx(sans.variable, mono.variable)}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
