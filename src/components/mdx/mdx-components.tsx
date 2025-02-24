import { cx } from "cva";
import type { ComponentPropsWithoutRef } from "react";
// import { highlight } from "sugar-high";
import { Link } from "../atoms/next-link";
import type { TextProps } from "../atoms/text";
import { Text, textVariants } from "../atoms/text";
import { LinkWithArrow } from "../elements";
// import { MediaDialogImage } from "../composites/media-dialog-image";
// import { MediaDialogVideo } from "../composites/media-dialog-video";
// import { MdxImage } from "./mdx-image";
// import { MdxVideo } from "./mdx-video";

type AnchorProps = ComponentPropsWithoutRef<"a">;
type HeadingProps = ComponentPropsWithoutRef<"h2">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type DivProps = ComponentPropsWithoutRef<"div">;

export const noteStyle = [
  "Note !mt-w12 space-y-2 text-meta text-solid link-block",
  "[&_p]:text-meta [&_p]:text-solid",
];

export const components = {
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
  p: ({ children, ...props }: ParagraphProps) => (
    <p {...(props as TextProps)}>{children}</p>
  ),
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
        "group pb-2",
        "[&_p]:border-border-hover [&_p]:text-solid-hover [&_p]:border-l [&_p]:pb-0 [&_p]:pl-2.5 md:[&_p]:pl-4",
        "group-[&_strong]:text-meta group-[&_strong]:table group-[&_strong]:pt-[calc(5/16*1em)] group-[&_strong]:!font-normal"
      )}
    >
      {children}
    </Text>
  ),
  h2: (props: HeadingProps) => <HeadingWithId as="h2" {...props} />,
  h3: (props: HeadingProps) => <HeadingWithId as="h3" {...props} />,
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
  // code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
  //   // sugar-high encapsulates code styles so we can't set them here nor in <Prose> but we can in a global CSS file, see styles/theme-code.css
  //   const codeHTML = highlight(children as string);
  //   return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  // },
  hr: () => (
    <div className={cx(noteStyle)}>
      <hr />
    </div>
  ),
  Note: (props: ComponentPropsWithoutRef<"div">) => (
    <div className={cx(noteStyle)} {...props} />
  ),
  Callout: ({ children }: DivProps) => (
    <div
      className={cx(
        "bg-accent3-background px-w4 py-w4 rounded-button space-y-1.5",
        "[&_code]:bg-black-a1 [&_ul]:text-[0.925em]"
      )}
    >
      {/* <CalloutIcon className="size-[1.25em]" /> */}
      {children}
    </div>
    // Img: MdxImage,
    // Video: MdxVideo,
    // MediaDialogVideo,
    // MediaDialogImage,
  ),
};

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
      intent={as === "h2" ? "heading" : "fineHeading"}
    >
      {children ? (
        <Link
          aria-hidden="true"
          className="relative !no-underline"
          href={`#${id}`}
        >
          <span className="-left-em absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/heading:opacity-100">
            #
          </span>

          {children}
        </Link>
      ) : null}
    </Text>
  );
}
