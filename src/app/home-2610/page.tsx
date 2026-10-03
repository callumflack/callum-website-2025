import type { Metadata } from "next";
import { focusVisibleOutlineStyle, Link, Text } from "@/components/atoms";
import { Intro, PageWrapper } from "@/components/page";
import { cn } from "@/lib/utils";
import { HomeMarquee } from "./_components/home-marquee";
import { getHomeSlides } from "./_components/slides";
import styles from "./home.module.css";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/writing", label: "Writing" },
  { href: "/work", label: "Work" },
  { href: "/feed.xml", label: "RSS" },
];

export default function HomePreview() {
  return (
    <PageWrapper hideFooter navigation={null}>
      <main className={styles.home} data-slot="home-preview">
        <header className="pt-w20 pb-w24 container">
          <Intro
            showContacts={false}
            showCurrentPrev={false}
            textIntent="body"
            metaNode={
              <Text as="nav" aria-label="Sections" dim intent="meta">
                {navigation.map(({ href, label }, index) => (
                  <span key={href}>
                    {index > 0 && <span className="mx-1.5 font-light">|</span>}
                    <Link
                      className={cn(
                        "hover:text-fill",
                        focusVisibleOutlineStyle
                      )}
                      href={href}
                    >
                      {label}
                    </Link>
                  </span>
                ))}
              </Text>
            }
          />
        </header>
        <HomeMarquee slides={getHomeSlides()} />
      </main>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Home preview",
  robots: { index: false, follow: false },
};
