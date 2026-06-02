export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HomePost {
  title: string;
  excerpt: string;
  image: string;
  href: string;
}

export interface SliderSlide {
  src: string;
  alt: string;
}
