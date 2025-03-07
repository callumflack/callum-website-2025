import { Text } from "@/components/atoms";
import { LinkWithArrow, TitleHeader } from "@/components/elements";
import { PageWrapper, PostPage } from "@/components/page";
import config from "@/config";
import { getAllPostsChronological } from "@/lib/posts/actions";
import { Post } from "content-collections";

export default async function FeedIndexPage() {
  const posts = await getAllPostsChronological();

  return (
    <PageWrapper childrenClassName="space-y-w12">
      <TitleHeader>
        {/* <Text as="h1" intent="title">
          If you have the words, you&apos;ll find the way.
        </Text> */}
        <Text dim intent="meta">
          Writing about creativity, design and complexity through the lens of
          attention, interfaces and systems composition.{" "}
          <LinkWithArrow href={config.SUBSTACK_URL} className="link">
            Signup for new posts
          </LinkWithArrow>
          .
        </Text>
      </TitleHeader>

      {posts.map((post: Post) => (
        <div className="space-y-w6" key={post.slug}>
          <PostPage key={post.slug} post={post} />
          <div className="pt-w8">
            <hr />
          </div>
        </div>
      ))}

      {/* <PostsPage initialSort={currentSort} kind={kind} posts={postsData} /> */}
    </PageWrapper>
  );
}

const title = `Writing — Callum Flack Design & Development`;
const description = "An archive of design and programming projects.";

export const generateMetadata = () => {
  return {
    title,
    description,
    twitter: {
      title,
      description,
    },
  };
};
