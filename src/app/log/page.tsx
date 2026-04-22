import { Suspense } from "react";
import { FullOrIndexPosts, PageInner, PageWrapper } from "@/components/page";
import { getAllPostsChronological } from "@/lib/posts/actions";
import { Metadata } from "next";

export default function LogPage() {
  const posts = getAllPostsChronological();

  return (
    <PageWrapper activeNav="log">
      <PageInner variant="log">
        <Suspense fallback={null}>
          <FullOrIndexPosts
            posts={posts}
            initialShow="index"
            routePrefix="/log"
          />
        </Suspense>
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Log",
  description: "An archive of notes and thoughts.",
};
