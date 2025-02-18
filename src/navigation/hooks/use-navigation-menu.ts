import { useEntityRecords } from "@wordpress/core-data"
import { PRELOADED_NAVIGATION_MENUS_QUERY } from "../constants/PRELOAD_NAVIGATION_MENUS_QUERY"

export const useNavigationMenu = (ref) => {
  const {
    records: navigationMenus,
    isResolving: isResolvingNavigationMenus,
    hasResolved: hasResolvedNavigationMenus,
  } = useEntityRecords(
    "postType",
    `wp_navigation`,
    PRELOADED_NAVIGATION_MENUS_QUERY
  )
  const canSwitchNavigationMenu = ref
    ? navigationMenus?.length > 1
    : navigationMenus?.length > 0
  return {
    navigationMenus,
    canSwitchNavigationMenu,
    isResolvingNavigationMenus,
    hasResolvedNavigationMenus,
  }
}
