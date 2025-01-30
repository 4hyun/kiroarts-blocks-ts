import { cn } from "../../lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "../../components/ui/navigation-menu"
import { NavigationContentListItem } from "../../components/ui/navigation-menu-content-list-item"

type MenuItem = {}
type MenuLabel = string
type MenuLinkTitle = string
type MenuLinkUrl = string
type MenuProps = []
const createMenuItem = (props: MenuItem) => props

const menuData = [
  [
    ["협회소개", "53"],
    ["인사말", "56"],
    ["연혁", "61"],
    ["조직도", "64"],
    ["찾아오시는 길", "70"],
  ],
  [
    ["협회행사", "44"],
    ["협회전시행사", "50"],
    ["기타행사", "232"],
    ["언론", "244"],
  ],
  [
    ["커뮤니티", "30"],
    ["공지사항", "35"],
    ["중국전시관 안내", "38"],
    ["중국협력기관 및 소개", "41"],
  ],
  [
    ["사이버갤러리", "21"],
    ["협회전시영상", "24"],
    ["협회원 개인전 소개", "27"],
  ],
]

const getHref = (pageTitle: string) => pageTitle.split(" ").join("-")
export const Navigation = () => {
  return (
    <NavigationMenu viewportWrapper={{ side: "right" }}>
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
  )
}
