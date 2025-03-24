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
  showWhatIWant?: boolean;
  shareNode?: React.ReactNode;
  footerNode?: React.ReactNode;
  theme?: "post" | "feed";
};

export const PageWrapper = ({
  activeNav,
  children,
  showIntro = true,
  showWhatIWant = true,
  shareNode,
  footerNode,
  theme = "post",
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

      {footerNode ? (
        <footer className={cx(footerStyle, "pt-w8")}>{footerNode}</footer>
      ) : (
        <footer className={cx(theme === "post" ? "pt-w12" : "pt-w8")}>
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
                    Stay in touch
                  </Text>
                </TitleHeader>
                <div className="pt-w6">
                  <Outro showLabel={true} textIntent="body" />
                </div>
              </div>
            )}
          </div>
        </footer>
      )}
    </>
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
