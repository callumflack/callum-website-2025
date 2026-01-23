"use client";

import config from "@/config";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { ContactIcon } from "../page/contact-icon";
import { CopyButton } from "./copy-button";

interface EmailButtonProps {
  // Retain the label prop so that we can use it in contacts.tsx
  label?: string;
}

export const EmailButton = ({ label }: EmailButtonProps) => {
  return (
    <li>
      <CopyButton
        valueToCopy={config.EMAIL}
        confirmationMessage="Email copied!"
        // onSuccessCopy={() => setEmailCopied(true)}
        successDuration={2500}
        onClick={(e) => {
          if (e.currentTarget instanceof HTMLAnchorElement) {
            e.currentTarget.setAttribute(
              "aria-label",
              "Email copied to clipboard"
            );
          }
        }}
      >
        <ContactIcon href={`mailto:${config.EMAIL}`} label={label} withListItem={false}>
          <EnvelopeClosedIcon />
        </ContactIcon>
      </CopyButton>
    </li>
  );
};
