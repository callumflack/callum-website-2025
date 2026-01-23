import { buttonVariants, Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { Mdx } from "@/components/mdx";
import config from "@/config";
import { formatPostDate, formatYear } from "@/lib/utils";
import type { Post } from "content-collections";

type Props = {
  post: Post;
  theme: "post" | "feed";
};

export const PostPage = ({ post, theme }: Props) => {
  // console.log(post);
  const isPage = post.type === "page";

  return (
    <>
      {!isPage && post.slug !== "about" && (
        <TitleHeader isContained={theme === "feed"}>
          <Text as="h1" intent="title" balance>
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </Text>

          {theme === "post" && (
            <div className="flex items-center gap-2">
              <PostMeta post={post} theme={theme} />
              {/* <hr className="hr-vertical border-border-hover h-[12px]" /> */}
              {/* <PostTags tags={post.tags} /> */}
            </div>
          )}
        </TitleHeader>
      )}

      <Mdx code={post.content}>
        {theme === "post" && post.tags && (
          <div className="pt-w4 flex items-center gap-1">
            <Text intent="pill" dim>
              {post.tags.length > 1 ? "Topics:" : "Topic:"}
            </Text>
            <PostTags tags={post.tags} />
          </div>
        )}
        {theme === "feed" && <PostMeta post={post} theme={theme} />}
      </Mdx>
    </>
  );
};

const PostMeta = ({ post, theme }: Props) => {
  const categoryLink =
    post.category === "projects"
      ? "/work"
      : post.category === "notes"
        ? "/log"
        : "/writing";
  const date = formatPostDate(post.date);
  const year = formatYear(post.date);
  const endYear = post.endDate ? formatYear(post.endDate) : null;
  const lastEditedDate = post.lastEditedDate
    ? formatPostDate(post.lastEditedDate)
    : null;

  return (
    <Text as="div" intent="pill" dim className="flex items-center gap-2.5">
      <>
        {/* Date */}
        <span>
          {/* Ongoing */}
          {post.projectIsOngoing && <span>Since&nbsp;</span>}

          <Link href={`${categoryLink}?sort=year#${year}`}>
            {post.category === "writing" || post.category === "notes"
              ? date
              : post.lastEditedDate
                ? `Last edited ${lastEditedDate}`
                : theme === "feed"
                  ? date
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
        <>
          <hr className="hr-vertical border-border-hover h-[12px]" />
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
  );
};

export const PostTags = ({ tags }: { tags: string[] | undefined }) => {
  if (!tags) return null;

  return (
    <div className="flex items-center gap-1">
      {tags
        .filter((tag) => tag !== "featured")
        .map((tag) => (
          <Link
            key={tag}
            href={`/topic/${tag}`}
            className={buttonVariants({
              variant: "pillLink",
            })}
          >
            <span>{tag}</span>
          </Link>
        ))}
    </div>
  );
};
