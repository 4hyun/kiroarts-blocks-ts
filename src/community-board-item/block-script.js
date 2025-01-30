import ReactDom from "react-dom/client"
import { CommunityBoardItem } from "./community-board-item"
import { store } from "@wordpress/interactivity"

document.addEventListener("DOMContentLoaded", () => {
  const communityBoardItem = document.querySelector(
    ".community-board-item-root"
  )
  const testStore = store("kiroart-blocks-ts/community-board")
  const initialData = communityBoardItem
    ? communityBoardItem.dataset.context
      ? JSON.parse(communityBoardItem.dataset.context)
      : { isEmpty: true }
    : { isEmpty: true }

  console.log("DEBUG communityBoardItem.dataset", communityBoardItem.dataset)
  console.log("DEBUG testStore", testStore)
  if (communityBoardItem) {
    const root = ReactDom.createRoot(communityBoardItem)
    // TODO: we are gonna have to render list internally within CommunityBoardItem and name it -List later.

    root.render(<CommunityBoardItem initialState={initialData} />)
  } else {
    console.log("DEBUG communityBoardItem root not found")
  }
})
