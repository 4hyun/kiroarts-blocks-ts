import ReactDom from "react-dom/client"
import { Navigation } from "./Navigation"

document.addEventListener("DOMContentLoaded", () => {
  const navigationRoot = document.querySelector(
    ".hjarts-blocks-ts-navigation-root"
  )
  if (navigationRoot) {
    const root = ReactDom.createRoot(navigationRoot)
    const refValue = navigationRoot.getAttribute("data-ref")
    root.render(<Navigation attributes={{ ref: refValue }} />)
  }
})
