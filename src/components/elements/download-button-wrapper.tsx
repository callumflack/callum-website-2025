"use client";

/**
 * This wrapper pattern is required by Next.js when using client components within server components.
 *
 * Why we need this seemingly redundant wrapper:
 * 1. When a server component imports a client component directly, it can cause serialization errors
 *    with props or functions passed between them.
 * 2. This wrapper creates a clean boundary that Next.js can use to understand exactly where
 *    server/client code separation happens.
 * 3. Without this wrapper, we'd get "Functions cannot be passed directly to Client Components"
 *    errors when importing DownloadButton in server components.
 */

import { DownloadButton, type DownloadButtonProps } from "./download-button";

export function DownloadButtonWrapper({
  url,
  filename,
  label,
}: DownloadButtonProps) {
  return <DownloadButton url={url} filename={filename} label={label} />;
}
