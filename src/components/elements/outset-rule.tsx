import { cx } from "cva";

export const OutsetRule = ({
  wrapperClassName,
  className,
}: {
  wrapperClassName?: string;
  className?: string;
}) => (
  <div className={cx("container px-0", wrapperClassName)}>
    <hr className={cx("transition-colors duration-300", className)} />
  </div>
);
