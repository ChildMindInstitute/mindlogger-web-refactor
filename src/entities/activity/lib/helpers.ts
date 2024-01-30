import { supportableResponseTypes } from "~/abstract/lib/constants"
import { appletModel } from "~/entities/applet"
import { ItemResponseTypeDTO } from "~/shared/api"

export function isSupportedActivity(itemResponseTypes?: Array<ItemResponseTypeDTO>): boolean {
  if (!itemResponseTypes) {
    return false
  }

  return itemResponseTypes.every(type => supportableResponseTypes.includes(type))
}

/**
 * Check whether an item supports an additional response field
 * @param item Any item
 * @returns Whether the item type supports additional text responses
 */
export const supportsAdditonalResponseField = (
  item: appletModel.ItemRecord,
): item is appletModel.ItemWithAdditionalResponse => {
  return [
    "singleSelect",
    "multiSelect",
    "slider",
    "date",
    "numberSelect",
    "time",
    "timeRange",
    "drawing",
    "photo",
    "video",
    "geolocation",
    "audio",
  ].includes(item.responseType)
}

/**
 * Check whether an item has been configured with an additional response field
 * @param item Any item, even those that don't support additional response fields
 * @returns Whether the item has an additional response field
 */
export const hasAdditionalResponse = (item: appletModel.ItemRecord): boolean => {
  return supportsAdditonalResponseField(item) && item.config.additionalResponseOption.textInputOption
}

/**
 * Check whether an item has been configured with a required additional response field
 * @param item Any item, even those that don't support additional response fields
 * @returns Whether the item requires an additional response
 */
export const requiresAdditionalResponse = (item: appletModel.ItemRecord): boolean => {
  return supportsAdditonalResponseField(item) && item.config.additionalResponseOption.textInputRequired
}
