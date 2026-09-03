import type { Post } from "content-collections";
import Image from "next/image";
import type { ReactNode } from "react";
import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { Mdx } from "@/components/mdx";
import config from "@/config";
import {
  cn,
  formatPostDate,
  formatPostMonthYear,
  formatYear,
} from "@/lib/utils";

type Props = {
  post: Post;
  theme: "post" | "feed";
};

type PostMetaProps = Props & {
  dateFormat?: "default" | "monthYear" | "lastUpdatedMonthYear";
};

const categoryMeta = (category: Post["category"]) =>
  ({
    projects: { href: "/work", label: "Project" },
    writing: { href: "/writing", label: "Writing" },
    notes: { href: "/writing?sort=notes", label: "Notes" },
    shelf: { href: "/writing?sort=shelf", label: "Shelf" },
    page: null,
  })[category];

type CategoryMeta = NonNullable<ReturnType<typeof categoryMeta>>;

function PostMetaNav({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Text
      as="div"
      intent="pill"
      dim
      className={cn("flex items-center gap-2.5", className)}
    >
      {children}
    </Text>
  );
}

function MetaSep() {
  return (
    <span aria-hidden className="select-none">
      •
    </span>
  );
}

function MetaLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("hover:text-fill no-underline!", className)}
    >
      {children}
    </Link>
  );
}

function MetaHome() {
  return (
    <>
      <MetaLink href="/" className="inline-flex items-center gap-2.25">
        <Image
          src="/images/callum-flack.jpg"
          alt=""
          width={18}
          height={18}
          sizes="18px"
          className="bg-background-hover shrink-0 translate-y-[-0.1em] rounded-full"
        />
        Callum
      </MetaLink>
      <MetaSep />
    </>
  );
}

function MetaCategory({ category }: { category: CategoryMeta }) {
  return (
    <>
      <MetaLink href={category.href}>{category.label}</MetaLink>
      <MetaSep />
    </>
  );
}

export const PostPage = ({ post, theme }: Props) => {
  const isPage = post.type === "page";
  const category = categoryMeta(post.category);

  return (
    <>
      {!isPage && post.slug !== "about" && (
        <TitleHeader isContained={theme === "feed"}>
          <Text as="h1" intent="title" wrap="balance">
            <Link href={`/${post.slug}`} className="hover:text-accent">
              {post.title}
            </Link>
          </Text>
          {theme === "post" ? <PostMeta post={post} theme={theme} /> : null}
        </TitleHeader>
      )}

      <Mdx category={post.category} code={post.content}>
        {theme === "post" && post.tags ? (
          <PostMetaNav className="pt-minor">
            {category ? <MetaCategory category={category} /> : null}
            <PostTags tags={post.tags} />
          </PostMetaNav>
        ) : null}
        {theme === "feed" ? <PostMeta post={post} theme={theme} /> : null}
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
        : post.category === "writing" ||
            post.category === "notes" ||
            post.category === "shelf"
          ? monthYear
          : post.lastEditedDate
            ? `Last edited ${lastEditedDate}`
            : theme === "feed"
              ? date
              : year;
  const readingMinutes = Math.max(1, Math.floor(post.readingTime) - 1);
  const category = categoryMeta(post.category);

  return (
    <PostMetaNav>
      <MetaHome />
      {category ? <MetaCategory category={category} /> : null}
      <span>
        {post.projectIsOngoing ? <span>Since&nbsp;</span> : null}

        {post.category === "page" ? (
          dateContent
        ) : (
          <MetaLink href={`${categoryLink}?sort=year#${year}`}>
            {dateContent}
          </MetaLink>
        )}

        {endYear ? (
          <>
            &ndash;
            <MetaLink href={`${categoryLink}?sort=year#${endYear}`}>
              {endYear}
            </MetaLink>
          </>
        ) : null}
      </span>
      <MetaSep />
      {readingMinutes} min
      {readingMinutes !== 1 ? "s" : ""}
      {theme === "feed" ? (
        <ShareButtonWrapper
          url={`${config.PUBLIC_URL}/${post.slug}`}
          theme={theme}
        />
      ) : null}
    </PostMetaNav>
  );
};

export const PostTags = ({ tags }: { tags: string[] | undefined }) => {
  if (!tags) return null;

  return tags
    .filter((tag) => tag !== "featured")
    .map((tag) => (
      <MetaLink key={tag} href={`/topic/${tag}`}>
        {tag}
      </MetaLink>
    ));
};
