import { Asset } from "@/types/content";

// ManualPost interface that matches content collection Post where relevant
export interface ManualPost {
  title: string;
  date: string;
  summary?: string;
  slug?: string;
  assets: Asset[];
  noBorder?: boolean;
}

export const manualProjects: ManualPost[] = [
  {
    title: "Sagatiba for Saatchi & Saatchi, London",
    date: "2006-01-01",
    summary: "Illustration work for Saatchi & Saatchi London",
    assets: [
      {
        src: "/images/saatchi-sagatiba-1200.png",
        alt: "Sagatiba for Saatchi & Saatchi",
        aspect: "1200-1697",
      },
    ],
  },
  {
    title: "Poster for Millennius Fashion",
    date: "1998-01-01",
    summary: "Vintage poster design for fashion label",
    assets: [
      {
        src: "/images/_millennius-1211A.jpg",
        alt: "Poster for Millennius Fashion",
        aspect: "2480-3507",
      },
    ],
  },
  {
    title: "Campaign for Brisbane Arcade",
    date: "2001-01-01",
    summary: "Outdoor advertising campaign",
    slug: "breaka",
    assets: [
      {
        src: "/images/brisbane-arcade-love-me.jpg",
        alt: "Outdoor campaign for Brisbane Arcade",
        aspect: "1840-2519",
      },
    ],
  },
  {
    title: "Website and graphics for Jazz Tools",
    date: "2024-09-01",
    summary: "Unused concepts for jazz education platform",
    assets: [
      {
        src: "/images/jazz-home-hero-01-02.png",
        alt: "Website design & illustrations for Jazz Tools",
        aspect: "2532-2240",
      },
    ],
  },
  {
    title: "Logo for Musing Mind podcast",
    date: "2021-01-01",
    summary: "Podcast logo design",
    assets: [
      {
        src: "/images/musing-mind-podcast.jpg",
        alt: "Logo for Musing Mind podcast",
        aspect: "900-900",
      },
    ],
  },
  {
    title: "Icons for Ocean Blue Living",
    date: "2017-01-01",
    summary: "Visual identity system",
    assets: [
      {
        src: "/images/oceanblueliving-visual-system.png",
        alt: "Ocean Blue Living visual system",
        aspect: "1440-1200",
      },
    ],
  },
  {
    title: "Logo for Melbourne Soul Weekender",
    date: "2022-01-01",
    summary: "Logo for music event (Covid edition)",
    assets: [
      {
        src: "/images/MSW-2022.png",
        alt: "Logo for Melbourne Soul Weekender",
        aspect: "1440-1200",
      },
    ],
  },
  {
    title: "CD booklet for Votary Records",
    date: "2008-01-01",
    summary: "Music packaging design",
    assets: [
      {
        src: "/images/votary-innerspacedvd.jpg",
        alt: "InnerSpace CD booklet",
        aspect: "960-680",
      },
    ],
  },
  {
    title: "Waxidermy Mixtape Swap CD cover",
    date: "2010-01-01",
    summary: "Music packaging design for online community",
    assets: [
      {
        src: "/images/colouring-in-2010.png",
        alt: "CD cover for Waxidermy Mixtape Swap",
        aspect: "2000-2000",
      },
    ],
    noBorder: true,
  },
  {
    title: "Record cover for Dual Planet",
    date: "2011-01-01",
    summary: "Music packaging design",
    assets: [
      {
        src: "/images/dualplanet-donharper-cover.jpg",
        alt: "Record cover for Dual Planet",
        aspect: "3685-3712",
      },
    ],
    noBorder: true,
  },
  {
    title: "Logo for Roundtable Records",
    date: "2008-01-01",
    summary: "Logo design for record label",
    assets: [
      {
        src: "/images/roundtable-label-birds-2.jpg",
        alt: "Logo for Roundtable Records",
        aspect: "1200-800",
      },
    ],
  },
  {
    title: "Poster for Watch Your Step",
    date: "2010-01-01",
    summary: "Event poster design",
    assets: [
      {
        src: "/images/WYS11_GenericFlyer_01.jpg",
        alt: "Poster for Watch Your Step",
        aspect: "842-1191",
      },
    ],
  },
  {
    title: "Poster for Weird Gear",
    date: "2010-01-01",
    summary: "Event poster design",
    assets: [
      {
        src: "/images/WeirdGearBrisbane_1011.jpg",
        alt: "Poster for Weird Gear",
        aspect: "1000-1414",
      },
    ],
  },
  {
    title: "Poster for Weird Gear",
    date: "2011-01-01",
    summary: "Event poster design",
    assets: [
      {
        src: "/images/WeirdGearBrisbane_1101.jpg",
        alt: "Poster for Weird Gear",
        aspect: "1000-1414",
      },
    ],
  },
  {
    title: "Youtube brand for Deep Gospel Sound",
    date: "2015-01-01",
    summary: "Youtube channel branding",
    // slug: "deep-gospel-sound",
    assets: [
      {
        src: "/images/deep-soul-gospel.png",
        alt: "Youtube brand for Deep Gospel Sound",
        aspect: "1600-900",
      },
    ],
  },
  {
    title: "The Substation website",
    date: "2016-01-01",
    summary: "Website design for arts organization",
    assets: [
      {
        src: "/images/the-substation.png",
        alt: "The Substation website",
        aspect: "3000-2160",
      },
    ],
  },
  {
    title: "CD cover for Roundtable Records",
    date: "2011-01-01",
    summary: "Music packaging design",
    assets: [
      {
        src: "/images/roundtable-marinetti-back.jpg",
        alt: "Marinetti CD cover",
        aspect: "960-680",
      },
    ],
  },
  {
    title: "Poster for Vision Opera, London",
    date: "2005-01-01",
    summary: "Poster design for opera company",
    assets: [
      {
        src: "/images/visionopera-dido-aenaes-lg.jpg",
        alt: "Dido & Aeneas poster",
        aspect: "3508-4961",
      },
    ],
  },
  {
    title: "Record cover for Votary Records",
    date: "2009-01-01",
    summary: "Music packaging design",
    assets: [
      {
        src: "/images/votary-solarflares-coverback.jpg",
        alt: "Solar Flares record cover",
        aspect: "1200-800",
      },
    ],
  },
];
