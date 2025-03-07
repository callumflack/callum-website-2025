import { OutsetRule } from "@/components/elements";
import { cx } from "cva";
import { Intro } from "./intro";
import { Nav } from "./nav";

type Props = {
  activeNav?: string;
  children: React.ReactNode;
  showIntro?: boolean;
  shareNode?: React.ReactNode;
  childrenClassName?: string;
};

export const PageWrapper = ({
  activeNav,
  children,
  showIntro = true,
  shareNode,
  childrenClassName,
}: Props) => {
  return (
    <>
      <Nav
        activeNav={activeNav}
        anchorName="Callum"
        navItems={[
          // { href: "/graphics", label: "GxIx" },
          // { href: config.PUBLIC_NOTES_URL, label: "Notes" },
          // { href: "/index", label: "Index" },
          { href: "/feed", label: "Feed" },
          { href: "/writing", label: "Writing" },
          { href: "/work", label: "Work" },
          // { href: "/notes", label: "Notes" },
          { href: "/gallery", label: "Gallery" },
          // { href: "/shelf", label: "Shelf" },
          // { href: "/friends", label: "Friends" },
          { href: "/about", label: "About" },
        ]}
      />

      <div className={cx("pt-w16 space-y-w6", childrenClassName)}>
        {children}
      </div>

      <footer className="pt-w12">
        {shareNode}
        <OutsetRule />
        <div
          className={cx(
            "pt-w8 container",
            "flex flex-col justify-between",
            "min-h-[calc(100dvh-var(--spacing-nav)-1px)]"
          )}
        >
          {showIntro && <Intro />}
        </div>
      </footer>
    </>
  );
};
