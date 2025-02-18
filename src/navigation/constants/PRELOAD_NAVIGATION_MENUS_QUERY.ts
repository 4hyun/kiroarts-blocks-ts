/**
 *
 * This is source:
 *
 * @see https://github1s.com/WordPress/gutenberg/blob/trunk/packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/constants.js
 *
 * This is where it is used:
 *
 * @see https://github1s.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/navigation/use-navigation-menu.js#L54
 */

export const PRELOADED_NAVIGATION_MENUS_QUERY = {
  per_page: 100,
  status: ["publish", "draft"],
  order: "desc",
  orderby: "date",
}
