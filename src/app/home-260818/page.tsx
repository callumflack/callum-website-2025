import type { Post } from "content-collections";
import type { Metadata } from "next";
import { StoryPostCard } from "@/components/mdx/story-post";
import { Intro, PageWrapper } from "@/components/page";
import {
  getAllPostsChronological,
  getPublishedPosts,
} from "@/lib/posts/actions";
import { formatPostYearSpan } from "@/lib/utils";
import { MasonryStoryGrid } from "./masonry-story-grid";

const CURRENT_HOME_POST_SLUGS = [
  "vana",
  "the-library-of-economic-possibility",
  "kalaurie",
  "cleared",
  "replier",
  "you-cant-design-a-ui-without-designing-the-code",
  "the-instantaneous-language-of-beauty",
  "the-matter-of-taste",
  "creativity-starts-with-love-and-theft",
  "answerable-vocabulary-for-llm-work",
] as const;

const CARD_SIZES =
  "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

export default function Home260818Page() {
  const posts = getHome260818Posts();
  const masonryItems = posts.map((post) => ({
    hasMedia: Boolean(post.assets?.[0]),
    id: post.slug,
    summary: post.summary,
    title: post.title,
    year: formatPostYearSpan(post),
  }));

  return (
    <PageWrapper hideFooter showNav={false}>
      <main className="pt-w20 pb-w72">
        <header className="container">
          <Intro
            showLabel={false}
            showContacts={true}
            showCurrentPrev={true}
            showWhatIWant={true}
            textIntent="body"
          />
        </header>

        <section
          aria-label="Selected and recent posts"
          className="px-inset pt-w12"
        >
          <MasonryStoryGrid items={masonryItems}>
            {posts.map((post) => (
              <StoryPostCard
                asset={post.assets?.[0]}
                key={post.slug}
                post={post}
                showSummary
                sizes={CARD_SIZES}
              />
            ))}
          </MasonryStoryGrid>
        </section>
      </main>
    </PageWrapper>
  );
}

function getHome260818Posts(): Post[] {
  const publishedBySlug = new Map(
    getPublishedPosts().map((post) => [post.slug, post])
  );
  const currentHomePosts = CURRENT_HOME_POST_SLUGS.map((slug) => {
    const post = publishedBySlug.get(slug);

    if (!post) {
      throw new Error(`Missing current homepage post: ${slug}`);
    }

    return post;
  });
  const currentHomeSlugs = new Set<string>(CURRENT_HOME_POST_SLUGS);
  const recentPosts = getAllPostsChronological()
    .filter((post) => !currentHomeSlugs.has(post.slug))
    .slice(0, 6);

  return [...currentHomePosts, ...recentPosts];
}

export const metadata: Metadata = {
  title: "Home 260818",
  description: "Selected work, writing, and recent posts by Callum Flack.",
};
