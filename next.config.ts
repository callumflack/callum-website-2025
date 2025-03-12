import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.callumflack.design",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cfd-media.b-cdn.net",
        port: "",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/blog/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/get-cleared",
        destination: "/cleared",
        permanent: true,
      },
      {
        source: "/the-first-principle-website",
        destination: "/the-first-principle",
        permanent: true,
      },
      {
        source: "/archive",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/shelf",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/what-i-want",
        destination: "/the-work-and-team-im-after",
        permanent: true,
      },
    ];
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
