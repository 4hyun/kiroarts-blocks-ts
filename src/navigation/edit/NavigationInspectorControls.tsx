import { __, sprintf } from "@wordpress/i18n"
import {
  PanelBody,
  MenuGroup,
  MenuItem,
  MenuItemsChoice,
  Spinner,
} from "@wordpress/components"
import { moreVertical } from "@wordpress/icons"
import {
  InspectorControls,
  useBlockProps,
  store as blockEditorStore,
} from "@wordpress/block-editor"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import DeletedNavigationWarning from "./deleted-navigation-warning"
import { NavigationListView } from "../NavigationListView"

const MainContent = ({
  clientId,
  currentMenuId,
  isLoading,
  isNavigationMenuMissing,
  onCreateNew,
}) => {
  // const hasChildren = useSelect(
  //   (select) => {
  //     return !!select(blockEditorStore).getBlockCount(clientId)
  //   },
  //   [clientId]
  // )

  // const { navigationMenu } = useNavigationMenu(currentMenuId)

  if (currentMenuId && isNavigationMenuMissing) {
    return <DeletedNavigationWarning onCreateNew={onCreateNew} isNotice />
  }

  if (isLoading || true) {
    return <Spinner />
  }
  const description = ""
  // const description = navigationMenu
  //   ? sprintf(
  //       /* translators: %s: The name of a menu. */
  //       __("Structure for Navigation Menu: %s"),
  //       navigationMenu?.title || __("Untitled menu")
  //     )
  //   : __("You have not yet created any menus. Displaying a list of your Pages")

  return (
    <div className="wp-block-navigation__menu-inspector-controls">
      =
      <p className="wp-block-navigation__menu-inspector-controls__empty-message">
        {__("This Navigation Menu is empty.")}
      </p>
      <NavigationListView
        rootClientId={clientId}
        isExpanded
        description={description}
        showAppender
        // blockSettingsMenu={NavigationContentLeafMoreMenu}
        // additionalBlockContent={AdditionalBlockContent}
      />
    </div>
  )
}

export const NavigationInspectorControls = () => {
  const onSelectNavigationMenu = () => {}
  return (
    <InspectorControls className="px-0">
      <PanelBody>
        <div
          className="flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
          onSelect={(e) => e.stopPropagation()}
        >
          <div className="font-semibold">{__("Menu")}</div>
          <DropdownMenu>
            <DropdownMenuContent>
              <DropdownMenuLabel>{__("Menus")}</DropdownMenuLabel>
              {/* <MenuItemsChoice
                value={ref}
                onSelect={(menuId) => {
                  onSelectNavigationMenu(menuId)
                }}
                choices={menuChoices}
              /> */}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{__("Tools")}</DropdownMenuLabel>
              <DropdownMenuItem> {__("Create new Menu")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <MainContent />
      </PanelBody>
    </InspectorControls>
  )
}
