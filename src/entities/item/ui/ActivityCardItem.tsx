import { PropsWithChildren } from "react"

import { ActivityItem } from "../lib/item.schema"

import { TextItem, CardItem } from "~/shared/ui"

type ActivityCardItemProps = PropsWithChildren<{
  activityItem: ActivityItem
}>

export const ActivityCardItem = ({ activityItem, children }: ActivityCardItemProps) => {
  return (
    <CardItem markdown={activityItem.question} buttons={children}>
      <TextItem />
    </CardItem>
  )
}
