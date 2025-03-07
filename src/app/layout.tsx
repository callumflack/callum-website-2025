import type { Metadata, Viewport } from "next";

import "../styles/globals.css";
// import localFont from "next/font/local";
import { sans, mono } from "@/lib/fonts";
import { cx } from "cva";
import config from "@/config";
import { Providers } from "./providers";
import { generateClampSize } from "@/lib/generate-clamp-size";

// See
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#twitter
// Jim's <head>: https://blog.jim-nielsen.com/2024/cold-blooded-software/
export const metadata: Metadata = {
  metadataBase: new URL(config.PUBLIC_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Callum Flack",
    template: "%s — Callum Flack",
  },
  description: "Designer who codes. Writes about creativity and process.",
};

// https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport: Viewport = {
  // Indicating multiple color schemes indicates that the first scheme is preferred by the document,
  // but that the second specified scheme is acceptable if the user prefers it.
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
  console.log(clampSizes);

  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={cx(sans.variable, mono.variable)}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export const clampSizes = {
  11: generateClampSize(500, 1200, 9, 11),
  12: generateClampSize(500, 1200, 10, 12),
  13: generateClampSize(500, 1200, 11, 13),
  14: generateClampSize(500, 1200, 11.5, 14),
  15: generateClampSize(500, 1200, 12, 15),
  16: generateClampSize(500, 1200, 14, 16),
  17: generateClampSize(500, 1200, 15, 17),
  18: generateClampSize(500, 1200, 16, 18),
  19: generateClampSize(500, 1200, 16, 19),
  20: generateClampSize(500, 1200, 17, 20),
  21: generateClampSize(500, 1200, 17, 21),
  22: generateClampSize(500, 1200, 17, 22),
  23: generateClampSize(500, 1200, 18, 23),
  24: generateClampSize(500, 1200, 20, 24),
  27: generateClampSize(500, 1200, 21, 27),
  28: generateClampSize(500, 1200, 21, 28),
  30: generateClampSize(500, 1200, 22, 30),
  32: generateClampSize(500, 1200, 22, 32),

  // spacers
  // lower value is 2/3 of upper value
  // w4: generateClampSize(500, 1200, 10.5, 16),
  // w6: generateClampSize(500, 1200, 16, 24),
  // w8: generateClampSize(500, 1200, 21, 32),
  // w12: generateClampSize(500, 1200, 32, 48),
  // w16: generateClampSize(500, 1200, 43, 64),
  // w20: generateClampSize(500, 1200, 54, 80),
  // w24: generateClampSize(500, 1200, 64, 96),
  // w28: generateClampSize(500, 1200, 75, 112),
  // w32: generateClampSize(500, 1200, 85, 128),
  // w36: generateClampSize(500, 1200, 96, 144),
  // w42: generateClampSize(500, 1200, 112, 168),
  // w48: generateClampSize(500, 1200, 128, 192),
  // w64: generateClampSize(500, 1200, 171, 256),
  // w72: generateClampSize(500, 1200, 192, 288),
  // w96: generateClampSize(500, 1200, 256, 384),

  // semantic spacers
  // gap: generateClampSize(500, 1200, 10.5, 16), // w4
  // small: generateClampSize(500, 1200, 16, 24), // w8
  // minor: generateClampSize(500, 1200, 32, 48), // w12
  // submajor: generateClampSize(500, 1200, 54, 80), // w20
  // major: generateClampSize(500, 1200, 64, 96), // w24
};
