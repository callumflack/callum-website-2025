"use client";

/**
 * This wrapper pattern is required by Next.js when using client components within server components.
 */

import {
  CVDownloadButton,
  type CVDownloadButtonProps,
} from "./cv-download-button";

export function CVDownloadButtonWrapper({
  filename,
  label,
}: CVDownloadButtonProps) {
  return <CVDownloadButton filename={filename} label={label} />;
}
