import { cx } from "cva";
import { OutsetRule } from "../elements/outset-rule";

interface Props {
  children: React.ReactNode;
  intersectionRef?: React.RefObject<HTMLDivElement | null>;
}

export const FooterWrapper = ({ children, intersectionRef }: Props) => (
  <>
    {/* relative z-20 */}
    <OutsetRule wrapperClassName="" />
    <footer
      className={cx(
        "relative container flex flex-col",
        "pt-submajor relative min-h-[calc(100dvh-var(--spacing-nav)-1px)] justify-between"
      )}
    >
      {children}
      {intersectionRef ? (
        <div className="absolute bottom-0 h-px" ref={intersectionRef} />
      ) : null}
    </footer>
  </>
);
