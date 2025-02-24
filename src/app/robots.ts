import config from "@repo/ui/config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${config.PUBLIC_URL}/sitemap.xml`,
  };
}
