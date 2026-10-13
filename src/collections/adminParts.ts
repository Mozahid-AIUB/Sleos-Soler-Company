/** Shared admin components for collection fields. */

/** Upload field that picks a file straight from the device (no media library). */
export const deviceUpload = (accept?: string) => ({
  Field: accept ? { path: "/components/admin/DeviceUpload#DeviceUpload", clientProps: { accept } } : "/components/admin/DeviceUpload#DeviceUpload",
  Cell: "/components/admin/Cells#ThumbCell",
});

/** Checkbox shown as a tick in list tables. */
export const tickCell = { Cell: "/components/admin/Cells#CheckCell" };

/** Name/title column that opens the item. */
export const openCell = { Cell: "/components/admin/Cells#OpenCell" };
