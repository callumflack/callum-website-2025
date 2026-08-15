import { cva, type VariantProps } from "cva";
import { cn } from "@/lib/utils";
import { Category } from "@/types/content";
import { NewsletterSubscribe } from "./block-newsletter";
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
      <div className="relative" data-slot="PageWrapper-Content">
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
    <nav aria-label="Site navigation" className="top-gap sm:top-w20 sticky">
      <div className="relative container">
        <HomeButton />
      </div>
    </nav>
  </aside>
);

export const pageInnerVariants = cva({
  base: "",
  variants: {
    variant: {
      post: "pt-w20 space-y-w8",
      index: "pt-w20 space-y-2.5",
      indexSticky: [
        // Single-line TitleHeader contract.
        "pt-[calc(var(--spacing-w20)-(var(--spacing)*2.5))]",
        "[--height-index-title-header:calc((var(--spacing)*5)+(var(--text-title)*var(--text-title--line-height)))]",
        // Sticky title and list controls.
        "*:data-[component=TitleHeader]:sticky *:data-[component=TitleHeader]:top-0 *:data-[component=TitleHeader]:z-11 *:data-[component=TitleHeader]:bg-canvas *:data-[component=TitleHeader]:py-2.5",
        "**:data-[component=ListHeader]:top-[length:var(--height-index-title-header)]",
      ],
      log: "",
      home: "pt-w8 space-y-2.5",
    },
  },
  defaultVariants: {
    variant: "post",
  },
});

interface PageInnerProps
  extends React.ComponentProps<"div">, VariantProps<typeof pageInnerVariants> {
  newsletter?: boolean;
}

export const PageInner = ({
  className,
  variant,
  newsletter,
  children,
  ...props
}: PageInnerProps) => {
  const showNewsletter =
    newsletter ?? (variant === "index" || variant === "indexSticky");

  return (
    <div
      data-component="PageInner"
      className={cn(pageInnerVariants({ variant }), className)}
      {...props}
    >
      {children}
      {showNewsletter ? (
        <div className="pt-w12 container">
          <NewsletterSubscribe />
        </div>
      ) : null}
    </div>
  );
};
