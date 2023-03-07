import { PropsWithChildren } from "react"

import { ActivityItem, ItemCardButtonsConfig } from "../lib"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityItem[]
  itemCardButtonsConfig: ItemCardButtonsConfig
}>

export const ActivityCardItemList = ({ items, itemCardButtonsConfig }: ActivityCardItemListProps) => {
  return (
    <>
      {items.map(item => (
        <ActivityCardItem key={item.id} activityItem={item} itemCardButtonsConfig={itemCardButtonsConfig} />
      ))}
    </>
  )
}
