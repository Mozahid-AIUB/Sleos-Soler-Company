import { whatsappLink } from "@/content/site";
import { WhatsappIcon } from "@/components/ui/Icon";

export function WhatsAppFloat({ label }: { label: string }) {
  return (
    // Outer wrapper carries the one-off delayed entrance so it never fights the
    // hover scale transition on the link itself.
    <div className="hero-in fixed bottom-5 right-5 z-40 [animation-delay:1.2s] md:bottom-7 md:right-7">
      <a
        href={whatsappLink("Hello OSLEOS, I'd like to know more about your solar products.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.45)] transition-transform duration-300 hover:scale-105"
      >
        <WhatsappIcon size={28} className="relative" />
      </a>
    </div>
  );
}
