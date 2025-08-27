import { cx } from "cva";
import NextLink from "next/link";
import { Fragment } from "react";
import { Link } from "@/components/atoms";
import { noteStyle } from "@/components/mdx/mdx-styles";
import { formatYear } from "@/lib/utils";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { type Post } from "content-collections";

/* <a
  href={`${config.GITHUB_URL}/commits/main/posts/${post.slug}.mdx`}
  target="_blank"
  rel="noopener noreferrer"
>
  Git log
</a> */
/* <p className="flex items-center gap-2.5">
  <a
    href={`https://github.com/callumflack/callum-flack-design/blob/master/pages/_posts/${post.slug}.md`}
    target="_blank"
    rel="noopener noreferrer"
    className="link-alt"
  >
    Comments welcome
  </a>
</p> */

export const PostMeta = ({ post }: { post: Post }) => {
  const categoryLink = post.category === "projects" ? `/work` : `/writing`;
  const tagsWithoutFeatured = post.tags?.filter((tag) => tag !== "featured");

  const year = formatYear(post.date);
  const endYear = post.endDate ? formatYear(post.endDate) : null;

  return (
    <div className={cx(noteStyle, "link-block-alt link-block-large")}>
      <span>
        Superset:{" "}
        <Link className="capitalize" href={categoryLink}>
          {post.category}
        </Link>
      </span>
      <br />
      {tagsWithoutFeatured?.length ? (
        <span>
          Topics:{" "}
          {tagsWithoutFeatured.map((tag, i) => (
            <Fragment key={tag}>
              <NextLink
                className="capitalize"
                href={`${categoryLink}?sort=topic#${tag}`}
              >
                {tag.replaceAll("-", " ")}
              </NextLink>
              {i !== tagsWithoutFeatured.length - 1 && ", "}
            </Fragment>
          ))}
        </span>
      ) : null}
      <br />
      <span>
        Year:{" "}
        <Link className="capitalize" href={`${categoryLink}?sort=year#${year}`}>
          {year}
        </Link>
        {endYear ? (
          <>
            &ndash;
            <Link href={`${categoryLink}?sort=year#${endYear}`}>{endYear}</Link>
          </>
        ) : null}
      </span>
      {post.tweet ? (
        <>
          <br />
          <span>
            Tweetback:{" "}
            <Link
              className="inline-flex items-center gap-[1px]"
              href={post.tweet}
            >
              link
              <ArrowTopRightIcon className="mt-[0.02em] size-[0.9em]" />
            </Link>
          </span>
        </>
      ) : null}
    </div>
  );
};
