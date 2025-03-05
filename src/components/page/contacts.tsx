import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { cx } from "cva";
import {
  IonSocialLinkedinOutline,
  MynauiBrandGithub,
  SimpleIconsSubstack,
} from "@/components/icons";
import config from "@/config";
import { ContactIcon } from "./contact-icon";
import { EmailIcon } from "./email-icon";

export const Contacts = ({
  showLabel,
  theme = "inline",
  className,
}: {
  showLabel?: boolean;
  theme?: "inline" | "list";
  className?: string;
}) => {
  return (
    <ul
      className={cx(
        "link-block-reset no-bullets",
        theme === "inline" ? "-ml-2 flex items-center" : "flex flex-col",
        showLabel ? "gap-[2px]" : "gap-0.5",
        className
      )}
    >
      <EmailIcon email={config.EMAIL} showLabel={showLabel} />
      <ContactIcon
        className="translate-y-[-0.05em] transform"
        href={config.TWITTER_URL}
        label={showLabel ? "Twitter" : undefined}
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
      {/* <ContactIcon
        className="translate-y-[-1px] transform [&_svg]:!size-[1.25em]"
        href={config.READCV_URL}
        label={showLabel ? "Read CV" : undefined}
      >
        <ReadCv />
      </ContactIcon> */}
      <ContactIcon
        label={showLabel ? "Substack" : undefined}
        href={config.SUBSTACK_URL}
        className="translate-y-[-1px] transform [&_svg]:!size-[0.9em]"
      >
        <SimpleIconsSubstack />
      </ContactIcon>
    </ul>
  );
};
