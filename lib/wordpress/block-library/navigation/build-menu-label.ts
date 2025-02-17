import { __, sprintf } from "@wordpress/i18n"
import { decodeEntities } from "@wordpress/html-entities"

export function buildMenuLabel(title, id, status) {
  if (!title) {
    /* translators: %s: the index of the menu in the list of menus. */
    return sprintf(__("(no title %s)"), id)
  }

  if (status === "publish") {
    return decodeEntities(title)
  }

  return sprintf(
    // translators: 1: title of the menu. 2: status of the menu (draft, pending, etc.).
    __("%1$s (%2$s)"),
    decodeEntities(title),
    status
  )
}
