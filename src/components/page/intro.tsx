import { Text, TextProps } from "@/components/atoms";
import { Contacts } from "@/components/page";
import config from "@/config";
import Image from "next/image";
import { LinkWithArrow } from "../elements";
type Props = {
  showLabel?: boolean;
  textIntent?: TextProps["intent"];
};

export const Intro = ({ showLabel = true, textIntent = "meta" }: Props) => {
  return (
    <div className="space-y-2.5">
      <div className="shrink-0 pb-1">
        <Image
          src="/images/callum-flack.jpg"
          alt="Callum Flack"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>

      <Text as="p" intent={textIntent}>
        {/* I&apos;m Callum Flack — a software engineer, writer, and founder. I
        currently work as the CEO of Buttondown, the best way to start and grow
        your newsletter, and as a partner at Third South Capital. Read about me{" "} */}
        I&apos;m Callum Flack—a design engineer and product leader with over 20
        years of experience. From vision to details, my job is to build
        beautifully designed hypertext apps that work in the blink of an eye,
        creating the most valued currency—trust.
        {/* <Link href="/about" className="link">
          here
        </Link>
        . */}
      </Text>
      <Text intent={textIntent} dim className="flex flex-col gap-1">
        <WhatIWantLink />
        <SubstackLink />
      </Text>
      {/* <Text intent={textIntent} dim>
        <Suspense fallback={<>Loading time…</>}>
          <SiteTime />
        </Suspense>
      </Text> */}
      <Contacts showLabel={showLabel} className="pt-2" />

      {/* <hr className="my-w6" />
          <div className="grid grid-cols-2 gap-4">
            <div className="X">
              <Text as="h3" intent="meta">
                Featured Posts
              </Text>
              <Text as="ul" intent="meta" className="space-y-1 !pl-0">
                {allPosts
                  .filter(
                    (post) => post.tags?.includes("featured") && !post.draft
                  )
                  .map((post) => (
                    <li key={post.slug}>
                      <Link href={`/${post.slug}`}>{post.title}</Link>
                    </li>
                  ))}
              </Text>
            </div>
            <div className="Y">
              <Text as="h3" intent="meta">
                Featured Posts
              </Text>
              <Text as="ul" intent="meta" className="space-y-1 !pl-0">
                {allPosts
                  .filter(
                    (post) => post.tags?.includes("featured") && !post.draft
                  )
                  .map((post) => (
                    <li key={post.slug}>
                      <Link href={`/${post.slug}`}>{post.title}</Link>
                    </li>
                  ))}
              </Text>
            </div>
          </div> */}

      {/* <hr className="my-w6" />
          <Text intent="meta" dim>
            <Suspense fallback={<>Loading time…</>}>
              <SiteTime />
            </Suspense>
          </Text> */}
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
