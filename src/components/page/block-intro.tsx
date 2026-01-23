import { Link, Text, TextProps } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { Contacts } from "@/components/page";
import config from "@/config";
import Image from "next/image";

type Props = {
  showLabel?: boolean;
  showWhatIWant?: boolean;
  textIntent?: TextProps["intent"];
};

export const Intro = ({
  showLabel = true,
  showWhatIWant = true,
  textIntent = "meta",
}: Props) => {
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
        {/* I&apos;m Callum Flack—a design engineer and product leader with over 20  years of experience. I design and build beautiful hypertext products that work in the blink of an eye.{" "} */}
        {/* I collapse the gap between all three
        disciplines to raise the floor of quality and spot pitfalls before they
        cost you.  */}
        {/* I&apos;m Callum Flack—a designer, developer and product leader with over
        20 years of experience. I am a full-spectrum builder who can operate
        from brand strategy down to TypeScript types. I think about how the
        database schema will affect the brand perception will affect the user
        retention will affect the component architecture. */}
        {/* I&apos;m Callum Flack—a designer, developer and product leader. with
        over 20 years of experience. One person, three disciplines, faster
        cycles, higher quality.{" "} */}
        {/* I&apos;m Callum Flack—a designer, developer and product leader. In an
        AI-saturated world, I bring what&apos;s actually scarce: taste backed by
        execution. I design beautiful things and I can build them. This helps teams not only ship faster but enhance quality.
        don&apos;t just write clean code—I ensure it works in the blink of an
        eye, creating the most valued currency—trust.{" "} */}
        I&apos;m Callum Flack—a designer, developer and product leader with over
        20 years experience. From brand to backend, I design and build beautiful
        hypertext products that work in the blink of an eye, creating the most
        valued currency—trust.{" "}
        {showWhatIWant && (
          <Text as="span">
            <LinkWithArrow theme="default" className="link" href="/about">
              Read more
            </LinkWithArrow>
          </Text>
        )}
      </Text>
      <Text as="p" intent="meta" balance dim>
        Current: Vana / Previously: Cleared (first commit → sale), Saatchi &
        Saatchi (brand)
      </Text>

      <Contacts showLabel={showLabel} className="pt-0.5" />
    </div>
  );
};

export const Outro = ({ showLabel = true, textIntent = "meta" }: Props) => {
  return (
    <div className="space-y-2.5">
      <Text as="p" intent={textIntent} balance>
        The best way to connect is to{" "}
        <Link href={`mailto:${config.EMAIL}`} className="link">
          email me
        </Link>{" "}
        .{" "}
        <span className="lg:table">
          The second best way is to subscribe to{" "}
          <Link href={config.SUBSTACK_URL} className="link">
            my newsletter
          </Link>
          .
        </span>
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
