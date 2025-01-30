import { useEffect } from "@wordpress/element"

export const CommunityBoardItem = ({ initialState }) => {
  useEffect(() => {
    console.log("CommunityBoardItem DEBUG", initialState)
  }, [])
  return <div>A Community Board Item 2</div>
}
