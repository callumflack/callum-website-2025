import { cn } from "@/lib/utils";

export const OutsetRule = ({
  className,
  ruleClassName,
}: {
  className?: string;
  ruleClassName?: string;
}) => (
  <div className={cn("container px-0", className)}>
    <hr className={cn("transition-colors duration-300", ruleClassName)} />
  </div>
);
