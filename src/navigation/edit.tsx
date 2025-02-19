import { __, sprintf } from "@wordpress/i18n"
import { useMemo, useState, useCallback, useEffect } from "@wordpress/element"
import { useSelect, useDispatch } from "@wordpress/data"
import {
  useBlockProps,
  store as blockEditorStore,
} from "@wordpress/block-editor"
import { useNavigationMenu } from "./hooks/use-navigation-menu"
import { buildMenuLabel } from "./lib"

import { Navigation } from "./Navigation"
import { NavigationContextProvider } from "./context"
import { NavigationInspectorControls } from "./edit/NavigationInspectorControls"

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
export default function Edit({ attributes, setAttributes, ...props }) {
  const createActionLabel = __("Create from '%s'")
  // This will be props for MenuInspectorControls once extrated to its own component
  const ref = useMemo(
    () => attributes.ref || props.clientId,
    [attributes.ref, props.clientId]
  )

  const hasNavigationMenus = true
  // This will be props for Navigation Menu Selector
  const navigationMenuSelector = {
    actionLabel: undefined,
  }
  const actionLabel = navigationMenuSelector.actionLabel || createActionLabel

  useEffect(() => {
    if (!attributes.ref && props.clientId) {
      setAttributes({ ref: props.clientId })
    }
  }, [props.clientId, attributes.ref])

  const blockProps = useBlockProps()
  const [isUpdatingMenuRef, setIsUpdatingMenuRef] = useState(false)
  const {
    navigationMenus,
    isResolvingNavigationMenus,
    hasResolvedNavigationMenus,
    canUserCreateNavigationMenus,
    canSwitchNavigationMenu,
    isNavigationMenuMissing,
  } = useNavigationMenu(ref)
  const showNavigationMenus = !!canSwitchNavigationMenu

  // console.log({ navigationMenus })

  const menuChoices = useMemo(() => {
    return (
      navigationMenus?.map(({ id, title, status }, index) => {
        const label = buildMenuLabel(title?.rendered, index + 1, status)

        return {
          value: id,
          label,
          ariaLabel: sprintf(actionLabel, label),
          disabled:
            isUpdatingMenuRef ||
            isResolvingNavigationMenus ||
            !hasResolvedNavigationMenus,
        }
      }) || []
    )
  }, [
    navigationMenus,
    actionLabel,
    isResolvingNavigationMenus,
    hasResolvedNavigationMenus,
    isUpdatingMenuRef,
  ])

  return (
    <nav {...blockProps}>
      <NavigationContextProvider>
        <NavigationInspectorControls />
        <Navigation
          clientId={ref}
          setAttributes={setAttributes}
          attributes={attributes}
        ></Navigation>
      </NavigationContextProvider>
    </nav>
  )
}
