import { PropsWithChildren } from "react"

import { ActivityItem } from "../lib"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityItem[]
}>

export const ActivityCardItemList = ({ items, children }: ActivityCardItemListProps) => {
  return (
    <>
      {items.map(item => (
        <ActivityCardItem key={item.id} activityItem={item}>
          {children}
        </ActivityCardItem>
      ))}
    </>
  )
}
