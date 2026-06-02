import type { HomePost, SliderSlide } from "@/types/home";

export const site = {
  title: "George Attla - Making of a Champion",
  tagline: "54 Years of Competitive Sled Dog Racing: 1958-2011",
  rssUrl: "https://attlamakingofachampion.com/feed/",
};

export { exploreNav, navItems, primaryBarNav } from "@/data/navigation";

/** Static homepage hero (original slideshow used this frame). */
export const homeHero: SliderSlide = {
  src: "/images/attla/1980-slideshow1-900x300.jpg",
  alt: "George Attla 1982",
};

export const youtubeEmbed = "https://www.youtube.com/embed/L3sCrvijJ-E";

export const posts: HomePost[] = [
  {
    title: "Youth & Sled Dog Program",
    excerpt: "How to start and run a youth and sled dog program",
    image: "/images/attla/youth-day-400x200.jpg",
    href: "/youth-sled-dog-program",
  },
  {
    title: "The Race",
    excerpt:
      "THE RACE (Excerpts) Get a glimpse of the thrill of high-speed sled dog racing as",
    image: "/images/attla/the-race-400x228.png",
    href: "/the-race-2",
  },
  {
    title: "Mindset of a Champion",
    excerpt:
      "George Attla says winning is all in the head. He explains a champion always",
    image: "/images/attla/mindset-400x145.jpg",
    href: "/on-mindset-2",
  },
  {
    title: "Get Involved – Start Mushing!",
    excerpt: "Learn about Dog Mushing Welcome Beginners!",
    image: "/images/attla/mush-400x286.jpg",
    href: "/get-involved-start-mushing",
  },
  {
    title: "Visit a Dog Mushing Museum",
    excerpt:
      "The only Dog Mushing Museum in Fairbanks is in the same building as",
    image: "/images/attla/visit.jpg",
    href: "/visit-a-dog-mushing-museum",
  },
  {
    title: "Sprint Racing",
    excerpt:
      "Photo by Heath Sandall of the 2004 Open North American World Championship 2011 marked",
    image: "/images/attla/sprint-racing.jpg",
    href: "/sprint-racing-2",
  },
  {
    title: "Dogs of Speed",
    excerpt:
      "Speed Racers Lighter, Faster Sprint Dogs Thrill Mushers and Fans Long ago sprint racing was the sport that grabbed Alaska's attention each winter. The racing is all about speed. Though over shadowed by the national popularity of the thousand-mile Iditarod race, sprint racing appears to be making a comeback all over the State with a new breed of dog and musher. March 2011",
    image: "/images/attla/thumb-speedakmag2.jpg",
    href: "/dogs-of-speed",
  },
  {
    title: "Alaska Sports Hall of Fame",
    excerpt:
      "AT Publishing & Printing, December 2011 Foreword by George Attla In the book",
    image: "/images/attla/thumbnail-asof-book.gif",
    href: "/alaska-sports-hall-of-fame-2",
  },
];

export const sidebarLinks = [
  { label: "About George", href: "/about-george-attla" },
  { label: "Credits", href: "/about-2/credits-2" },
  { label: "Contact", href: "/contact-2" },
];

export const footerCta = [
  { label: "Get Involved – Start Mushing!", href: "/get-involved-start-mushing" },
  { label: "Visit a Dog Mushing Museum", href: "/visit-a-dog-mushing-museum" },
  { label: "Join a Dog Mushing Club", href: "/join-a-mushing-club" },
];
