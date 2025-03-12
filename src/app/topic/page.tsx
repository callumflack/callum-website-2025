import { Text } from "@/components/atoms";
import { buttonVariants } from "@/components/atoms/button";
import { TitleHeader } from "@/components/elements";
import { PageInner, PageWrapper } from "@/components/page";
import { getAllPostsChronological } from "@/lib/posts/actions";
import { cx } from "class-variance-authority";
import { Metadata } from "next";
import Link from "next/link";

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
      <PageInner variant="index">
        <TitleHeader>
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
        </TitleHeader>
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse posts by topics.",
};
