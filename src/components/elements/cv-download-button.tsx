"use client";

import { Button } from "@/components/atoms";
import config from "@/config";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { ClickConfirmation } from "./copy-button";
import { Spinner } from "./spinner";

export type CVDownloadButtonProps = {
  label?: string;
};

export const CVDownloadButton = ({
  label = "Download CV",
}: CVDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showConfirmation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setShowNotification(true);

    timeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setErrorMessage(null);

      const filename = config.CV_URL.split("/").at(-1) ?? "CallumFlack-CV.pdf";

      // Create a temporary download link to the file in the public folder
      const a = document.createElement("a");
      a.href = config.CV_URL;
      a.download = filename;
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Clean up
      document.body.removeChild(a);

      // Show success notification
      showConfirmation();
    } catch (error) {
      console.error("Download error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Download failed"
      );
      showConfirmation();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <span className="relative">
      {showNotification && (
        <ClickConfirmation
          hasError={!!errorMessage}
          message={errorMessage || "CV downloaded!"}
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
