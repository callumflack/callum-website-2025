import { cx } from "cva";

export const OutsetRule = ({
  wrapperClassName,
  className,
}: {
  wrapperClassName?: string;
  className?: string;
}) => (
  <div className={cx("max-w-hero-px container grid", wrapperClassName)}>
    <hr className={cx("transition-colors duration-300", className)} />
  </div>
);
