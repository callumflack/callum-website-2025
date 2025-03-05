import { cx } from "cva";
import { OutsetRule } from "@/components/elements";
import { Nav } from "./nav";

type Props = {
  activeNav?: string;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
};

export const PageWrapper = ({ activeNav, children, footerChildren }: Props) => {
  return (
    <>
      <Nav
        activeNav={activeNav}
        anchorName="Callum"
        navItems={[
          // { href: "/graphics", label: "GxIx" },
          // { href: config.PUBLIC_NOTES_URL, label: "Notes" },
          // { href: "/index", label: "Index" },
          { href: "/writing", label: "Writing" },
          { href: "/work", label: "Work" },
          { href: "/notes", label: "Notes" },
          { href: "/graphics", label: "Graphics" },
          // { href: "/shelf", label: "Shelf" },
          { href: "/friends", label: "Friends" },
          { href: "/about", label: "About" },
        ]}
      />

      <div className="pt-w16 space-y-w6">{children}</div>

      <OutsetRule />
      <footer
        className={cx(
          "pt-w16 relative container",
          "flex flex-col justify-between",
          "min-h-[calc(100dvh-var(--spacing-nav)-1px)]"
        )}
      >
        {footerChildren}
      </footer>
    </>
  );
};
