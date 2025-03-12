import { FullOrIndexPosts, PageInner, PageWrapper } from "@/components/page";
import { getAllPostsChronological } from "@/lib/posts/actions";
import { ViewMode } from "@/types/viewMode";
import { Metadata } from "next";

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const posts = await getAllPostsChronological();
  const resolvedSearchParams = await searchParams;

  // Validate the show parameter is a valid ViewMode
  const show = resolvedSearchParams.show as string;

  // Default to "full" for log page if no parameter is provided
  const validatedShow = !show
    ? ("full" as ViewMode)
    : show === "full" || show === "index"
      ? (show as ViewMode)
      : ("full" as ViewMode);

  return (
    <PageWrapper activeNav="log">
      <PageInner variant="log">
        <FullOrIndexPosts
          posts={posts}
          initialShow={validatedShow}
          routePrefix="/log"
        />
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Log",
  description: "An archive of notes and thoughts.",
};
