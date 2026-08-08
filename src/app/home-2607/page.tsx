import { ArrowRightIcon } from "@radix-ui/react-icons";
import { allPosts, type Post } from "content-collections";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import {
  Button,
  focusVisibleOutlineStyle,
  Link,
  Text,
} from "@/components/atoms";
import { getImageDimensions } from "@/components/media/media-utils";
import { Intro, PageWrapper } from "@/components/page";
import { getAllPostsChronological, toPostListItem } from "@/lib/posts/actions";
import { filterFeaturedBySlugs } from "@/lib/posts/sorting";
import { cn } from "@/lib/utils";
import { HomeIndex } from "./home-index";

/*
 * ARCHIVE — homepage as of 2026-07, lifted verbatim from src/app/page.tsx
 * before the MDX home-story rewrite. Reachable at /home-2607 for reference and
 * side-by-side comparison; kept out of search engines and the sitemap below.
 * This route imports its own frozen ./home-index — the live (home)/home-index
 * has since changed shape.
 */

export const metadata: Metadata = {
  title: "Home archive — 2026-07",
  robots: { index: false, follow: false },
};

const startHereSlugs = [
  "vana",
  "the-library-of-economic-possibility",
  "the-instantaneous-language-of-beauty",
  "cleared",
  "the-matter-of-taste",
  "kalaurie",
  "you-cant-design-a-ui-without-designing-the-code",
  "replier",
] as const;

const HOME_FEATURE_ENABLED = true;
const HOME_FEATURE_SLUG = "you-cant-design-a-ui-without-designing-the-code";

export default function HomeArchive2607() {
  const visiblePosts = allPosts.filter((post) => !post.draft);
  // Slim view models only: full Posts carry the compiled MDX `content` bundle,
  // which must not be serialized into the client HomeIndex props.
  const startHerePosts = filterFeaturedBySlugs(visiblePosts, startHereSlugs).map(
    toPostListItem
  );
  const chronologicalPosts = getAllPostsChronological()
    .slice(0, 12)
    .map(toPostListItem);
  const featuredPost = HOME_FEATURE_ENABLED
    ? visiblePosts.find((post) => post.slug === HOME_FEATURE_SLUG)
    : undefined;
  const featuredAsset = featuredPost?.assets?.[0];

  return (
    <PageWrapper hideFooter showNav={false}>
      <main className="pt-w20 pb-w72 container">
        <header>
          <Intro as="h1" showLabel={false} textIntent="body" />
        </header>

        {featuredPost && featuredAsset ? (
          <FeaturedCard asset={featuredAsset} post={featuredPost} />
        ) : null}

        <Suspense fallback={null}>
          <HomeIndex
            chronologicalPosts={chronologicalPosts}
            startHerePosts={startHerePosts}
          />
        </Suspense>

        <NewsletterSubscribe />
      </main>
    </PageWrapper>
  );
}

function NewsletterSubscribe() {
  return (
    <section
      aria-labelledby="newsletter-subscribe-label"
      className="pt-w12 space-y-gap"
    >
      <div className="space-y-gap">
        <Text
          as="p"
          className="text-pretty"
          color="solid"
          id="newsletter-subscribe-label"
          intent="meta"
        >
          Get notified of new stuff.
        </Text>
        {/*
         * SUBSTACK HANDOFF
         *
         * We own and style this form, then hand the reader to Substack's hosted
         * /subscribe page with their email prefilled. This avoids Substack's
         * supported iframe, which Substack says cannot be customized:
         * https://support.substack.com/hc/en-us/articles/360041759232
         *
         * Tradeoffs:
         * - The /subscribe page is public and documented; its `email` prefill
         *   query parameter is not a documented API contract.
         * - The email appears in the destination URL and browser history.
         * - The reader must still confirm on Substack, where Substack branding,
         *   plan selection, recommendations, and consent flows are owned.
         * - Do not replace this with a POST to /api/v1/free: that endpoint is
         *   undocumented for third-party integrations and is more likely to
         *   change or gain anti-abuse requirements.
         *
         * Maintenance: periodically submit a test address and confirm the new
         * tab opens /subscribe with the email populated. If prefill stops
         * working, keep the branded boundary off-site and fall back to linking
         * to /subscribe without passing the email.
         */}
        <form
          action="https://thelittoralline.substack.com/subscribe"
          className="flex"
          method="get"
          rel="noopener noreferrer"
          target="_blank"
        >
          <input
            aria-label="Email address"
            autoComplete="email"
            className="border-solid-light focus-visible:border-fill text-body placeholder:text-solid h-11 min-w-0 flex-1 border bg-transparent px-3 pb-[0.2em] outline-none focus:z-10"
            name="email"
            placeholder="Email address"
            required
            type="email"
          />
          <Button
            className="-ml-px w-fit"
            size="default"
            SuffixIcon={<ArrowRightIcon />}
            type="submit"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}

function FeaturedCard({
  asset,
  post,
}: {
  asset: NonNullable<Post["assets"]>[number];
  post: Post;
}) {
  const { height, width } = getImageDimensions(asset.aspect);

  return (
    <Link
      aria-label={`Featured: ${post.title}`}
      className={cn("group py-w6 block", focusVisibleOutlineStyle)}
      href={`/${post.slug}`}
    >
      <article>
        <Image
          alt={asset.alt}
          className="sm:rounded-button aspect-video w-full bg-[#aeb8c0] object-contain outline -outline-offset-1 outline-black/10 dark:outline-white/10"
          height={height}
          priority
          sizes="(min-width: 650px) 620px, calc(100vw - 30px)"
          src={asset.src}
          width={width}
        />
        <div className="pt-w4 space-y-1">
          <Text as="h2" balance intent="body" weight="medium">
            {post.title}
          </Text>
          <Text
            as="p"
            className="group-hover:text-fill-light! text-pretty"
            dim
            intent="meta"
          >
            {post.summary}
          </Text>
        </div>
      </article>
    </Link>
  );
}
