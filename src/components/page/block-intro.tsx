import { Link, Text, TextProps } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { Contacts } from "@/components/page";
import config from "@/config";
import Image from "next/image";

type Props = {
  showLabel?: boolean;
  textIntent?: TextProps["intent"];
};

export const Intro = ({ showLabel = true, textIntent = "meta" }: Props) => {
  return (
    <div className="space-y-2.5">
      <Avatar />
      <Text as="p" intent={textIntent} balance>
        {/* I&apos;m Callum Flack — a software engineer, writer, and founder. I
        currently work as the CEO of Buttondown, the best way to start and grow
        your newsletter, and as a partner at Third South Capital. Read about me{" "} */}
        {/* I&apos;m Callum Flack—a design engineer and product leader with over 20
        years of experience. From vision to details, my job is to build
        beautifully designed hypertext apps that work in the blink of an eye,
        creating the most valued currency—trust. */}
        I&apos;m Callum Flack—a design engineer and product leader with over 20
        years of experience. I design and build beautiful hypertext products
        that work in the blink of an eye.{" "}
        <Text as="span" dim>
          <LinkWithArrow
            theme="default"
            className="link"
            href="/the-work-and-team-im-after"
          >
            {/* Read about what I do and who I work with */}
            Read about the work and team I&apos;m after
          </LinkWithArrow>
        </Text>
      </Text>

      <Contacts showLabel={showLabel} className="pt-0.5" />
    </div>
  );
};

export const Outro = ({ showLabel = true, textIntent = "meta" }: Props) => {
  return (
    <div className="space-y-2.5">
      <Text as="p" intent={textIntent} balance>
        The best way to stay in touch is to write me an{" "}
        <Link href={`mailto:${config.EMAIL}`} className="link">
          email
        </Link>
        . The second best way is to subscribe to my twice-yearly{" "}
        <Link href={config.SUBSTACK_URL} className="link">
          newsletter
        </Link>
        .
      </Text>

      <Contacts showLabel={showLabel} className="pt-0.5" />
    </div>
  );
};

export const Avatar = () => {
  return (
    <div className="shrink-0 pb-1">
      <Image
        src="/images/callum-flack.jpg"
        alt="Callum Flack"
        width={55}
        height={55}
        className="bg-background-hover rounded-full"
      />
    </div>
  );
};

export const WhatIWantLink = () => {
  return (
    <LinkWithArrow
      theme="feature"
      className="link no-underline"
      href="/the-work-and-team-im-after"
    >
      Read about what I do and who I work with
    </LinkWithArrow>
  );
};

export const SubstackLink = () => {
  return (
    <LinkWithArrow
      theme="feature"
      className="link no-underline"
      href={config.SUBSTACK_URL}
    >
      I write occasional newsletters. You should subscribe.
    </LinkWithArrow>
  );
};
