import { useMDXComponent } from "@content-collections/mdx/react";
import { MDXErrorBoundary } from "@/components/utils";
import { components } from "./mdx-components";
import { MdxProse } from "./mdx-prose";

interface MdxProps {
  code: string;
  children?: React.ReactNode;
}

export function Mdx({ code, children }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <MdxProse>
      <MDXErrorBoundary>
        <Component components={components} />
      </MDXErrorBoundary>

      {/* allow children to be passed in to make it easy to compose eg. MetaTags, ContactIcons or Available components */}
      {children}
    </MdxProse>
  );
}
