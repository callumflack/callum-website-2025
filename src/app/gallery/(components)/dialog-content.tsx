"use client";

import { Text } from "@/components/atoms";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogContent as RadixDialogContent,
} from "@/components/ui/dialog";
import { LinkWithArrow } from "@/components/elements";
import { MediaFigure, mediaWrapperVariants, Video } from "@/components/media";
import { getYear } from "@/lib/utils";
import { cx } from "cva";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { CardIcon } from "@/components/card";
import type { Project } from "./projects";

export interface DialogContentProps {
  project: Project;
  isModal: boolean;
}

export const DialogContent = ({ project, isModal }: DialogContentProps) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const { width, height, image, title } = project;

  const content = (
    <MediaFigure
      caption={<Caption project={project} />}
      className="space-y-3 [&_img]:min-h-[60vh] [&_video]:min-h-[60vh]"
      figureIntent="superOutset"
      isPortrait={height >= width}
      style={{
        aspectRatio: `${width}/${height}`,
      }}
    >
      {project.video ? (
        <Video
          key={project.video}
          aspect={project.aspect || 16 / 9}
          className=""
          poster={project.image}
          src={project.video}
        />
      ) : (
        <Image
          alt={title}
          className={cx(
            mediaWrapperVariants({
              border: false,
              background: false,
              rounded: false,
            })
          )}
          height={height}
          sizes="(min-width: 1024px) 940px, (min-width: 700px) 660px, 100vw"
          src={image}
          style={{
            aspectRatio: `${width}/${height}`,
          }}
          width={width}
        />
      )}
    </MediaFigure>
  );

  if (!isModal) {
    return content;
  }

  return (
    <Dialog onOpenChange={(open) => !open && handleClose()} open>
      <RadixDialogContent
        aria-describedby={title}
        className="container flex"
        overlayClassName="cursor-zoom-out"
        showClose={false}
        // Prevent focus from returning to the trigger
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        // overlayClassName="bg-background-active cursor-zoom-out"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{title}</DialogDescription>
        <DialogClose className="w-full cursor-zoom-out">{content}</DialogClose>
      </RadixDialogContent>
    </Dialog>
  );
};

// alt caption wrapper
{
  /* <div>
  <hr className="border-border-hover hidden translate-y-[0.15em] transform sm:block" />
  <div className="sm:pt-3">
    <Caption project={project} />
  </div>
</div>; */
}

const Caption = ({ project }: { project: Project }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
    <div className="flex items-baseline gap-2">
      <Text
        as="h2"
        className="flex gap-2"
        color="fill"
        intent="body"
        weight="medium"
      >
        {project.title}
      </Text>
      {/* <hr className={hrStyle} /> */}
      {/* {getYear(project.date)} */}
      {/* duplicated from CardTitleMeta */}
      {/* <CardTitleMeta post={project} /> */}
      {/* translate-y-px transform */}
      <Text className="flex shrink-0 items-center gap-2" dim intent="meta">
        {/* <CardIcon category="projects" className="hidden sm:block" /> */}
        <span className="hidden sm:block">{getYear(project.date)}</span>
      </Text>
    </div>

    <div className="flex shrink-0 items-baseline gap-2">
      {/* <CardIcon category="projects" className="sm:hidden" /> */}
      <span className="sm:hidden">{getYear(project.date)}</span>
      {project.caseStudyLink ? (
        <>
          {/* sm:hidden */}
          <hr className="hr-vertical border-border-hover h-[0.7em] translate-y-[0.15em] transform" />
          <LinkWithArrow
            className="group link-alt block"
            href={project.caseStudyLink}
          >
            Case study
          </LinkWithArrow>
        </>
      ) : null}
    </div>
  </div>
);
