import { activityModel } from "~/entities/activity"

export const validateAnswerBeforeSubmit = (items: activityModel.types.ActivityEventProgressRecord[]): Array<string> => {
  const invalidItemIds: Array<string> = []

  items.forEach(item => {
    const isRequired = !item.config.skippableItem
    const isAnswerExist = item.answer[0]

    if (isRequired && !isAnswerExist) {
      invalidItemIds.push(item.id)
    }
  })

  return invalidItemIds
}
