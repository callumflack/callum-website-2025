import { OutsetRule } from "@/components/elements";
import { cx } from "cva";
import { Intro } from "./intro";
import { Nav } from "./nav";
import { Category } from "@/types/content";

export enum NavRoute {
  LOG = "log",
  WRITING = "writing",
  WORK = "work",
  GALLERY = "gallery",
  // SHELF = "shelf",
  // FRIENDS = "friends",
  ABOUT = "about",
}

export enum NavLabel {
  LOG = "Log",
  WRITING = "Writing",
  WORK = "Work",
  GALLERY = "Gallery",
  // SHELF = "Shelf",
  // FRIENDS = "Friends",
  ABOUT = "About",
}

export const getCategoryNavRoute = (category: string): NavRoute | undefined => {
  switch (category) {
    case Category.PROJECTS:
      return NavRoute.WORK;
    case Category.WRITING:
      return NavRoute.WRITING;
    case Category.NOTE:
      return NavRoute.LOG;
    case Category.ABOUT:
      return NavRoute.ABOUT;
    default:
      return undefined;
  }
};

type Props = {
  activeNav?: NavRoute | string;
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
          { href: `/${NavRoute.LOG}`, label: NavLabel.LOG },
          { href: `/${NavRoute.WRITING}`, label: NavLabel.WRITING },
          { href: `/${NavRoute.WORK}`, label: NavLabel.WORK },
          { href: `/${NavRoute.GALLERY}`, label: NavLabel.GALLERY },
          // { href: `/${NavRoute.SHELF}`, label: NavLabel.SHELF },
          // { href: `/${NavRoute.FRIENDS}`, label: NavLabel.FRIENDS },
          { href: `/${NavRoute.ABOUT}`, label: NavLabel.ABOUT },
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
          {showIntro && <Intro textIntent="body" />}
        </div>
      </footer>
    </>
  );
};

export const PostPageInner = ({ children }: { children: React.ReactNode }) => {
  return <div className="pt-w12 space-y-w8">{children}</div>;
};

export const IndexPageInner = ({ children }: { children: React.ReactNode }) => {
  return <div className="pt-w12 space-y-2">{children}</div>;
};

export const FeedPageInner = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};
