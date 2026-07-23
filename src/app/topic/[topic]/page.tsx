import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { FullOrIndexPosts, PageInner, PageWrapper } from "@/components/page";
import { getPostsByTopic, getPublishedPosts } from "@/lib/posts/actions";
import { ListHeading } from "./list-heading";

export function generateStaticParams() {
  const topics = new Set<string>();
  getPublishedPosts().forEach((post) => {
    post.tags?.forEach((tag) => {
      if (tag !== "featured") topics.add(tag);
    });
  });
  return Array.from(topics).map((topic) => ({ topic }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const posts = getPostsByTopic(topic);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <PageWrapper activeNav="feed" theme="feed">
      <PageInner variant="index">
        <TitleHeader>
          <Text as="h1" intent="title">
            <Link href="/topic" className="hover:text-accent">
              Topic
            </Link>{" "}
            <span className="font-light">/</span>{" "}
            <span className="capitalize">{topic}</span>
          </Text>
        </TitleHeader>
        <Suspense fallback={null}>
          <FullOrIndexPosts
            posts={posts}
            topic={topic}
            listHeaderNode={<ListHeading title={topic} />}
          />
        </Suspense>
      </PageInner>
    </PageWrapper>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;

  const title = `Posts with topic "${topic}" — Callum Flack Design & Development`;
  const description = `A collection of posts with topic "${topic}".`;

  return {
    title,
    description,
  };
}
