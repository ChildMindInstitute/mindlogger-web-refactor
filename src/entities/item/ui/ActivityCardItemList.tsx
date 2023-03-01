import { ActivityItem } from "../lib"
import { ActivityCardItem } from "./ActivityCardItem"

type ActivityCardItemListProps = {
  items: ActivityItem[]
}

export const ActivityCardItemList = ({ items }: ActivityCardItemListProps) => {
  return (
    <>
      {items.map(item => (
        <ActivityCardItem key={item.id} activityItem={item} />
      ))}
    </>
  )
}
