import { mockItemList } from "../lib/mockItemList"
import { ActivityCardItem } from "./ActivityCardItem"

export const ActivityCardItemList = () => {
  return (
    <>
      {mockItemList.map(item => (
        <ActivityCardItem key={item.id} activityItem={item} />
      ))}
    </>
  )
}
