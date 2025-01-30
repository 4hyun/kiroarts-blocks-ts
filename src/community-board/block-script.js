import ReactDom from "react-dom/client"
import { CommunityBoardBlock } from "./community-board-block"
// !! This will only work for single instance of Community board as this will be mounted with createRoot!
// Need to design a way to support multiple instance without conflict.
document.addEventListener("DOMContentLoaded", () => {
  // const communityBoardRoot = document.querySelector(
  //   ".kiroart-blocks-ts-community-board-root"
  // )
  // const root = ReactDom.createRoot(communityBoardRoot)
  // root.render(<CommunityBoardBlock />)
})
