import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuIndicator,
  // NavigationMenuLink,
  // NavigationMenuViewport,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { store as coreStore } from "@wordpress/core-data"
import { useSelect } from "@wordpress/data"
import { useState } from "@wordpress/element"
import { NavigationContentListItem } from "@/components/ui/navigation-menu-content-list-item"
import { NavigationMobileSidebar } from "./NavigationMobileSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getHref, getMenuId, normalizeSchema } from "@/lib/menu/v1/utils"
import { MenuIcon } from "lucide-react"

type NavigationProps = {
  clientId?: string
  attributes: any
  setAttributes: any
  defaultMenu?: any[]
  menu?: any[]
}
export const Navigation = ({
  clientId,
  attributes,
  setAttributes,
  defaultMenu,
  menu: menuProp,
}: NavigationProps) => {
  const [menu, setMenuData] = useState(
    () => menuProp || (defaultMenu ? normalizeSchema(defaultMenu) : []) || []
  )
  const { navigationData, isResolvingNavigationData } = useSelect(
    (select) => {
      if (!attributes?.ref) return {}
      const { getEntityRecord, isResolving } = select(coreStore)
      const navigationData = getEntityRecord(
        "postType",
        "hjarts_navigation",
        attributes.ref
      )
      return { navigationData, isResolvingNavigationData: isResolving }
    },
    [attributes]
  )

  if (!attributes.ref) {
    console.log(
      "[WARN] [hjarts:navigation] <Navigation/> requires attributes.ref to render. See $attributes @ https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#attributes"
    )
    return null
  }

  if (!menu) {
    // no navigation to render without data.
    return (
      <div className="hjarts-navigation-group">
        HJARTS - No Navigation Menu.
      </div>
    )
  }

  // if first item of menu is invalid we will return null. This is to be refactored.
  if (!getMenuId(menu[0]))
    return (
      <div className="hjarts-navigation-group">
        HJARTS - Menu structure is invalid.
      </div>
    )

  return (
    <div className="hjarts-navigation-group">
      {/* Desktop */}
      <NavigationMenu
        viewportWrapper={{ side: "right" }}
        className="hjarts-navigation__desktop-root hidden md:flex"
      >
        <NavigationMenuList>
          {menu.map((menuRoot) => {
            const menuRootId = getMenuId(menuRoot)
            if (!menuRootId) return null
            return (
              <NavigationMenuItem key={menuRootId}>
                <NavigationMenuTrigger className="has-noto-sans-kr-font-family font-semibold !bg-transparent text-base">
                  {getMenuId(menuRoot)}
                </NavigationMenuTrigger>
                {menuRoot.items && menuRoot.items.length > 1 ? (
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {menuRoot.items.map((childMenu) => {
                        const menuId = getMenuId(childMenu)
                        if (!menuId) return null
                        return (
                          <NavigationContentListItem
                            title={childMenu.label || childMenu.slug}
                            href={getHref(menuId)}
                          />
                        )
                      })}
                    </ul>
                  </NavigationMenuContent>
                ) : null}
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
      {/* Mobile */}
      <div className="hjarts-navigation__mobile-root md:hidden">
        <SidebarProvider className="!min-h-[initial]">
          <NavigationMobileSidebar menu={menu} />
          <SidebarTrigger icon={MenuIcon} className="max-md:[&_svg]:size-6" />
        </SidebarProvider>
      </div>
    </div>
  )
}
