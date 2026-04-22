import { cn } from "@/lib/utils";

export const PostLinkHeadingWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center gap-0.5",
        // "group-hover:text-accent",
        className
        // "transition-colors duration-300 ease-linear"
      )}
    >
      {children}
    </div>
  );
};
