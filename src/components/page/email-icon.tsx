"use client";

import { CopyIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { ContactIcon } from "./contact-icon";

interface EmailIconProps {
  email: string;
  showLabel?: boolean;
}

export const EmailIcon = ({ email, showLabel }: EmailIconProps) => {
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    if (emailCopied) {
      const timer = setTimeout(() => {
        setEmailCopied(false);
      }, 4000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [emailCopied]);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    void navigator.clipboard.writeText(email);
    setEmailCopied(true);
    e.currentTarget.setAttribute("aria-label", "Email copied to clipboard");
  };

  const getLabel = () => {
    if (emailCopied) return "Copied!";
    if (showLabel) return "Email";
    return undefined;
  };

  return (
    <ContactIcon
      href={`mailto:${email}`}
      label={getLabel()}
      onClick={handleEmailClick}
    >
      {emailCopied ? <CopyIcon /> : <EnvelopeClosedIcon />}
    </ContactIcon>
  );
};
