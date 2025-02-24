import NextLink from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export interface LinkProps
  extends Omit<NextLinkProps, "href">,
    ComponentPropsWithoutRef<"a"> {
  href: string;
}

export const Link = ({ href, children, ...props }: LinkProps) => {
  const isExternal = /^(?:https?:)?\/\/|mailto:/.test(href);

  return isExternal ? (
    <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
      {children}
    </a>
  ) : (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
};
