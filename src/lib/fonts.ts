import localFont from "next/font/local";

export const sans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/NeueHaasUnicaW1G.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NeueHaasUnicaW1GItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/NeueHaasUnicaW1GMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/NeueHaasUnicaW1GBold.woff2",
      weight: "700",
      style: "normal",
    },
    // No 800 weight: nothing in src/ or posts/ uses font-extrabold, so
    // NeueHaasUnicaW1GHeavy.woff2 stays in the repo but out of the preload set.
  ],
});

export const mono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/PaperMono[wght].woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});
