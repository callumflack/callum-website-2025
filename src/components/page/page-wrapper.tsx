import { OutsetRule, TitleHeader } from "@/components/elements";
import { cx, cva, type VariantProps } from "cva";
import { Intro, Outro } from "./block-intro";
import { Nav } from "./nav";
import { Category } from "@/types/content";
import { Text } from "@/components/atoms";

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
    case Category.NOTES:
      return NavRoute.LOG;
    default:
      return undefined;
  }
};

type Props = {
  activeNav?: NavRoute | string;
  children: React.ReactNode;
  showIntro?: boolean;
  showWhatIWant?: boolean;
  shareNode?: React.ReactNode;
  footerNode?: React.ReactNode;
  hideFooter?: boolean;
  theme?: "post" | "feed";
};

export const PageWrapper = ({
  activeNav,
  children,
  showIntro = true,
  showWhatIWant = true,
  shareNode,
  footerNode,
  hideFooter = false,
  theme = "post",
}: Props) => {
  return (
    <>
      <Nav
        componentName="PageWrapper-Nav"
        activeNav={activeNav}
        anchorName="Callum"
        navItems={[
          { href: `/${NavRoute.WORK}`, label: NavLabel.WORK },
          { href: `/${NavRoute.WRITING}`, label: NavLabel.WRITING },
          { href: `/${NavRoute.GALLERY}`, label: NavLabel.GALLERY },
          { href: `/${NavRoute.LOG}`, label: NavLabel.LOG },
          // { href: `/${NavRoute.SHELF}`, label: NavLabel.SHELF },
          // { href: `/${NavRoute.FRIENDS}`, label: NavLabel.FRIENDS },
          { href: `/${NavRoute.ABOUT}`, label: NavLabel.ABOUT },
        ]}
      />

      {children}

      {!hideFooter &&
        (footerNode ? (
          <footer
            data-component="PageWrapper-Footer"
            className={cx(footerStyle, "pt-w8")}
          >
            {footerNode}
            <div className="container">
              <FooterNote />
            </div>
          </footer>
        ) : (
          <footer
            data-component="PageWrapper-Footer"
            className={cx(theme === "post" ? "pt-w12" : "pt-w8")}
          >
            {shareNode}
            <OutsetRule />
            <div className={cx(footerStyle, "pt-w8 container")}>
              {showIntro ? (
                <Intro textIntent="body" showWhatIWant={showWhatIWant} />
              ) : (
                <div>
                  {/* duplicated Outro section from HomePage */}
                  <TitleHeader as="div" isContained>
                    <Text as="h3" intent="title">
                      Connect
                    </Text>
                  </TitleHeader>
                  <div className="pt-w6">
                    <Outro showLabel={true} textIntent="body" />
                  </div>
                </div>
              )}
              <FooterNote />
            </div>
          </footer>
        ))}
    </>
  );
};

const FooterNote = () => {
  return (
    <div data-component="FooterNote" className="pb-w8">
      <Text as="p" intent="fine" dim>
        Thank you for visiting this personal website.
      </Text>
    </div>
  );
};

const footerStyle = [
  "flex flex-col justify-between",
  "min-h-[calc(100dvh-var(--spacing-nav)-1px)]",
];

export const pageInnerVariants = cva({
  base: "",
  variants: {
    variant: {
      post: "pt-w12 space-y-w8",
      index: "pt-w12 space-y-2.5",
      log: "",
      home: "pt-w8 space-y-2.5",
    },
  },
  defaultVariants: {
    variant: "post",
  },
});

interface PageInnerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof pageInnerVariants> {}

export const PageInner = ({ className, variant, ...props }: PageInnerProps) => {
  return (
    <div
      data-component="PageInner"
      className={cx(pageInnerVariants({ variant, className }))}
      {...props}
    >
      {props.children}
    </div>
  );
};
