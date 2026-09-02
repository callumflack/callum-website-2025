import Image from "next/image";
import {
  focusVisibleOutlineStyle,
  Link,
  Text,
  type TextProps,
} from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { Contacts } from "@/components/page";
import config from "@/config";
import { cn } from "@/lib/utils";

const INTRO_NAV = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/log", label: "Log" },
] as const;

type Props = {
  showLabel?: boolean;
  showWhatIWant?: boolean;
  showCurrentPrev?: boolean;
  showContacts?: boolean;
  textIntent?: TextProps["intent"];
};

export const Intro = ({
  showLabel = true,
  showWhatIWant = true,
  showCurrentPrev = true,
  showContacts = true,
  textIntent = "meta",
}: Props) => {
  return (
    <div className="space-y-2.5">
      <Avatar />
      <Text as="h1" intent={textIntent} wrap="pretty" className="lg:pr-small">
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
        {/* Hi, I&apos;m Callum Flack, a designer and engineer from Australia. I create beautiful hypertext products that work in the blink of an eye, creating the most valued currency—trust.  */}
        {/* Hi, I&apos;m Callum Flack, a designer and engineer from Australia. I
        shape product interfaces from fragile idea to production, bringing
        language, interaction and React into the same loop to make software feel
        clear, fast and trustworthy.{" "} */}
        {/* Hi, I&apos;m Callum Flack, an Australian designer and engineer. I unite
        language, interaction and code in beautiful hypertext products that work
        in the blink of an eye, earning the most valuable currency—trust.{" "} */}
        Hi, I&apos;m Callum Flack, an Australian designer-engineer. I began in
        brand design, moved into code to design the whole product, and now work
        across interface design, code and context engineering. Currently
        plucking language models to unlock the adjacent possible.{" "}
        {showWhatIWant && (
          <Text as="span">
            <LinkWithArrow
              theme="default"
              className={cn("link", focusVisibleOutlineStyle)}
              href="/about"
            >
              Read more
            </LinkWithArrow>
          </Text>
        )}
      </Text>
      {/* <Text as="p" intent={textIntent} wrap="pretty">
        I’m interested in how AI changes software design: the language,
        constraints and feedback loops that help people and agents build
        coherent products together. If you are too, say hello.{" "}
        {showWhatIWant && (
          <Text as="span">
            <LinkWithArrow
              theme="default"
              className={cn("link", focusVisibleOutlineStyle)}
              href="/about"
            >
              Read more
            </LinkWithArrow>
          </Text>
        )}
      </Text> */}
      {showCurrentPrev && (
        <Text as="p" intent="meta" wrap="pretty" dim>
          Current: Vana
          <span className="mx-1.5 font-light">|</span>
          Prev: Cleared (first commit → sale), Saatchi & Saatchi (brand)
        </Text>
      )}

      {showContacts ? (
        <div className="flex items-center justify-between gap-4 pt-0.5">
          <Contacts showLabel={showLabel} />
          {/* <nav aria-label="Sections" className="flex items-center gap-3">
            {INTRO_NAV.map((item) => (
              <LinkWithArrow
                className={cn(
                  "text-meta no-underline! hover:text-accent",
                  focusVisibleOutlineStyle
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </LinkWithArrow>
            ))}
          </nav> */}
        </div>
      ) : null}
    </div>
  );
};

export const Outro = ({ showLabel = true, textIntent = "meta" }: Props) => {
  return (
    <div className="space-y-2.5">
      <Text as="p" intent={textIntent} wrap="balance">
        The best way to connect is to{" "}
        <Link
          href={`mailto:${config.EMAIL}`}
          className={cn("link", focusVisibleOutlineStyle)}
        >
          email me
        </Link>{" "}
        .{" "}
        {/* <span className="lg:table">
          The second best way is to subscribe to{" "}
          <Link href={config.SUBSTACK_URL} className="link">
            my newsletter
          </Link>
          .
        </span> */}
        <span className="lg:table">
          The second best way is to chat on{" "}
          <Link
            href={config.TWITTER_URL}
            className={cn("link", focusVisibleOutlineStyle)}
          >
            Xwitter
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
      className={cn("link no-underline", focusVisibleOutlineStyle)}
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
      className={cn("link no-underline", focusVisibleOutlineStyle)}
      href={config.SUBSTACK_URL}
    >
      I write occasional newsletters. You should subscribe.
    </LinkWithArrow>
  );
};
