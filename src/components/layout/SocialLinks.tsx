import { site, whatsappLink } from "@/content/site";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/Icon";

const items = [
  { label: "WhatsApp", href: whatsappLink(), Icon: WhatsappIcon },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
];

export function SocialLinks({ dark = true }: { dark?: boolean }) {
  return (
    <ul className="flex gap-2.5">
      {items.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
              dark
                ? "border-white/15 text-white/80 hover:border-gold-500 hover:bg-gold-500 hover:text-forest-950"
                : "border-cream-200 text-forest-900 hover:border-forest-900 hover:bg-forest-900 hover:text-white"
            }`}
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
