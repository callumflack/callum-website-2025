import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { Mdx } from "@/components/mdx";
import config from "@/config";
import { formatPostDate, getYear } from "@/lib/utils";
import type { Post } from "content-collections";
type Props = {
  post: Post;
  theme?: "post" | "feed";
};

export const PostPage = ({ post, theme = "post" }: Props) => {
  const categoryLink = post.category === "projects" ? `/work` : `/writing`;
  // const tagsWithoutFeatured = post.tags?.filter((tag) => tag !== "featured");
  const date = formatPostDate(post.date);
  const year = getYear(post.date);
  const endYear = post.endDate ? getYear(post.endDate) : null;
  const lastEditedDate = post.lastEditedDate
    ? formatPostDate(post.lastEditedDate)
    : null;

  // console.log(post);

  return (
    <>
      {post.slug !== "about" && (
        <TitleHeader isContained={theme === "feed"}>
          <Text as="h1" intent="title" balance>
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </Text>
          <Text as="div" intent="pill" dim className="flex items-center gap-3">
            <>
              {/* Date */}
              <span>
                {post.projectIsOngoing && <span>Since&nbsp;</span>}

                <Link
                  // className="capitalize"
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
              </span>

              {/* Reading time */}
              {/* {(post.category === "writing" || post.category === "note") &&
              post.readingTime >= 3 ? ( */}
              <>
                <hr className="hr-vertical border-border-hover h-[13px]" />
                {Math.max(
                  1,
                  post.readingTime % 1 >= 0.7
                    ? Math.ceil(post.readingTime)
                    : Math.floor(post.readingTime)
                )}{" "}
                min
                {Math.max(
                  1,
                  post.readingTime % 1 >= 0.7
                    ? Math.ceil(post.readingTime)
                    : Math.floor(post.readingTime)
                ) !== 1
                  ? "s"
                  : ""}
              </>

              {/* Feed share */}
              {theme === "feed" && (
                <ShareButtonWrapper
                  url={`${config.PUBLIC_URL}/${post.slug}`}
                  theme={theme}
                />
              )}
            </>
          </Text>
        </TitleHeader>
      )}

      {/* <PostMeta post={post} /> */}
      <Mdx code={post.content}></Mdx>
    </>
  );
};
