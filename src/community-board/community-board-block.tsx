// import { getContext } from "@wordpress/interactivity"
import { useEffect, useState } from "react"
import { BoardPagination } from "./components/board-pagination"
// import { CommunityBoard } from "./components/community-board"
import { QueryControls } from "@wordpress/components"
import { type QueryControlsWithSingleCategorySelectionProps } from "@wordpress/components/src/query-controls/types"
import { useBlockProps } from "@wordpress/block-editor"
import { CommunityBoard } from "./components/community-board"

type Order = QueryControlsWithSingleCategorySelectionProps["order"]

type OrderBy = QueryControlsWithSingleCategorySelectionProps["orderBy"]

const QUERY_DEFAULTS = {
  category: 1,
  categories: [
    // {
    //   id: 1,
    //   name: "Category 1",
    //   parent: 0,
    // },
    // {
    //   id: 2,
    //   name: "Category 1b",
    //   parent: 1,
    // },
    // {
    //   id: 3,
    //   name: "Category 2",
    //   parent: 0,
    // },
  ],
  maxItems: 20,
  minItems: 1,
  numberOfItems: 10,
  order: "asc" as Order,
  orderBy: "title" as OrderBy,
}
export const CommunityBoardBlock = (props) => {
  const blockProps = useBlockProps()
  const [query, setQuery] = useState(QUERY_DEFAULTS)
  const {
    category,
    categories,
    maxItems,
    minItems,
    numberOfItems,
    order,
    orderBy,
  } = query

  const updateQuery = (newQuery) => {
    setQuery({ ...query, ...newQuery })
  }
  return (
    <div className="kiro-community-board-block grid">
      <CommunityBoard />
      <BoardPagination />
    </div>
  )
}
