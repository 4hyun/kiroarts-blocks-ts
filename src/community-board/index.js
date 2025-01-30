/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType, registerBlockVariation } from "@wordpress/blocks"

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor. All other files
 * get applied to the editor only.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./style.scss"
import "./editor.scss"
// import "../global.scss"

/**
 * Internal dependencies
 */
import Edit from "./edit"
import Save from "./save"
import metadata from "./block.json"

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
// registerBlockType(metadata.name, {
//   /**
//    * @see ./edit.js
//    */
//   edit: Edit,
//   save: Save,
// })

const MY_VARIATION_NAME = metadata.name

registerBlockVariation("core/query", {
  name: MY_VARIATION_NAME,
  title: "Community Announcement List",
  description: "Displays a list of community announcements",
  isActive: ({ namespace, query }) => {
    return (
      namespace === MY_VARIATION_NAME
      // && query.postType === 'book'
    )
  },
  category: "theme",
  ancestor: ["core/query"],
  // icon: /** An SVG icon can go here*/,
  attributes: {
    namespace: MY_VARIATION_NAME,
    query: {
      perPage: 6,
      pages: 0,
      offset: 0,
      postType: "community",
      order: "desc",
      orderBy: "date",
      author: "",
      search: "",
      exclude: [],
      sticky: "",
      inherit: false,
    },
  },
  innerBlocks: [
    [
      "kiroart-blocks-ts/community-board-item",
      // {},
      // [["core/post-title"], ["core/post-date"]],
    ],
    ["core/query-pagination"],
    ["core/query-no-results"],
  ],
  scope: ["inserter"],
  // save: Save,
})
