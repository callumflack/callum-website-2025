import { cx } from "cva";
import * as React from "react";
import { Text } from "../atoms";
import type { PolymorphicProps } from "../atoms/polymorphic-element";
import { PolymorphicElement } from "../atoms/polymorphic-element";

type TitleHeaderProps = PolymorphicProps<React.ElementType> & {
  hasMetaSubheading?: boolean;
  className?: string;
};

export const TitleHeader = ({
  as,
  children,
  hasMetaSubheading,
  className,
  ...props
}: TitleHeaderProps) => {
  return (
    <PolymorphicElement
      as={as || "header"}
      className={cx(
        "container",
        hasMetaSubheading ? "space-y-[3px]" : "space-y-2",
        className
      )}
      {...props}
    >
      {children}
    </PolymorphicElement>
  );
};

export const TitleMetaHeading = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Text className="flex items-center gap-2" dim intent="meta">
    {children}
  </Text>
);
