import { OutsetRule } from "@/components/elements";
import { cx } from "cva";
import { Intro } from "./intro";
import { Nav } from "./nav";

type Props = {
  activeNav?: string;
  children: React.ReactNode;
  showIntro?: boolean;
  shareNode?: React.ReactNode;
};

export const PageWrapper = ({
  activeNav,
  children,
  showIntro = true,
  shareNode,
}: Props) => {
  return (
    <>
      <Nav
        activeNav={activeNav}
        anchorName="Callum"
        navItems={[
          { href: "/feed", label: "Feed" },
          { href: "/writing", label: "Writing" },
          { href: "/work", label: "Work" },
          { href: "/gallery", label: "Gallery" },
          // { href: "/shelf", label: "Shelf" },
          // { href: "/friends", label: "Friends" },
          { href: "/about", label: "About" },
        ]}
      />

      {children}

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

export const PostPageInner = ({ children }: { children: React.ReactNode }) => {
  return <div className="pt-w12 space-y-w6">{children}</div>;
};

export const IndexPageInner = ({ children }: { children: React.ReactNode }) => {
  return <div className="pt-w12 space-y-w6">{children}</div>;
};

export const FeedPageInner = ({ children }: { children: React.ReactNode }) => {
  return <div className="pt-w8">{children}</div>;
};
