import { ActivityItem } from "../lib/item.schema"

import { TextItem, CardItem } from "~/shared/ui"

interface ActivityCardItemProps {
  activityItem: ActivityItem
}

export const ActivityCardItem = ({ activityItem }: ActivityCardItemProps) => {
  return (
    <CardItem markdown={activityItem.question}>
      <TextItem />
    </CardItem>
  )
}
