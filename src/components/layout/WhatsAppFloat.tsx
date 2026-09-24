import { whatsappLink } from "@/content/site";
import { WhatsappIcon } from "@/components/ui/Icon";

export function WhatsAppFloat({ label }: { label: string }) {
  return (
    <a
      href={whatsappLink("Hello OSLEOS, I'd like to know more about your solar products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition-transform duration-300 hover:scale-105 md:bottom-7 md:right-7"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-25 [animation-duration:2.6s]" aria-hidden="true" />
      <WhatsappIcon size={28} className="relative" />
    </a>
  );
}
