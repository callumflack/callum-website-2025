import { getWorkMode, type WorkSearchParams } from "./work-mode";
import { WorkPostsView } from "./work-posts-view";
import { WorkTabs } from "./work-tabs";

export function WorkIndexFallback() {
  return (
    <main data-component="WorkIndex">
      <WorkTabs />
    </main>
  );
}

export async function WorkIndex({
  searchParams,
}: {
  searchParams: Promise<WorkSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const mode = getWorkMode(resolvedSearchParams.sort);

  return (
    <main data-component="WorkIndex">
      <WorkTabs activeMode={mode} searchParams={resolvedSearchParams} />
      <WorkPostsView mode={mode} />
    </main>
  );
}
