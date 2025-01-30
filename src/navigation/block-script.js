import ReactDom from "react-dom/client"
import { Navigation } from "./Navigation"

document.addEventListener("DOMContentLoaded", () => {
  const navigationRoot = document.querySelector(
    ".kiroart-blocks-ts-navigation-root"
  )
  const root = ReactDom.createRoot(navigationRoot)
  root.render(<Navigation />)
})
