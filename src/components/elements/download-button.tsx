"use client";

import { Button } from "@/components/atoms";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { ClickConfirmation } from "./share-button";
import { Spinner } from "./spinner";

export type DownloadButtonProps = {
  url: string;
  filename: string;
  label?: string;
};

export const DownloadButton = ({
  url,
  filename,
  label = "Download",
}: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showNotification) {
      setIsVisible(true);
      timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowNotification(false), 300); // Remove from DOM after transition
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [showNotification]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setErrorMessage(null);

      // Fetch the content
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download (${response.status})`);
      }

      // Get the content as text
      const text = await response.text();

      // Create a blob with markdown content type
      const blob = new Blob([text], { type: "text/markdown" });

      // Create a temporary download link
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // Show success notification
      setShowNotification(true);
    } catch (error) {
      console.error("Download error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Download failed"
      );
      setShowNotification(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <span className="relative">
      {showNotification && (
        <ClickConfirmation
          isVisible={isVisible}
          hasError={!!errorMessage}
          message={errorMessage || "File downloaded!"}
        />
      )}
      <Button
        variant="outline"
        size="sm"
        PrefixIcon={isDownloading ? <Spinner boxSize={15} /> : <DownloadIcon />}
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? "Downloading..." : label}
      </Button>
    </span>
  );
};
