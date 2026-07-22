import { Category } from "@/types/content";
import { HomeButton } from "./home-button";

export enum NavRoute {
  LOG = "log",
  WRITING = "writing",
  WORK = "work",
  GALLERY = "gallery",
  SHELF = "shelf",
  // FRIENDS = "friends",
  NOW = "now",
  ABOUT = "about",
}

export enum NavLabel {
  LOG = "Log",
  WRITING = "Writing",
  WORK = "Work",
  GALLERY = "Gallery",
  SHELF = "Shelf",
  // FRIENDS = "Friends",
  NOW = "Now",
  ABOUT = "About",
}

export const getCategoryNavRoute = (category: string): NavRoute | undefined => {
  switch (category) {
    case Category.PROJECTS:
      return NavRoute.WORK;
    case Category.WRITING:
      return NavRoute.WRITING;
    case Category.NOTES:
      return NavRoute.LOG;
    case Category.SHELF:
      return NavRoute.SHELF;
    default:
      return undefined;
  }
};

type Props = {
  activeNav?: NavRoute | string;
  children: React.ReactNode;
  shareNode?: React.ReactNode;
  footerNode?: React.ReactNode;
  hideFooter?: boolean;
  showNav?: boolean;
  theme?: "post" | "feed";
};

export const PageWrapper = ({
  children,
  shareNode,
  footerNode,
  hideFooter = false,
  showNav = true,
}: Props) => {
  return (
    <>
      <div className="relative">
        {showNav && <PageWrapperNav />}
        {children}
      </div>

      {!hideFooter && (
        <footer data-component="PageWrapper-Footer" className="pt-w8 pb-w72">
          {footerNode ?? shareNode}
        </footer>
      )}
    </>
  );
};

const PageWrapperNav = () => (
  <aside
    data-component="PageWrapper-Nav"
    className="pointer-events-none absolute inset-0 z-20"
  >
    <nav aria-label="Site navigation" className="top-w20 sticky">
      <div className="relative container">
        <HomeButton />
      </div>
    </nav>
  </aside>
);
