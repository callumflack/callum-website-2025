import { cx } from "cva";
import { OutsetRule } from "@/components/elements";
import { Nav } from "./nav";
import { Intro } from "./intro";
import { Button } from "../atoms";
import { DownloadIcon, Link2Icon } from "@radix-ui/react-icons";

type Props = {
  activeNav?: string;
  children: React.ReactNode;
  showIntro?: boolean;
  showShare?: boolean;
  childrenClassName?: string;
};

export const PageWrapper = ({
  activeNav,
  children,
  showIntro = true,
  showShare = false,
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
        {showShare && (
          <div className="pt-w1">
            <OutsetRule />
            <div className="py-w8 gap-w4 container flex items-center">
              <Button
                variant="outline"
                size="sm"
                PrefixIcon={<Link2Icon />}
                // onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Share
              </Button>
              {/* get the github raw file link, or public/john-boyds-bloody-mindedness.md */}
              <Button variant="outline" size="sm" PrefixIcon={<DownloadIcon />}>
                Download
              </Button>
            </div>
          </div>
        )}
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
