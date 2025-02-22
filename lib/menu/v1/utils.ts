export const getHref = (pageTitle: string) => pageTitle.split(" ").join("-")

/**
 * @note we allow the returned value to be used as title. This is to be refactored later.
 */
export const getMenuId = (menuRoot: any) => menuRoot.label || menuRoot.slug

export function normalizeSchema(data) {
  return data.map((entry) => ({
    slug: entry.slug || null,
    description: entry.description || null,
    label: entry.label || null, // Root level objects don't have a label, default to null
    pageId: entry.pageId || null, // Root level objects don't have a pageId, default to null
    items: Array.isArray(entry.items)
      ? normalizeSchema(entry.items) // Recursively process child items
      : null, // Ensure items is null if missing or not an array
  }))
}
