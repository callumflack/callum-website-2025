import { Text } from "../atoms/text";

export const Caption = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Text align="left" as="figcaption" className={className} dim intent="meta">
    {children}
  </Text>
);
