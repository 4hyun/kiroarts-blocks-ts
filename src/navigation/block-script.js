import ReactDom from "react-dom/client"
import { Navigation } from "./Navigation"

document.addEventListener("DOMContentLoaded", () => {
  function safeJsonParse(jsonString, fallback = null) {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      console.error("Invalid JSON:", error)
      return fallback
    }
  }
  const navigationRoot = document.querySelector(
    ".hjarts-blocks-ts-navigation-root"
  )
  if (navigationRoot) {
    const root = ReactDom.createRoot(navigationRoot)
    const refValue = navigationRoot.getAttribute("data-ref")
    const defaultNavigationMenuJSON = safeJsonParse(
      navigationRoot.getAttribute("data-default-navigation-menu")
    )

    root.render(
      <Navigation
        attributes={{ ref: refValue }}
        defaultMenu={defaultNavigationMenuJSON}
      />
    )
  }
})
