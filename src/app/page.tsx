import { allPosts, type Post } from "content-collections";
import Image from "next/image";
import { Suspense } from "react";
import { Link, Text } from "@/components/atoms";
import { getImageDimensions } from "@/components/media/media-utils";
import { Intro, PageWrapper } from "@/components/page";
import { getAllPostsChronological } from "@/lib/posts/actions";
import { filterFeaturedBySlugs } from "@/lib/posts/sorting";
import { HomeIndex } from "./(home)/home-index";

const startHereSlugs = [
  "vana",
  "the-library-of-economic-possibility",
  "the-instantaneous-language-of-beauty",
  "cleared",
  "the-matter-of-taste",
  "kalaurie",
  "replier",
  "you-cant-design-a-ui-without-designing-the-code",
] as const;

const HOME_FEATURE_ENABLED = true;
const HOME_FEATURE_SLUG = "you-cant-design-a-ui-without-designing-the-code";

export default function Home() {
  const visiblePosts = allPosts.filter((post) => !post.draft);
  const startHerePosts = filterFeaturedBySlugs(visiblePosts, startHereSlugs);
  const chronologicalPosts = getAllPostsChronological().slice(0, 12);
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
      </main>
    </PageWrapper>
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
      className="group py-w6 block"
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
          <Text as="h2" intent="body" weight="medium" balance>
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
