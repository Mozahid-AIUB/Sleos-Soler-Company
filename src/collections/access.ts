import type { Access, FieldAccess } from "payload";

type WithRoles = { roles?: string[] | null } | null | undefined;

export const hasRole = (user: WithRoles, role: "owner" | "editor") => Boolean(user?.roles?.includes(role));

/** Logged-in owner or editor (anyone who may change site content). */
export const isStaff: Access = ({ req: { user } }) => hasRole(user, "owner") || hasRole(user, "editor");

export const isOwner: Access = ({ req: { user } }) => hasRole(user, "owner");

export const isOwnerField: FieldAccess = ({ req: { user } }) => hasRole(user, "owner");

/** Public sees published items only; staff see everything including drafts. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (hasRole(user, "owner") || hasRole(user, "editor")) return true;
  return { _status: { equals: "published" } };
};
