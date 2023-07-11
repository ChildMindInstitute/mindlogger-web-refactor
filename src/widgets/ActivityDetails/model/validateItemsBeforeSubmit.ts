import { activityModel } from "~/entities/activity"

type Params = {
  isAllItemsSkippable: boolean
}

export const validateAnswerBeforeSubmit = (
  items: activityModel.types.ActivityEventProgressRecord[],
  params?: Params,
): Array<string> => {
  const invalidItemIds: Array<string> = []

  items.forEach(item => {
    const isRequired = !item.config.skippableItem
    const isAnswerExist = item.answer[0]

    const isMessageItem = item.responseType === "message"

    if (!isMessageItem && !params?.isAllItemsSkippable && isRequired && !isAnswerExist) {
      invalidItemIds.push(item.id)
    }
  })

  return invalidItemIds
}
