import { Mdx } from "@/components/mdx";
import { PostLines } from "@/components/post/list/posts-list";
import { getWritingIndexPosts } from "@/lib/posts/actions";
import {
  DEFAULT_WRITING_MODE,
  getWritingMode,
  type WritingSearchParams,
} from "./writing-mode";
import { WritingTabs } from "./writing-tabs";

export function WritingIndexFallback() {
  return <WritingTabs activeMode={DEFAULT_WRITING_MODE} />;
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
