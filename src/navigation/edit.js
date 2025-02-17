/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __, sprintf } from "@wordpress/i18n"

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
  PanelBody,
  MenuGroup,
  MenuItem,
  MenuItemsChoice,
  DropdownMenu,
} from "@wordpress/components"
// import { useMemo, useState } from "@wordpress/element"
import { moreVertical } from "@wordpress/icons"
import { InspectorControls, useBlockProps } from "@wordpress/block-editor"
import useNavigationMenu from "@wordpress/block-library/src/navigation/use-navigation-menu"
import { buildMenuLabel } from "./lib"

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
import { Navigation } from "./Navigation"

const menuChoices = []

export default function Edit({ attributes, setAttributes }) {
  const createActionLabel = __("Create from '%s'")
  // This will be props for MenuInspectorControls once extrated to its own component
  const menuInspectorControls = { currentMenuId: null }
  const showNavigationMenus = false
  const hasNavigationMenus = true
  // This will be props for Navigation Menu Selector
  const navigationMenuSelector = {
    actionLabel: undefined,
  }
  const actionLabel = navigationMenuSelector.actionLabel || createActionLabel

  const blockProps = useBlockProps()
  // const [isUpdatingMenuRef, setIsUpdatingMenuRef] = useState(false)
  const canUserCreateNavigationMenus = true

  // const {
  //   navigationMenus,
  //   isResolvingNavigationMenus,
  //   hasResolvedNavigationMenus,
  //   canUserCreateNavigationMenus,
  //   canSwitchNavigationMenu,
  //   isNavigationMenuMissing,
  // } = useNavigationMenu(menuInspectorControls.currentMenuId)

  // const menuChoices = useMemo(() => {
  //   return (
  //     navigationMenus?.map(({ id, title, status }, index) => {
  //       const label = buildMenuLabel(title?.rendered, index + 1, status)

  //       return {
  //         value: id,
  //         label,
  //         ariaLabel: sprintf(actionLabel, label),
  //         disabled:
  //           isUpdatingMenuRef ||
  //           isResolvingNavigationMenus ||
  //           !hasResolvedNavigationMenus,
  //       }
  //     }) || []
  //   )
  // }, [
  //   navigationMenus,
  //   actionLabel,
  //   isResolvingNavigationMenus,
  //   hasResolvedNavigationMenus,
  //   isUpdatingMenuRef,
  // ])

  return (
    <>
      <InspectorControls>
        <PanelBody>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{__("Menu")}</div>
            <DropdownMenu icon={moreVertical} toggleProps={{ size: "small" }}>
              {({ onClose }) => (
                <>
                  {showNavigationMenus && hasNavigationMenus && (
                    <MenuGroup label={__("Menus")}>
                      <MenuItemsChoice
                        value={currentMenuId}
                        onSelect={(menuId) => {
                          // onSelectNavigationMenu( menuId );
                          // onClose()
                        }}
                        choices={menuChoices}
                      />
                    </MenuGroup>
                  )}
                  {canUserCreateNavigationMenus ||
                    (true && (
                      <MenuGroup label={__("Tools")}>
                        <MenuItem
                          onClick={async () => {
                            // setIsUpdatingMenuRef( true );
                            // await onCreateNew();
                            // setIsUpdatingMenuRef( false );
                            // onClose()
                          }}
                          // disabled={
                          // 	isUpdatingMenuRef ||
                          // 	isResolvingNavigationMenus ||
                          // 	! hasResolvedNavigationMenus
                          // }
                        >
                          {__("Create new Menu")}
                        </MenuItem>
                      </MenuGroup>
                    ))}
                </>
              )}
            </DropdownMenu>
          </div>
        </PanelBody>
      </InspectorControls>
      <Navigation></Navigation>
    </>
  )
}
