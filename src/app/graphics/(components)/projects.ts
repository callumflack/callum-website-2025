export interface ProjectImage {
  image: string;
  height: number;
  width: number;
}

export interface Project extends ProjectImage {
  title: string;
  date: string;
  caseStudyLink?: string;
  noBorder?: boolean;
}

const projects: Project[] = [
  {
    title: "Sagatiba illustration for Saatchi & Saatchi, London",
    date: "2006-01-01",
    image: "/images/saatchi-sagatiba-1200.png",
    width: 1200,
    height: 1697,
  },
  {
    title: "Poster for Millennius Fashion",
    date: "1998-01-01",
    image: "/images/_millennius-1211A.jpg",
    width: 2480,
    height: 3507,
  },
  // {
  //   title: "Logo for Barriosoundz",
  //   date: "2000-01-01",
  //   image: "/images/barriosoundz.jpg",
  // },
  {
    title: "Outdoor campaign for Brisbane Arcade",
    date: "2001-01-01",
    image: "/images/brisbane-arcade-love-me.jpg",
    caseStudyLink: "/breaka",
    width: 1840,
    height: 2519,
  },
  {
    title: "Website design & illustrations for Jazz Tools (unused)",
    date: "2024-09-01",
    image: "/images/jazz-home-hero-01-02.png",
    width: 2532,
    height: 2240,
  },
  {
    title: "Kalaurie website",
    date: "2020-01-01",
    image: "/images/kalaurie-overview-poster-1600-1000.jpg",
    caseStudyLink: "/kalaurie",
    width: 3200,
    height: 2000,
  },
  {
    title: "Library of Economic Possibility website",
    date: "2021-01-01",
    image: "/images/lep-brand-clean-1600-1000.jpg",
    caseStudyLink: "/the-library-of-economic-possibility",
    width: 3200,
    height: 2000,
  },
  {
    title: "Logo for Oshan Jarrow's Musing Mind podcast",
    date: "2021-01-01",
    image: "/images/musing-mind-podcast.jpg",
    width: 1400,
    height: 1400,
  },
  {
    title: "Ocean Blue Living",
    date: "2017-01-01",
    image: "/images/oceanblueliving-visual-system.png",
    width: 1440,
    height: 1200,
  },
  // {
  //   title: "Logo for Feedback Cafe",
  //   date: "2009-01-01",
  //   image: "/images/FB002_Sign1mW_M01.jpg",
  // },
  {
    title: "Replier logotype",
    date: "2020-01-01",
    image: "/images/replier-card.jpg",
    caseStudyLink: "/replier",
    width: 3840,
    height: 2160,
  },
  {
    title: "Logo for Melbourne Soul Weekender (Covid edition)",
    date: "2022-01-01",
    image: "/images/MSW-2022.png",
    width: 2000,
    height: 2000,
  },
  {
    title: "InnerSpace CD booklet for Votary Records",
    date: "2008-01-01",
    image: "/images/votary-innerspacedvd.jpg",
    width: 960,
    height: 680,
  },
  {
    title: "CD cover for the famous Waxidermy Mixtape Swap",
    date: "2010-01-01",
    image: "/images/colouring-in-2010.png",
    noBorder: true,
    width: 2000,
    height: 2000,
  },
  {
    title: "Record cover for Dual Planet",
    date: "2011-01-01",
    image: "/images/dualplanet-donharper-cover.jpg",
    noBorder: true,
    width: 3685,
    height: 3712,
  },
  {
    title: "Logo for Roundtable Records",
    date: "2008-01-01",
    image: "/images/roundtable-label-birds-2.jpg",
    width: 1200,
    height: 800,
  },
  {
    title: "Poster for Watch Your Step",
    date: "2010-01-01",
    image: "/images/WYS11_GenericFlyer_01.jpg",
    width: 842,
    height: 1191,
  },
  {
    title: "Poster for Weird Gear",
    date: "2010-01-01",
    image: "/images/WeirdGearBrisbane_1011.jpg",
    width: 1000,
    height: 1414,
  },
  {
    title: "Another poster for Weird Gear",
    date: "2011-01-01",
    image: "/images/WeirdGearBrisbane_1101.jpg",
    width: 1000,
    height: 1414,
  },
  {
    title: "Youtube brand system for Deep Gospel Sound",
    date: "2015-01-01",
    // image: "/images/BJL-DeepGospelSound-M03.jpg",
    image: "/images/deep-soul-gospel.png",
    caseStudyLink: "https://www.youtube.com/@DeepGospelSound",
    width: 1600,
    height: 900,
  },
  {
    title: "The Substation website",
    date: "2016-01-01",
    image: "/images/the-substation.png",
    width: 3000,
    height: 2160,
  },
  {
    title: "Marinetti CD cover for Roundtable Records",
    date: "2011-01-01",
    image: "/images/roundtable-marinetti-back.jpg",
    width: 960,
    height: 680,
  },
  {
    title: "Dido & Aeneas poster for Vision Opera, London",
    date: "2005-01-01",
    image: "/images/visionopera-dido-aenaes-lg.jpg",
    width: 3508,
    height: 4961,
  },
  {
    title: "Solar Flares record cover for Votary Records",
    date: "2009-01-01",
    image: "/images/votary-solarflares-coverback.jpg",
    width: 1200,
    height: 800,
  },
];

export default projects;
