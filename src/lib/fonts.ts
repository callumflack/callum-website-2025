import localFont from "next/font/local";

const sans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/neue-haas-unica-pro-regular.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/neue-haas-unica-pro-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/neue-haas-unica-pro-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/neue-haas-unica-pro-medium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/neue-haas-unica-pro-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/neue-haas-unica-pro-bold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

const mono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/SohneMono-Buch.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

export { mono, sans };
