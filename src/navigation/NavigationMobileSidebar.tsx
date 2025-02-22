import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { getHref, getMenuId } from "@/lib/menu/v1/utils"
import { ChevronRight } from "lucide-react"

export function NavigationMobileSidebar({ menu }) {
  if (!(Array.isArray(menu) && !!menu.length)) return
  null

  // if first item of menu is invalid we will return null. This is to be refactored.
  if (!getMenuId(menu[0]))
    return (
      <div className="hjarts-navigation-group">
        HJARTS - Menu structure is invalid.
      </div>
    )

  return (
    <Sidebar side="right">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((menuRoot) =>
                getMenuId(menuRoot) ? (
                  <Collapsible
                    key={getMenuId(menuRoot)}
                    defaultOpen
                    asChild
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <span className="font-bold text-lg has-noto-sans-kr-font-family">
                            {getMenuId(menuRoot)}
                          </span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {menuRoot.items && menuRoot.items.length > 1 ? (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {menuRoot.items.map((menuItem) => {
                              const menuItemId = getMenuId(menuItem)
                              if (!menuItemId) return null
                              return (
                                <SidebarMenuSubItem key={menuItemId}>
                                  <SidebarMenuSubButton asChild>
                                    <a href={getHref(menuItemId)}>
                                      <span className="has-noto-sans-kr-font-family">
                                        {menuItemId}
                                      </span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ) : null
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
