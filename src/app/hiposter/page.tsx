import type { Metadata } from "next";
import { PageWrapper } from "@/components/page";
import { HiPosterPlayerLoader } from "./hiposter-player-loader";

export const metadata: Metadata = {
  title: "HiPoster Animation",
};

export default function HiPosterPage() {
  return (
    <PageWrapper hideFooter showIntro={false}>
      <HiPosterPlayerLoader />
    </PageWrapper>
  );
}
