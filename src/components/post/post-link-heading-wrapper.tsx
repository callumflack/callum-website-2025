import { cx } from "cva";

export const PostLinkHeadingWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cx(
        "relative flex items-center gap-0.5",
        "group-hover:text-accent",
        "transition-colors duration-300 ease-linear"
      )}
    >
      {children}
    </div>
  );
};
