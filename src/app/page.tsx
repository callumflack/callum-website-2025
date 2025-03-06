import { allPosts, Post } from "content-collections";
// import { MDXContent } from "@content-collections/mdx/react";
import { Intro, PageWrapper } from "@/components/page";
// import { OutsetRule } from "@/components/elements";
import { Link, Text } from "@/components/atoms";
import { CardImage } from "@/components/card";
import { PostLinkHeadingWrapper } from "@/components/post/post-link-heading-wrapper";
import { filterFeaturedBySlugs } from "@/lib/posts";

export default function Home() {
  // console.log(allPosts);
  const featuredPosts = filterFeaturedBySlugs(allPosts);

  return (
    <PageWrapper showIntro={false} showShare={false}>
      <header className="space-y-w6 container">
        <Intro showLabel={false} textIntent="body" />
        {/* <Available /> */}
        {/* <OutsetRule ruleClassName="-mx-inset" /> */}
      </header>

      {/* xl:px-[4vw] */}
      <main className="space-y-w6 px-inset pt-w12 container">
        {/* <hr /> */}
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
        <div className="gap-w12 grid">
          {featuredPosts.map((post) => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      </main>
    </PageWrapper>
  );
}

const Card = ({ post }: { post: Post }) => {
  return (
    <Link
      key={post._id}
      href={post.thumbnailLink || post.slug}
      className="group flex flex-col gap-3 overflow-hidden"
    >
      <CardImage
        asset={post.assets?.[0] || { src: "", alt: "", aspect: "16-9" }}
        priority={false}
        className="w-full"
        sizes="(min-width: 1000px) 1080px, 100vw"
      />
      {/* CAPTION */}
      <div className="translate-y-[-0.2em] transform space-y-1">
        <PostLinkHeadingWrapper>
          <Text as="h2" weight="medium">
            {post.title}
          </Text>
        </PostLinkHeadingWrapper>
        <Text dim intent="meta">
          {post.summary}
          {/* <span className={cx("Text-subheading text-solid")}>
              {date ? format(parseISO(date), "yyyy") : "HEY"}
            </span> */}
        </Text>
        {/* {theme === "home" && <CardTitleMeta post={post} />} */}
      </div>
    </Link>
  );
};
