"use client";

import {
  CopyMarkdownButton,
  type CopyMarkdownButtonProps,
} from "./copy-markdown-button";

export function CopyMarkdownButtonWrapper({
  url,
  label,
}: CopyMarkdownButtonProps) {
  return <CopyMarkdownButton url={url} label={label} />;
}
