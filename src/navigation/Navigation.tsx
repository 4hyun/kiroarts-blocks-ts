import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  // NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { NavigationContentListItem } from "@/components/ui/navigation-menu-content-list-item"
import { NavigationMobileSidebar } from "./NavigationMobileSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getHref } from "@/lib/menu/v1/utils"
import { MenuIcon } from "lucide-react"
import { menuData } from "./constants/menu-data"

// type MenuItem = {}
// type MenuLabel = string
// type MenuLinkTitle = string
// type MenuLinkUrl = string
// type MenuProps = []
// const createMenuItem = (props: MenuItem) => props

export const Navigation = () => {
  return (
    <div className="hjarts-navigation-group">
      {/* Desktop */}
      <NavigationMenu
        viewportWrapper={{ side: "right" }}
        className="hjarts-navigation__desktop-root hidden md:flex"
      >
        <NavigationMenuList>
          {menuData.map((menuItem, indexId) => {
            return (
              <NavigationMenuItem key={indexId}>
                <NavigationMenuTrigger className="has-noto-sans-kr-font-family font-semibold !bg-transparent text-base">
                  {menuItem[0][0]}
                </NavigationMenuTrigger>
                {menuItem.length > 1 ? (
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {menuItem.map((menuLink) => {
                        return (
                          // <NavigationMenuLink
                          //   className={cn(navigationMenuTriggerStyle())}
                          // >
                          //   {menuLink[0]}
                          // </NavigationMenuLink>
                          <NavigationContentListItem
                            title={menuLink[0]}
                            href={getHref(menuLink[0])}
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
          <NavigationMobileSidebar menuData={menuData} />
          <SidebarTrigger icon={MenuIcon} className="max-md:[&_svg]:size-6" />
        </SidebarProvider>
      </div>
    </div>
  )
}
