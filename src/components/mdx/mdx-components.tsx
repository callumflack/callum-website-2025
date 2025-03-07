import type { TextProps } from "@/components/atoms";
import { Link, Text, textVariants } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { Contacts, WhatIWantLink } from "@/components/page";
import { cx } from "cva";
import type { ComponentPropsWithoutRef } from "react";
import { highlight } from "sugar-high";
import {
  MdxImageProps,
  ZoomableImage,
  ZoomableVideo,
  ZoomableVideoProps,
} from "./mdx-media";

// Basic component types
type AnchorProps = ComponentPropsWithoutRef<"a">;
type HeadingProps = ComponentPropsWithoutRef<"h2">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type DivProps = ComponentPropsWithoutRef<"div">;

export const components = {
  Image: (props: MdxImageProps) => <ZoomableImage {...props} />,
  Video: (props: ZoomableVideoProps) => <ZoomableVideo {...props} />,
  // This doesn't fucking work
  img: (props: MdxImageProps) => {
    // console.log("img props:", props);
    return components.Image(props);
  },
  a: ({ href, ...props }: AnchorProps) => {
    const isExternal = href && /^(?:https?:)?\/\//.test(href);
    return isExternal ? (
      <LinkWithArrow
        className={cx(textVariants({ link: "default" }))}
        href={href}
        {...props}
      />
    ) : (
      <Link
        className={cx(textVariants({ link: "default" }))}
        href={href || "#"}
        {...props}
      />
    );
  },
  p: ({ children, ...props }: ParagraphProps) => {
    // Check if children is a single element and is an image
    if (
      children &&
      !Array.isArray(children) &&
      typeof children === "object" &&
      "props" in children
    ) {
      return children;
    }
    return <p {...props}>{children}</p>;
  },
  ul: ({ children, ...props }: ListProps) => (
    <ul
      className={cx(
        "pl-bullet space-y-0.5",
        "[&>li]:relative [&>li]:before:absolute [&>li]:before:top-[0.75em] [&>li]:before:-left-[1.3em] [&>li]:before:inline-block [&>li]:before:h-px [&>li]:before:w-[14px] [&>li]:before:bg-current [&>li]:before:content-['']"
      )}
      {...(props as TextProps)}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ListProps) => (
    <ol className="list-decimal space-y-0.5 pl-5" {...(props as TextProps)}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ListItemProps) => <li {...props}>{children}</li>,
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <Text
      as="blockquote"
      {...(props as TextProps)}
      className={cx(
        "group py-1.5",
        "[&_p]:text-fill-light",
        "[&_p]:border-border-hover [&_p]:border-l [&_p]:pb-0 [&_p]:pl-2.5 md:[&_p]:pl-4",
        "[&_strong]:text-meta [&_strong]:table [&_strong]:pt-[calc(6/16*1em)] [&_strong]:!font-normal"
      )}
    >
      {children}
    </Text>
  ),
  h2: (props: HeadingProps) => <HeadingWithId as="h2" {...props} />,
  h3: (props: HeadingProps) => <HeadingWithId as="h3" {...props} />,
  h4: (props: TextProps) => <Text as="h4" weight="bold" {...props} />,
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <div className="py-1">
      <pre
        className={cx(
          "Pre bg-background-hover rounded-button overflow-auto",
          "[&_code]:block [&_code]:overflow-auto [&_code]:py-2.5 [&_code]:pl-3",
          "[&_code]:hide-scrollbar [&_code]:leading-[1.6]",
          // overwrite prose code styles
          "[&_code]:bg-transparent"
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  ),
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    // sugar-high encapsulates code styles so we can't set them here nor in <Prose> but we can in a global CSS file, see styles/code.css
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
  hr: () => (
    <div className={cx(noteStyle)}>
      <hr />
    </div>
  ),
  Callout: ({ children }: DivProps) => (
    <div
      className={cx(
        "bg-accent3/10 md:pr-w12 rounded-button space-y-1.5 px-4 pt-3 pb-4",
        "[&_code]:bg-black-a1 [&_ul]:text-[0.925em]",
        "[&>*]:text-meta"
      )}
    >
      {/* <CalloutIcon className="size-[1.25em]" /> */}
      {children}
    </div>
  ),
  Note: (props: DivProps) => <div className={cx(noteStyle)} {...props} />,
  Contact: () => <Contacts className="pt-0.5 !pl-0" />,
  WhatIWantLink: () => <WhatIWantLink />,
};

export const noteStyle = [
  "Note !mt-w8 space-y-2 text-meta text-solid link-block",
  "[&_p]:text-meta [&_p]:text-solid",
];

type HeadingWithIdProps = HeadingProps &
  Pick<TextProps, "as" | "intent"> & {
    as: "h2" | "h3";
    children?: React.ReactNode;
  };

function HeadingWithId({ as, children }: HeadingWithIdProps) {
  const id = children?.toString().toLowerCase().replace(/\s+/g, "-");
  return (
    <Text
      as={as}
      className="group/heading not-first:mt-w8 scroll-mt-[calc(var(--spacing-nav)+var(--spacing-inset))]"
      id={id}
      intent={as === "h2" ? "heading" : "body"}
      weight={as === "h2" ? "normal" : "medium"}
    >
      {children ? (
        <Link
          aria-hidden="true"
          className="relative block !no-underline"
          href={`#${id}`}
        >
          <span className="absolute top-1/2 -left-[0.8em] -translate-y-1/2 opacity-0 transition-opacity group-hover/heading:opacity-100">
            #
          </span>

          {children}
        </Link>
      ) : null}
    </Text>
  );
}
