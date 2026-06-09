import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const siteConfig = {
  name: "Patty Bro's",
  description: "Patty Bro's is a family-friendly restaurant offering delicious meals in a warm and welcoming atmosphere.",
  address: "Unit 10, The Aylesham Shopping Centre, Market Place Peckham, Rye Ln, Peckham, London SE15 5EW",
  phone: "",
  email: "demo@pattybros.co.uk",
  
  navItems: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" }, // Changed to match your folder /about-us
    { label: "Services", href: "/services" },
    { label: "Career", href: "/career" },    // Changed to match your folder /careers
  ],
  
  links: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
  
  socials: [
    { icon: Facebook, href: "https://facebook.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Instagram, href: "https://instagram.com" }
  ],
  
  footerNav: [
    {
      title: "Quick Links",
      items: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact Us", href: "/contact" },
        { label: "Career", href: "/career" },
      ],
    },
    {
      title: "Top Services",
      items: [
        { label: "Web Designing", href: "/services" },
        { label: "Web Development", href: "/services" },
        { label: "Branding", href: "/services" },
        { label: "Digital Marketing", href: "/services" },
      ],
    },
  ],
};