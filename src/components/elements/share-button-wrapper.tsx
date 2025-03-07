"use client";

/**
 * This wrapper pattern is required by Next.js when using client components within server components.
 *
 * Why we need this seemingly redundant wrapper:
 * 1. When a server component imports a client component directly, it can cause serialization errors
 *    with props or functions passed between them.
 * 2. This wrapper creates a clean boundary that Next.js can use to understand exactly where
 *    server/client code separation happens.
 * 3. Both this and ShareButton *could* be in the same file, but that would make the entire
 *    file client-side. Separation keeps the component architecture cleaner.
 *
 * See: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
 */

import { ShareButton, type ShareButtonProps } from "./share-button";

export function ShareButtonWrapper({ url, theme = "post" }: ShareButtonProps) {
  return <ShareButton url={url} theme={theme} />;
}
