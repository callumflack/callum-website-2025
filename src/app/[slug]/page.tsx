import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { Mdx } from "@/components/mdx";
import { isVideoFile } from "@/components/media";
import { PageWrapper } from "@/components/page";
import config from "@/config";
import { formatPostDate, getYear } from "@/lib/utils";
import { allPosts } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
// import { MdiLanguageMarkdownOutline } from "@/components/icons/MdiLanguageMarkdownOutline";
// import { PagePost } from "@/components/page";

interface Params {
  slug: string;
}

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const categoryLink = post.category === "projects" ? `/work` : `/writing`;
  // const tagsWithoutFeatured = post.tags?.filter((tag) => tag !== "featured");
  const date = formatPostDate(post.date);
  const year = getYear(post.date);
  const endYear = post.endDate ? getYear(post.endDate) : null;
  const lastEditedDate = post.lastEditedDate
    ? formatPostDate(post.lastEditedDate)
    : null;

  // console.log(post);

  const renderActiveNav = () => {
    if (post.category === "projects") return "/work";
    if (post.category === "writing") return "/writing";
    return undefined;
  };

  return (
    <PageWrapper activeNav={renderActiveNav()} showShare showIntro>
      {post.slug !== "/about" && (
        <TitleHeader>
          <Text as="h1" intent="title" balance>
            {post.title}
          </Text>
          <Text intent="meta" dim className="flex items-center gap-2">
            <>
              {/* Date */}
              <Link
                className="capitalize"
                href={`${categoryLink}?sort=year#${year}`}
              >
                {post.category === "writing" || post.category === "note"
                  ? date
                  : post.lastEditedDate
                    ? `Last edited ${lastEditedDate}`
                    : year}
              </Link>

              {/* End date, e.g. for a project */}
              {endYear ? (
                <>
                  &ndash;
                  <Link href={`${categoryLink}?sort=year#${endYear}`}>
                    {endYear}
                  </Link>
                </>
              ) : null}

              {/* Reading time */}
              {(post.category === "writing" || post.category === "note") &&
              post.readingTime >= 3 ? (
                <>
                  <hr className="hr-vertical border-border-hover h-[13px]" />
                  {post.readingTime % 1 >= 0.7
                    ? Math.ceil(post.readingTime)
                    : Math.floor(post.readingTime)}{" "}
                  min
                  {(post.readingTime % 1 >= 0.7
                    ? Math.ceil(post.readingTime)
                    : Math.floor(post.readingTime)) !== 1
                    ? "s"
                    : ""}
                </>
              ) : null}
            </>
          </Text>
        </TitleHeader>
      )}

      {/* <PostMeta post={post} /> */}
      <Mdx code={post.content}></Mdx>
    </PageWrapper>
  );
}

export function generateStaticParams(): Params[] {
  return allPosts.map((post) => ({
    slug: post._meta.path,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) {
    return;
  }

  const { title, date: publishedTime, summary: description, assets } = post;
  const asset = assets?.[0];
  let image;

  if (asset?.src) {
    if (isVideoFile(asset.src) && asset.poster) {
      image = `${config.PUBLIC_URL}${asset.poster}`;
    } else {
      image = `${config.PUBLIC_URL}${asset.src}`;
    }
  } else {
    image = `${config.PUBLIC_URL}/opengraph-image.png`;
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Callum Flack`,
      description,
      type: "article",
      publishedTime,
      url: `${config.PUBLIC_URL}/${post.slug}`,
      images: [
        {
          url: image,
        },
      ],
    },
  };
}
