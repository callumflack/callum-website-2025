interface Quote {
  quote: string;
  author: string;
  source?: string;
}

export const quotes: Quote[] = [
  {
    quote:
      "The value of good design is only realised if you have an engineer capable of discerning the details in code (or if you’re lucky, they’re one and the same).",
    author: "Jim Nielsen",
    source: "https://twitter.com/jimniels/status/1623568177635667969)",
  },
  {
    quote:
      "If you have the words, there's always a chance that you'll find the way.",
    author: "Seamus Heaney",
    source:
      "https://www.irishtimes.com/news/ireland/irish-news/walk-on-air-against-your-better-judgment-heaney-on-life-poetry-god-and-ireland-1.1510774",
  },
  {
    quote:
      "People like beautiful things and for rational reasons. Because what does a beautiful thing tell you? Well, it tells you the person who made it really cared.",
    author: "John Collison",
    source: "https://x.com/benspringwater/status/1714407613117698082",
  },
  {
    quote:
      "Sometimes magic is just someone spending more time on something than anyone else might reasonably expect.",
    author: "Penn Jilette",
    source:
      "https://www.esquire.com/entertainment/interviews/a15810/teller-magician-interview-1012/",
  },
  {
    quote:
      "Inability to tolerate empty space limits the amount of space available.",
    author: "W. R. Bion",
    source:
      "https://www.therapysummit.com/article/wilfred-bion-and-the-importance-of-not-knowing-part-1/",
  },
];
