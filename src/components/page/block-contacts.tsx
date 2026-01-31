import {
  ArcticonsSubstackReader,
  IonSocialLinkedinOutline,
  MynauiBrandGithub,
} from "@/components/icons";
import config from "@/config";
import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { cx } from "cva";
import { EmailButton } from "../elements/email-button";
import { ContactIcon } from "./contact-icon";

export type ContactsProps = {
  showLabel?: boolean;
  theme?: "inline" | "list";
  className?: string;
};

export const Contacts = ({
  showLabel,
  theme = "inline",
  className,
}: ContactsProps) => {
  return (
    <ul
      className={cx(
        "link-block-reset no-bullets",
        theme === "inline" ? "-ml-2 flex items-center" : "flex flex-col",
        showLabel ? "gap-0" : "gap-0.5",
        className
      )}
    >
      <EmailButton label={showLabel ? "Email" : undefined} />
      <ContactIcon
        className="translate-y-[-0.05em] transform"
        href={config.TWITTER_URL}
        label={showLabel ? "Xwitter" : undefined}
      >
        <TwitterLogoIcon />
      </ContactIcon>
      <ContactIcon
        className="translate-y-[-1px] transform [&_svg]:!size-[1.25em]"
        href={config.LINKEDIN_URL}
        label={showLabel ? "LinkedIn" : undefined}
      >
        <IonSocialLinkedinOutline />
      </ContactIcon>
      <ContactIcon
        className="translate-y-[-1px] transform [&_svg]:!size-[1.25em]"
        href={config.GITHUB_URL}
        label={showLabel ? "Github" : undefined}
      >
        <MynauiBrandGithub />
      </ContactIcon>
      <ContactIcon
        label={showLabel ? "Substack" : undefined}
        href={config.SUBSTACK_URL}
        className="translate-y-[-1px] transform [&_svg]:!size-[1.25em]"
      >
        <ArcticonsSubstackReader />
        {/* <SimpleIconsSubstack /> */}
      </ContactIcon>

      {/* RSS? */}
      {/* <ContactIcon
        label={showLabel ? "Substack" : undefined}
        href={config.SUBSTACK_URL}
        className="translate-y-[-1px] transform [&_svg]:!size-[1.25em]"
      >
        <FluentRss20Regular />
      </ContactIcon> */}
    </ul>
  );
};
