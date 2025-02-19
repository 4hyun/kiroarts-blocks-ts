import { __, sprintf } from "@wordpress/i18n"
import { useDispatch, useSelect } from "@wordpress/data"
import { store as blockEditorStore, BlockTitle } from "@wordpress/block-editor"
import { moreVertical, chevronUp, chevronDown } from "@wordpress/icons"
import { DropdownMenu, MenuGroup, MenuItem } from "@wordpress/components"

const AddSubmenuItem = (props) => {
  return null
}

/**
 * @see https://github1s.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/navigation/edit/leaf-more-menu.js#L16-L19
 */
const POPOVER_PROPS = {
  className: "block-editor-block-settings-menu__popover",
  placement: "bottom-start",
}
export const NavigationContentLeafMoreMenu = (props) => {
  const { block } = props
  const { clientId } = block
  const removeLabel = sprintf(
    /* translators: %s: block name */
    __("Remove %s"),
    BlockTitle({ clientId, maximumLength: 25 })
  )
  // const { moveBlocksDown, moveBlocksUp, removeBlocks } =
  //   useDispatch(blockEditorStore)
  const moveBlocksUp = () => {}
  const moveBlocksDown = () => {}
  const removeBlocks = () => {}
  const rootClientId = useSelect(
    (select) => {
      const { getBlockRootClientId } = select(blockEditorStore)

      return getBlockRootClientId(clientId)
    },
    [clientId]
  )
  return (
    <DropdownMenu icon={moreVertical} label={__("Options")}>
      {({ onClose }) => (
        <>
          <MenuGroup>
            <MenuItem
              icon={chevronUp}
              onClick={() => {
                // moveBlocksUp([clientId], rootClientId)
                moveBlocksUp()
                onClose()
              }}
            >
              {__("Move up")}
            </MenuItem>
            <MenuItem
              icon={chevronDown}
              onClick={() => {
                // moveBlocksDown([clientId], rootClientId)
                moveBlocksDown()
                onClose()
              }}
            >
              {__("Move down")}
            </MenuItem>
            <AddSubmenuItem
              block={block}
              onClose={onClose}
              expanded
              expandedState={props.expandedState}
              expand={props.expand}
              setInsertedBlock={props.setInsertedBlock}
            />
          </MenuGroup>
          <MenuGroup>
            <MenuItem
              onClick={() => {
                // removeBlocks([clientId], false)
                removeBlocks()
                onClose()
              }}
            >
              {removeLabel}
            </MenuItem>
          </MenuGroup>
        </>
      )}
    </DropdownMenu>
  )
}
