import { mockMarkdown } from "../lib/mockMarkDown"

import { CardItem } from "~/shared/ui/CardItem"

interface ActivityCardItemProps {
  activityItem: unknown
}

export const ActivityCardItem = () => {
  return <CardItem markdown={mockMarkdown} />
}
