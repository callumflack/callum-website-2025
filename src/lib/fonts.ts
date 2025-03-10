import localFont from "next/font/local";

export const sans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/Sohne-Extraleicht.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Leicht.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Buch.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Kraftig.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Halbfett.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Dreiviertelfett.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sohne-Fett.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

export const mono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    {
      // public/fonts/IBMPlexMono-Medium.woff
      // path: "../../public/fonts/SohneMono-Buch.woff2",
      path: "../../public/fonts/GT-America-Mono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      // path: "../../public/fonts/SohneMono-Buch.woff2",
      path: "../../public/fonts/GT-America-Mono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});
