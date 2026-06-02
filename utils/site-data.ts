import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const siteConfig = {
  name: "Cyberpeers",
  description: "Cyberpeers is aiming to deliver bespoke solutions by building applications for web and mobile with Digital Marketing.",
  address: "9 Town Quay, Barking IG11 7BZ, United Kingdom",
  phone: "+44 020 8090 4806",
  email: "contact@cyberpeers.co.uk",
  
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