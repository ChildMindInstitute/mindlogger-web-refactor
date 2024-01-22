import { supportableResponseTypes } from "~/abstract/lib/constants"
import { ItemResponseTypeDTO } from "~/shared/api"

export function isSupportedActivity(itemResponseTypes?: Array<ItemResponseTypeDTO>): boolean {
  if (!itemResponseTypes) {
    return false
  }

  return itemResponseTypes.every(type => supportableResponseTypes.includes(type))
}
