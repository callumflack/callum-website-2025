// import { allPosts, Post } from "content-collections";
import { Text } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { Intro, PageInner, PageWrapper } from "@/components/page";
import config from "@/config";
// import { OutsetRule } from "@/components/elements";
// import { filterFeaturedBySlugs } from "@/lib/posts";

export default function Home() {
  // console.log(allPosts);
  // const featuredPosts = filterFeaturedBySlugs(allPosts);

  return (
    <PageWrapper showIntro={false} shareNode={null}>
      <PageInner variant="index">
        <header className="space-y-w6 container">
          <Intro showLabel={false} showLinks={false} textIntent="body" />
          {/* <Available /> */}
          {/* <OutsetRule ruleClassName="-mx-inset" /> */}
        </header>

        {/* xl:px-[4vw] */}
        <main className="space-y-w6 container">
          <hr />
          {/* <Text>Here&apos;s five things you should know about me:</Text> */}
          <div className="gap-w6 grid">
            {things.map((thing, index) => (
              <Card key={thing.heading} {...thing} index={index} />
            ))}
          </div>

          {/* <ul className="space-y-4">
          {allPosts.map((post) => (
            <li key={post._meta.path}>
            <NextLink href={`/${post.slug}`}>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            <MDXContent code={post.content} />
            </NextLink>
            </li>
            ))}
            </ul> */}

          {/* <GridLayout posts={featuredPosts} theme="default" /> */}
        </main>
      </PageInner>
    </PageWrapper>
  );
}

type Thing = {
  heading: string;
  text: string;
  link: string;
  linkLabel: string;
};

const things: Thing[] = [
  {
    // heading: "I'm a designer who codes.",
    heading: "Taste + engineering.",
    text: "From vision to details and back again, my job is to build beautiful hypertext interfaces that work in the blink of an eye, creating the most valued currency—trust.",
    link: config.SUBSTACK_URL,
    linkLabel: "I write occasional newsletters. You should subscribe.",
  },
  {
    heading: "I write to find the way.",
    text: "I post notes every other day. They're about design, code, and everything in between that goes toward making society better.",
    link: config.SUBSTACK_URL,
    linkLabel: "I write occasional newsletters. You should subscribe.",
  },
  {
    heading: "Just show me the work.",
    text: "Sure! So long as you know what a context window is. They're about design, code, and everything in between that goes toward making society better.",
    link: config.SUBSTACK_URL,
    linkLabel: "I write occasional newsletters. You should subscribe.",
  },
];

const Card = ({
  heading,
  text,
  link,
  linkLabel,
  index,
}: Thing & { index: number }) => {
  return (
    <div className="gap-w8 flex">
      <Text as="div" intent="super" className="min-w-[55px]">
        {index + 1}
      </Text>
      <div className="grow">
        {/* <Text as="h2" intent="body" weight="medium">
          {heading}
        </Text> */}
        <div className="space-y-2">
          <div className="">
            <Text as="h2" intent="body" weight="medium" className="inline">
              {heading}
            </Text>{" "}
            <Text as="p" intent="body" className="inline">
              {text}
            </Text>
          </div>

          <LinkWithArrow
            theme="feature"
            className="link text-solid no-underline"
            href={link}
          >
            {linkLabel}
          </LinkWithArrow>
        </div>
      </div>
    </div>
  );
};
