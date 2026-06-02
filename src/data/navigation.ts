import type { NavItem } from "@/types/home";

/** Full main nav tree from attlamakingofachampion.com (#main-nav). */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Youth Program",
    href: "/youth-sled-dog-program",
    children: [
      {
        label: "Frank Attla Youth & Sled Dog Care-Mushing Program",
        href: "/frank-attla-youth-sled-dog-care-mushing-program",
      },
    ],
  },
  {
    label: "Champion Mindset",
    href: "/on-mindset-2",
    children: [
      { label: "Not a give up person!", href: "/not-give-up" },
      {
        label: "Dog Connection",
        href: "/dog-connection",
        children: [
          { label: "Champion Sled Dogs", href: "/champion-sled-dogs" },
          { label: "Lingo – A Dream Leader", href: "/lingo" },
        ],
      },
    ],
  },
  {
    label: "Meet the Man",
    href: "/meet-the-man",
    children: [
      { label: "Role Model", href: "/role-model-2" },
      { label: "No Stopping George Attla", href: "/no-stopping-george-attla" },
    ],
  },
  {
    label: "Sprint Racing",
    href: "/sprint-racing-2",
    children: [
      {
        label: "Attla Racing Career",
        href: "/racing-career",
        children: [
          { label: "Attla Interviews", href: "/races-run-interviews" },
          { label: "Early Career", href: "/early-career" },
          { label: "More Attla Race Footage", href: "/7-decades-of-competition" },
        ],
      },
      { label: "The Fur Rondy", href: "/the-fur-rondy-world-championship" },
      { label: "Open North American", href: "/open-north-american" },
      { label: "Tok Race of Champions", href: "/tok-champions-race" },
      {
        label: "Koyukuk River Championship",
        href: "/koyukuk-river-championship",
        children: [
          { label: "By George It's Been 50 Years", href: "/by-george-50-years" },
        ],
      },
      { label: "Dogs of Speed", href: "/dogs-of-speed" },
    ],
  },
  {
    label: "AKSHOF",
    href: "/alaska-sports-hall-of-fame-2",
    children: [{ label: "Healthy Heros", href: "/healthy-heros" }],
  },
  {
    label: "Opus",
    href: "/books-movies",
    children: [
      { label: "Books by George Attla", href: "/everything-i-know-about" },
      { label: "Books About George Attla", href: "/books-about-george-attla" },
      { label: "Spirit of the Wind (movie)", href: "/spirit-of-the-wind" },
    ],
  },
  {
    label: "History",
    href: "/history-2",
    children: [
      { label: "Work of Today", href: "/work-of-today" },
      { label: "Time Machine", href: "/time-machine" },
    ],
  },
  {
    label: "People",
    href: "/people",
    children: [
      { label: "Real Dogmen", href: "/real-dogmen-2" },
      { label: "Young Mushers", href: "/young-mushers" },
      { label: "Fans Talk", href: "/fans-talk" },
      { label: "Competitors", href: "/competitors" },
    ],
  },
  {
    label: "About",
    href: "/about-2",
    children: [
      { label: "Project Support", href: "/about-2/project-support" },
      { label: "Credits", href: "/about-2/credits-2" },
      { label: "In Memoriam", href: "/dedication" },
    ],
  },
];

/** Desktop bar: core story sections (Home = logo only). */
export const primaryBarNav: NavItem[] = [
  navItems[1],
  navItems[2],
  navItems[3],
  navItems[4],
];

/** Desktop bar: everything else under one Explore menu. */
export const exploreNav: NavItem[] = [
  navItems[5],
  navItems[6],
  navItems[7],
  navItems[8],
  navItems[9],
];
