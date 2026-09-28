import { useMDXComponent } from "@content-collections/mdx/react";
import { MDXErrorBoundary } from "@/components/utils";
import type { CategoryType } from "@/types/content";
import { getMdxComponents } from "./mdx-components";
import { MdxProse } from "./mdx-prose";

interface MdxProps {
  category?: CategoryType;
  className?: string;
  code: string;
  children?: React.ReactNode;
  storyPostLinkSuffix?: string;
}

export function Mdx({
  category,
  className,
  code,
  children,
  storyPostLinkSuffix,
}: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <MdxProse className={className}>
      <MDXErrorBoundary>
        {/* Rendering a component built from compiled MDX during render is
            inherent to @content-collections/mdx — its identity is stable for
            a given `code`. */}
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Component
          components={getMdxComponents(category, storyPostLinkSuffix)}
        />
      </MDXErrorBoundary>

      {/* allow children to be passed in to make it easy to compose eg. MetaTags, ContactIcons or Available components */}
      {children}
    </MdxProse>
  );
}
