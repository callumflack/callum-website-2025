import { PageWrapper } from "@/components/page";
import { Text } from "@/components/atoms";
import { getAllPostsChronological } from "@/lib/posts/actions";
import Link from "next/link";
import { cx } from "class-variance-authority";
import { buttonVariants } from "@/components/atoms/button";

export default async function TopicIndexPage() {
  const posts = await getAllPostsChronological();

  // Extract all unique topics from posts
  const allTopics = new Set<string>();
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        if (tag !== "featured") {
          allTopics.add(tag);
        }
      });
    }
  });

  // Sort topics alphabetically
  const sortedTopics = Array.from(allTopics).sort();

  return (
    <PageWrapper activeNav="feed">
      <div className="py-w8 container">
        <Text as="h1" intent="title" balance>
          Topics
        </Text>
        <div className="mt-w8 flex flex-wrap gap-2">
          {sortedTopics.map((topic) => (
            <Link
              key={topic}
              href={`/topic/${topic}`}
              className={cx(
                buttonVariants({
                  variant: "pill",
                }),
                "text-solid border-transparent",
                "hover:border-fill hover:text-fill"
              )}
            >
              <span>{topic}</span>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export const generateMetadata = () => {
  const title = `Topics — Callum Flack Design & Development`;
  const description = "Browse posts by topics.";

  return {
    title,
    description,
  };
};
