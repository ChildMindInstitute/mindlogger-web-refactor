import { useState } from "react"

import { ActivityItem, ItemCardButtonsConfig } from "../lib/item.schema"
import { ItemCardButton } from "./ItemCardButtons"

import { TextItem, CardItem } from "~/shared/ui"

type ActivityCardItemProps = {
  activityItem: ActivityItem
  itemCardButtonsConfig: ItemCardButtonsConfig
}

export const ActivityCardItem = ({ activityItem, itemCardButtonsConfig }: ActivityCardItemProps) => {
  const [value, setValue] = useState<string | undefined>(undefined)

  const buttonConfig: ItemCardButtonsConfig = {
    ...itemCardButtonsConfig,
    isNextDisable: !value || !value.length,
    isSkippable: activityItem.isSkippable || itemCardButtonsConfig.isSkippable,
  }

  return (
    <CardItem markdown={activityItem.question} buttons={<ItemCardButton config={buttonConfig} />}>
      <TextItem value={value} setValue={setValue} />
    </CardItem>
  )
}
