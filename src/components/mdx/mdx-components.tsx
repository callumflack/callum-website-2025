import type { TextProps } from "@/components/atoms";
import { Link, Text } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import {
  Avatar,
  Contacts,
  Intro,
  Outro,
  WhatIWantLink,
} from "@/components/page";
import type { ComponentPropsWithoutRef } from "react";
import { highlight } from "sugar-high";
import {
  MdxImageProps,
  ZoomableImage,
  ZoomableVideo,
  ZoomableVideoProps,
} from "./mdx-media";

/*
  mdx-components: Element Definition (Zero Styling)

  Responsibility: What each MDX tag renders as. JSX mapping and logic only.
  
  ALL styling lives in mdx-prose.tsx. This file only provides:
  - Tag → JSX mapping
  - Conditional logic (Link vs LinkWithArrow, p unwrapping media)
  - Class anchors for Prose to target (.Callout, .Note, .Pre, .Contacts)
  
  Exception: HeadingWithId retains its styling (Text component integration).

  Mental model: docs/251218-mdx-styling-system.md
*/

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
      <LinkWithArrow href={href} {...props} />
    ) : (
      <Link href={href || "#"} {...props} />
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
    <ul {...(props as TextProps)}>{children}</ul>
  ),
  ol: ({ children, ...props }: ListProps) => (
    <ol {...(props as TextProps)}>{children}</ol>
  ),
  li: ({ children, ...props }: ListItemProps) => <li {...props}>{children}</li>,
  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote {...props}>{children}</blockquote>
  ),
  h2: (props: HeadingProps) => <HeadingWithId as="h2" {...props} />,
  h3: (props: HeadingProps) => <HeadingWithId as="h3" {...props} />,
  h4: ({ children, ...props }: HeadingProps) => <h4 {...props}>{children}</h4>,
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <div data-component="pre">
      <pre className="Pre" {...props}>
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
    <div className="Note">
      <hr />
    </div>
  ),
  Callout: ({ children }: DivProps) => (
    <div className="Callout">{children}</div>
  ),
  Note: ({ children, ...props }: DivProps) => (
    <div className="Note" {...props}>
      {children}
    </div>
  ),
  Intro: () => <Intro textIntent="body" />,
  Outro: () => <Outro textIntent="body" />,
  Avatar: () => <Avatar />,
  WhatIWantLink: () => <WhatIWantLink />,
  Contacts: (props: { showLabel?: boolean }) => (
    // wrapped in div to allow max-w-(--container-text) rule to take effect & to enable us to target it in mdx-prose.tsx
    <div data-component="contacts">
      <Contacts {...props} />
    </div>
  ),
};

type HeadingWithIdProps = HeadingProps &
  Pick<TextProps, "as" | "intent"> & {
    as: "h2" | "h3";
    children?: React.ReactNode;
  };

// Exception: HeadingWithId retains styling (Text component integration)
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
