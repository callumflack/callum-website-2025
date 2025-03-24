import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { FullOrIndexPosts, PageInner, PageWrapper } from "@/components/page";
import { getPostsByTopic } from "@/lib/posts/actions";
import { ViewMode } from "@/types/viewMode";
import { Metadata } from "next";
import { ListHeading } from "./list-heading";

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ topic: string }>;
  searchParams: Promise<{ show?: ViewMode }>;
}) {
  const { topic } = await params;
  const posts = await getPostsByTopic(topic);
  const resolvedSearchParams = await searchParams;

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
          {/* <Text dim balance intent="meta">
            The value of good design is only realised if you have an engineer
            capable of discerning the details in code (or if you&apos;re lucky,
            they&apos;re one and the same).{" "}
            <LinkWithArrow href={config.SUBSTACK_URL} className="link">
              Signup for new posts
            </LinkWithArrow>
            .
          </Text> */}
        </TitleHeader>
        <FullOrIndexPosts
          posts={posts}
          topic={topic}
          initialShow={resolvedSearchParams.show}
          routePrefix="/topic"
          listHeaderNode={<ListHeading title={topic} />}
        />
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
