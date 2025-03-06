import { cx } from "cva";

export const OutsetRule = ({
  className,
  ruleClassName,
}: {
  className?: string;
  ruleClassName?: string;
}) => (
  <div className={cx("container px-0", className)}>
    <hr className={cx("transition-colors duration-300", ruleClassName)} />
  </div>
);
