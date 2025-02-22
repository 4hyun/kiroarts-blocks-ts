import { __, sprintf } from "@wordpress/i18n"
import { PanelBody, Spinner } from "@wordpress/components"
import { InspectorControls } from "@wordpress/block-editor"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeletedNavigationWarning from "./deleted-navigation-warning"
import { NavigationListView } from "../NavigationListView"
import { MoreVertical } from "lucide-react"
import { useRef, useState, useEffect } from "@wordpress/element"
import { select, useSelect, useDispatch } from "@wordpress/data"
import { store as coreStore } from "@wordpress/core-data"
import { menuDataStructured } from "../constants/menu-data"

const NAVIGATION_DEFAULT_MENU_REF = "HJARTS_NAVIGATION_V1_DEFAULT"
const navigationDefaultMenuTitle = NAVIGATION_DEFAULT_MENU_REF

const NAVIGATION_INIT_PENDING = "NAVIGATION_INIT_PENDING"
const NAVIGATION_INIT_IDLE = "NAVIGATION_INIT_IDLE"
const NAVIGATION_INIT_SUCCESS = "NAVIGATION_INIT_SUCCESS"
const NAVIGATION_INIT_ERROR = "NAVIGATION_INIT_ERROR"
const useNavigationDefaultMenuInit = (saveEntityRecord, editEntityRecord) => {
  const [status, setStatus] = useState(NAVIGATION_INIT_IDLE)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)

  // get entity record
  useSelect(
    (select) => {
      if (
        [
          NAVIGATION_INIT_PENDING,
          NAVIGATION_INIT_SUCCESS,
          NAVIGATION_INIT_ERROR,
        ].includes(status)
      ) {
        return {
          value,
          error,
          isIdle: status === NAVIGATION_INIT_IDLE,
          isSuccess: status === NAVIGATION_INIT_SUCCESS,
        }
      }
      setStatus(NAVIGATION_INIT_PENDING)
      // NOTE: see `hasFinishedResolution` for use.
      const { getEntityRecord } = select(coreStore)
      // NOTE: request status 404 if entity is not found.
      const menu = getEntityRecord(
        "postType",
        "hjarts_navigation",
        NAVIGATION_DEFAULT_MENU_REF
      )
      const canInit = !menu
      // if (canInit) {
      //   console.log("[DEBUG] [hjarts:navigation] can init default menu data.")
      //   const record = {
      //     title: navigationDefaultMenuTitle,
      //     meta: {
      //       navigation_menu: JSON.stringify(menuDataStructured),
      //       navigation_menu_id: NAVIGATION_DEFAULT_MENU_REF,
      //     },
      //   }
      //   saveEntityRecord("postType", "hjarts_navigation", record, {
      //     throwOnError: true,
      //   })
      //     .then(async (response) => {
      //       console.log("[DEBUG] [hjarts:navigation] saveEntityRecord success.")
      //       setStatus(NAVIGATION_INIT_SUCCESS)
      //       setValue(response)
      //     })
      //     .catch((err) => {
      //       console.log("[DEBUG] [hjarts:navigation] saveEntityRecord error.")
      //       setStatus(NAVIGATION_INIT_ERROR)
      //       setError(err)
      //       throw new Error("Unable to save new Navigation Menu")
      //     })
      // }
    },
    [status, value, error]
  )

  return { value, error }
}
const MainContent = ({
  clientId,
  currentMenuId,
  isLoading,
  isNavigationMenuMissing,
  onCreateNew,
}) => {
  const { saveEntityRecord, editEntityRecord } = useDispatch(coreStore)
  useNavigationDefaultMenuInit(saveEntityRecord, editEntityRecord)

  if (currentMenuId && isNavigationMenuMissing) {
    return <DeletedNavigationWarning onCreateNew={onCreateNew} isNotice />
  }

  if (isLoading) {
    return <Spinner />
  }
  const description = ""

  return (
    <div className="wp-block-navigation__menu-inspector-controls">
      <p className="wp-block-navigation__menu-inspector-controls__empty-message">
        {__("This Navigation Menu is empty.")}
      </p>
      <NavigationListView rootClientId={clientId} description={description} />
    </div>
  )
}

export const NavigationInspectorControls = ({}) => {
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
            <DropdownMenuTrigger>
              <MoreVertical size={12}></MoreVertical>
            </DropdownMenuTrigger>
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
