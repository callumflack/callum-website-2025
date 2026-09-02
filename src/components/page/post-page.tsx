import { buttonVariants, Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { Mdx } from "@/components/mdx";
import config from "@/config";
import { formatPostDate, formatPostMonthYear, formatYear } from "@/lib/utils";
import type { Post } from "content-collections";

type Props = {
  post: Post;
  theme: "post" | "feed";
};

type PostMetaProps = Props & {
  dateFormat?: "default" | "monthYear" | "lastUpdatedMonthYear";
};

const categoryMeta = (category: Post["category"]) =>
  ({
    projects: { href: "/work", label: "Projects" },
    writing: { href: "/writing", label: "Writing" },
    notes: { href: "/writing?sort=notes", label: "Notes" },
    shelf: { href: "/writing?sort=shelf", label: "Shelf" },
    page: null,
  })[category];

export const PostPage = ({ post, theme }: Props) => {
  // console.log(post);
  const isPage = post.type === "page";

  return (
    <>
      {!isPage && post.slug !== "about" && (
        <TitleHeader isContained={theme === "feed"}>
          <Text as="h1" intent="title" wrap="balance">
            <Link href={`/${post.slug}`} className="hover:text-accent">
              {post.title}
            </Link>
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
            {categoryMeta(post.category) && (
              <Text
                as="div"
                intent="pill"
                dim
                className="flex items-center gap-2.5 pr-1.5"
              >
                <Link
                  href={categoryMeta(post.category)!.href}
                  className="hover:text-fill no-underline!"
                >
                  {categoryMeta(post.category)!.label}
                </Link>
                <hr className="hr-vertical border-border-hover h-[12px] border-l!" />
              </Text>
            )}
            <PostTags tags={post.tags} />
          </div>
        )}
        {theme === "feed" && <PostMeta post={post} theme={theme} />}
      </Mdx>
    </>
  );
};

export const PostMeta = ({
  post,
  theme,
  dateFormat = "default",
}: PostMetaProps) => {
  const categoryLink =
    post.category === "projects"
      ? "/work"
      : post.category === "notes"
        ? "/log"
        : "/writing";
  const date = formatPostDate(post.date);
  const monthYear = formatPostMonthYear(post.date);
  const year = formatYear(post.date);
  const endYear = post.endDate ? formatYear(post.endDate) : null;
  const lastEditedDate = post.lastEditedDate
    ? formatPostDate(post.lastEditedDate)
    : null;
  const lastEditedMonthYear = post.lastEditedDate
    ? formatPostMonthYear(post.lastEditedDate)
    : null;
  const dateContent =
    dateFormat === "monthYear"
      ? monthYear
      : dateFormat === "lastUpdatedMonthYear"
        ? `Last updated ${lastEditedMonthYear ?? monthYear}`
        : post.category === "writing" || post.category === "notes"
          ? date
          : post.lastEditedDate
            ? `Last edited ${lastEditedDate}`
            : theme === "feed"
              ? date
              : year;
  const readingMinutes = Math.max(1, Math.floor(post.readingTime) - 1);
  const category = categoryMeta(post.category);

  return (
    <Text as="div" intent="pill" dim className="flex items-center gap-2.5">
      <>
        {/* Category */}
        {category && (
          <>
            <Link href={category.href} className="hover:text-fill no-underline">
              {category.label}
            </Link>
            <hr className="hr-vertical border-border-hover h-[12px]" />
          </>
        )}

        {/* Date */}
        <span>
          {/* Ongoing */}
          {post.projectIsOngoing && <span>Since&nbsp;</span>}

          {post.category === "page" ? (
            dateContent
          ) : (
            <Link href={`${categoryLink}?sort=year#${year}`}>
              {dateContent}
            </Link>
          )}

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
          {readingMinutes} min
          {readingMinutes !== 1 ? "s" : ""}
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
