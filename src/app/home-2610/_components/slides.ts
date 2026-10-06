import type { CSSProperties } from "react";
import { isVideoFile } from "@/components/media/media-utils";
import { getPublishedPosts } from "@/lib/posts/actions";
import type { CarouselProject } from "@/lib/posts/carousel-projects";
import { formatPostYearSpan } from "@/lib/utils";

export type HomeSlide = CarouselProject & {
  style?: CSSProperties & {
    "--slide-padding-x"?: string;
    "--slide-padding-y"?: string;
  };
};

// Media is authored here, independently of post assets. Per-slide style can
// override --slide-padding-x / --slide-padding-y; aspect owns the media width.
// Video posters are the first decoded frame of the exact src, at its native
// dimensions. Keep aspect identical so playback cannot change the media crop.
const slides: Pick<HomeSlide, "slug" | "asset" | "style">[] = [
  {
    slug: "vana-2025",
    asset: {
      src: "https://cfd-media.b-cdn.net/vana-data-connect-demo-02-260210.mp4",
      poster: "/images/home-vana-data-connect-first-frame-261006.jpg",
      alt: "Data Connect Demo",
      aspect: "3152-2160",
    },
  },
  {
    slug: "kalaurie",
    asset: {
      src: "https://cdn.callumflack.design/kalaurie-shop-240722.mp4",
      poster: "/images/home-kalaurie-first-frame-261006.jpg",
      alt: "Kalaurie website overview",
      aspect: "1728-1080",
    },
  },
  {
    slug: "the-library-of-economic-possibility",
    asset: {
      src: "https://cdn.callumflack.design/The_Library_of_Economic_Possibility_home_page_4_November_2022.mp4",
      poster: "/images/home-lep-first-frame-261006.jpg",
      alt: "Overview of the Library of Economic Possibility desktop website.",
      aspect: "2074-1440",
    },
  },
  {
    slug: "open-data-labs",
    asset: {
      src: "https://cfd-media.b-cdn.net/odl-site-overview-260902.mp4",
      poster: "/images/home-odl-first-frame-261006.jpg",
      alt: "ODL website",
      aspect: "1512-1080",
    },
  },
  {
    slug: "vana",
    asset: {
      src: "https://cdn.callumflack.design/vana-portrait-discover-01.mp4",
      poster: "/images/home-vana-portrait-first-frame-261006.jpg",
      alt: "Vana Portrait web app overview",
      aspect: "1728-1080",
    },
  },
  {
    slug: "replier",
    asset: {
      src: "https://cdn.callumflack.design/replier-select-240722.mp4",
      poster: "/images/home-replier-first-frame-261006.jpg",
      alt: "Replier selection mode video",
      aspect: "1728-1080",
    },
  },
  {
    slug: "studio-round",
    asset: {
      src: "https://cdn.callumflack.design/studio-round-01.mp4",
      poster: "/images/home-studio-round-first-frame-261006.jpg",
      alt: "Studio Round website overview video",
      aspect: "1728-1080",
    },
  },
  {
    slug: "themes-for-shadcnblocks",
    asset: {
      src: "/images/shadcnblocks-charter-home-section-16x10.png",
      alt: "Shadcnblocks Charter theme home page",
      aspect: "1600-1000",
    },
  },
  {
    slug: "anchor-ceramics",
    asset: {
      src: "https://cfd-media.b-cdn.net/anchor-ceramics-02.mp4",
      poster: "/images/home-anchor-ceramics-first-frame-261006.jpg",
      alt: "Anchor website overview",
      aspect: "1728-1080",
    },
  },
  {
    slug: "breaka",
    asset: {
      src: "/images/breaka-logotype-1920x1080.jpg",
      alt: "Breaka Milk logo, 2000",
      aspect: "1920-1080",
    },
  },
];

export function getHomeSlides(): HomeSlide[] {
  const posts = new Map(getPublishedPosts().map((post) => [post.slug, post]));

  return slides.map((slide) => {
    if (isVideoFile(slide.asset.src) && !slide.asset.poster) {
      throw new Error(`Home video slide requires a poster: ${slide.slug}`);
    }
    const post = posts.get(slide.slug);
    if (!post)
      throw new Error(`Home slide references missing post: ${slide.slug}`);

    return {
      ...slide,
      title: post.title,
      yearSpan: formatPostYearSpan(post),
    };
  });
}
