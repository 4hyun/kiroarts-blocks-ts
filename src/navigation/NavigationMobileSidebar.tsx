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
import { getHref } from "@/lib/menu/v1/utils"
import { ChevronRight } from "lucide-react"

export function NavigationMobileSidebar({ menuData }) {
  return (
    <Sidebar side="right">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuData.map((menuGroup) => (
                <Collapsible
                  key={menuGroup[0][0]}
                  defaultOpen
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <span className="font-bold text-lg has-noto-sans-kr-font-family">
                          {menuGroup[0][0]}
                        </span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menuGroup.map((menuItem) => (
                          <SidebarMenuSubItem key={menuItem[0]}>
                            <SidebarMenuSubButton asChild>
                              <a href={getHref(menuItem[0])}>
                                <span className="has-noto-sans-kr-font-family">
                                  {menuItem[0]}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
