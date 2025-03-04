import { cx } from "cva";

export const ListHeader = ({
  children,
  rhsElement,
  className,
}: {
  children: React.ReactNode;
  rhsElement?: React.ReactNode;
  className?: string;
}) => (
  <div className={cx("sticky z-10 bg-canvas", className)}>
    <div className="flex justify-between">
      <div className="flex items-center justify-start gap-w4">{children}</div>
      {rhsElement}
    </div>
    <hr className="-mt-px" />
  </div>
);
