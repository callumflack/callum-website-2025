import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { Mdx } from "@/components/mdx";
import { formatPostDate, getYear } from "@/lib/utils";
import type { Post } from "content-collections";

type Props = {
  post: Post;
};

export const PostPage = ({ post }: Props) => {
  const categoryLink = post.category === "projects" ? `/work` : `/writing`;
  // const tagsWithoutFeatured = post.tags?.filter((tag) => tag !== "featured");
  const date = formatPostDate(post.date);
  const year = getYear(post.date);
  const endYear = post.endDate ? getYear(post.endDate) : null;
  const lastEditedDate = post.lastEditedDate
    ? formatPostDate(post.lastEditedDate)
    : null;

  console.log(post);

  return (
    <>
      {post.slug !== "about" && (
        <TitleHeader>
          <Text as="h1" intent="title" balance>
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </Text>
          <Text as="div" intent="meta" dim className="flex items-center gap-2">
            <>
              {/* Date */}
              <span>
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
              </span>

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
    </>
  );
};
