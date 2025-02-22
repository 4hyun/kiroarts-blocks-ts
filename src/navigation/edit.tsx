import { __, sprintf } from "@wordpress/i18n"
import { useMemo, useState, useEffect } from "@wordpress/element"
import { useBlockProps } from "@wordpress/block-editor"
import { Navigation } from "./Navigation"
import { NavigationContextProvider } from "./context"
import { NavigationInspectorControls } from "./edit/NavigationInspectorControls"
import { normalizeSchema } from "@/lib/menu/v1/utils"
import defaultMenu from "../../data/default-menu.json"

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
  const [menu, setMenuData] = useState(() =>
    defaultMenu ? normalizeSchema(defaultMenu) : []
  )
  console.log({ defaultMenu })
  const createActionLabel = __("Create from '%s'")
  // This will be props for MenuInspectorControls once extrated to its own component
  const blockRef = useMemo(
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
    if (!blockRef && props.clientId) {
      setAttributes({ ref: props.clientId })
    }
  }, [props.clientId, blockRef])

  const blockProps = useBlockProps()

  return (
    <nav {...blockProps}>
      <NavigationContextProvider>
        <NavigationInspectorControls />
        <Navigation
          clientId={blockRef}
          setAttributes={setAttributes}
          attributes={attributes}
          menu={menu}
        ></Navigation>
      </NavigationContextProvider>
    </nav>
  )
}
