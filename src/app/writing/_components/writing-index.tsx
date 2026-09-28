import { Mdx } from "@/components/mdx";
import { NewsletterSubscribe, SectionHeader } from "@/components/page";
import { PostLines } from "@/components/post/list/posts-list";
import { getWritingIndexPosts } from "@/lib/posts/actions";
import { getWritingMode, type WritingSearchParams } from "./writing-mode";
import { WritingTabs } from "./writing-tabs";

export function WritingIndexFallback() {
  return (
    <div data-slot="writing-index-loading">
      <WritingTabs />
      <main className="pt-small container">
        <SectionHeader className="pt-2">
          <span role="status">Loading…</span>
        </SectionHeader>
        <div
          className="py-small gap-w6 mt-2.5 flex flex-col"
          aria-hidden="true"
        >
          <WritingFeatureSkeleton />
          <WritingFeatureSkeleton />
          <WritingFeatureSkeleton />
        </div>
      </main>
    </div>
  );
}

function WritingFeatureSkeleton() {
  return (
    <div
      className="gap-w4 grid grid-cols-20"
      data-slot="writing-feature-skeleton"
    >
      <div className="bg-background rounded-button col-span-6 aspect-[1.6] sm:col-span-5" />
      <div className="col-span-14 -translate-y-[0.25em] space-y-1 sm:col-span-15">
        <div className="text-body flex h-[1.45em] items-center">
          <div className="bg-border rounded-soft h-[0.75em] w-4/5" />
        </div>
        <div className="text-meta">
          <div className="flex h-[1.45em] items-center">
            <div className="bg-background rounded-soft h-[0.65em] w-full" />
          </div>
          <div className="flex h-[1.45em] items-center">
            <div className="bg-background rounded-soft h-[0.65em] w-full" />
          </div>
          <div className="flex h-[1.45em] items-center">
            <div className="bg-background rounded-soft h-[0.65em] w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function WritingIndex({
  code,
  searchParams,
}: {
  code: string;
  searchParams: Promise<WritingSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const mode = getWritingMode(resolvedSearchParams.sort);

  return (
    <>
      <WritingTabs activeMode={mode} searchParams={resolvedSearchParams} />
      {mode === "collections" ? (
        <div className="pt-small">
          <Mdx
            className="Prose--writingIndex"
            code={code}
            storyPostLinkSuffix="?from=writing"
          />
        </div>
      ) : (
        <WritingChrono />
      )}
      <div className="pt-w16 container">
        <NewsletterSubscribe />
      </div>
    </>
  );
}

function WritingChrono() {
  const posts = getWritingIndexPosts();
  const chronologicalPosts = [
    ...posts.writing,
    ...posts.notes,
    ...posts.shelf,
  ].toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container pt-3">
      <PostLines
        postLinkSuffix="?from=writing"
        posts={chronologicalPosts}
        wrapperClassName="space-y-0"
      />
    </div>
  );
}
