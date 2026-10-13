import type { CollectionConfig } from "payload";
import { hasRole, isOwner, isOwnerField } from "./access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Staff user", plural: "Staff users" },
  admin: { useAsTitle: "email", defaultColumns: ["email", "name", "roles"], group: "Settings" },
  auth: {
    tokenExpiration: 60 * 60 * 12,
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    admin: ({ req: { user } }) => hasRole(user, "owner") || hasRole(user, "editor"),
    // A user can read and edit their own account; the owner manages everyone.
    read: ({ req: { user } }) => (hasRole(user, "owner") ? true : user ? { id: { equals: user.id } } : false),
    create: isOwner,
    update: ({ req: { user } }) => (hasRole(user, "owner") ? true : user ? { id: { equals: user.id } } : false),
    delete: isOwner,
  },
  hooks: {
    beforeChange: [
      // The very first account on a fresh database becomes the owner.
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
        if (totalDocs === 0) return { ...data, roles: ["owner"] };
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["editor"],
      saveToJWT: true,
      options: [
        { label: "Owner (everything)", value: "owner" },
        { label: "Editor (content only)", value: "editor" },
      ],
      access: { create: isOwnerField, update: isOwnerField },
    },
  ],
};
