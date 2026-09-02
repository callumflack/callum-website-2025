import { Text } from "@/components/atoms";
import { cn } from "@/lib/utils";

export function StoryPostMeta({
  className,
  showSummary = false,
  summary,
  summaryClassName,
  title,
  yearSpan,
}: {
  className?: string;
  showSummary?: boolean;
  summary?: string;
  summaryClassName?: string;
  title: string;
  yearSpan: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-baseline gap-2.5">
        <Text
          as="h2"
          intent={showSummary ? "body" : "meta"}
          weight={showSummary ? "medium" : "normal"}
        >
          {title}
        </Text>
        <hr className="hr-vertical border-border-hover h-[0.7em] translate-y-px" />
        <Text
          as="span"
          intent={showSummary ? "body" : "meta"}
          weight={showSummary ? "medium" : "normal"}
        >
          {yearSpan}
        </Text>
      </div>
      {showSummary ? (
        <Text className={summaryClassName} dim intent="meta">
          {summary}
        </Text>
      ) : null}
    </div>
  );
}
