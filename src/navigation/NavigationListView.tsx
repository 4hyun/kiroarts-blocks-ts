import { __ } from "@wordpress/i18n"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, Plus, MoreVertical, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const NavigationItemInserter = () => {
  const addLabel = __("Add")
  return (
    <SidebarFooter className="bg-gray-500">
      <div className="flex justify-between items-center">
        {/* <SidebarMenuButton> */}
        <span className="font-semibold text-white">{addLabel}</span>
        <Button>
          <Plus />
        </Button>
        {/* </SidebarMenuButton> */}
      </div>
    </SidebarFooter>
  )
}

const MenuItemDropdownMenu = () => {
  // const removeLabel = sprintf(
  // 	/* translators: %s: block name */
  // 	__( 'Remove %s' ),
  // 	BlockTitle( { clientId, maximumLength: 25 } )
  // );
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onSelect={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="*:cursor-pointer">
          <DropdownMenuItem>{__("Move up")}</DropdownMenuItem>
          <DropdownMenuItem>{__("Move down")}</DropdownMenuItem>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuItem>
            <Trash size={10} />
            {__("Remove")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const NavigationListView = (props) => {
  console.log("NavigationListView", { props })
  return (
    <SidebarProvider
      // style={{ "--sidebar-width": "unset" }}
      className="min-h-[300px] pt-4"
    >
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="justify-between">
                        <div className="flex gap-x-4 items-center">
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 w-4 h-4" />
                          <span className="whitespace-pre">menu 1</span>
                        </div>
                        <MenuItemDropdownMenu />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            <span className="whitespace-pre">
                              menu 1 - sub - 1
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            menu 1 - sub - 2
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton>
                            menu 1 - sub - 3
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                <SidebarMenuItem>
                  <SidebarMenuButton>menu 2</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>menu 3</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <NavigationItemInserter />
      </Sidebar>
    </SidebarProvider>
  )
}
