import Link from "next/link";
import { AdminIcon } from "./icons";

type Props = { label: string; href?: string; collectionSlug?: string };

/**
 * A large "add" card at the top of a list, so a non-technical editor cannot
 * miss it (Payload's own small "Add new" pill is hidden by CSS).
 */
export function AddCard({ label, href, collectionSlug }: Props) {
  return (
    <Link href={href ?? `/admin/collections/${collectionSlug}/create`} className="osl-addcard">
      <span className="osl-addcard__plus">
        <AdminIcon name="plus" size={26} />
      </span>
      <strong className="osl-addcard__text">{label}</strong>
      <span className="osl-addcard__go" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
