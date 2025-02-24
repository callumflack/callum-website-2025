import { useMDXComponent } from "@content-collections/mdx/react";
import { components } from "./mdx-components";
import { Prose } from "./prose";

interface MdxProps {
  code: string;
  children?: React.ReactNode;
}

export function Mdx({ code, children }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <Prose>
      <Component components={components} />

      {/* allow children to be passed in to make it easy to compose eg. ContactIcons or Available components */}
      {children}
    </Prose>
  );
}
