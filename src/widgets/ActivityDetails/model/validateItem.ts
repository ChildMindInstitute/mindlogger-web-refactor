import { activityModel } from "~/entities/activity"

type ValidateItemProps = {
  item: activityModel.types.ActivityEventProgressRecord
}

export function validateItem(props: ValidateItemProps) {
  if (props.item.responseType === "text" && props.item.config.correctAnswerRequired) {
    const isAnswerCorrect = props.item.answer[0] === props.item.config.correctAnswer

    return isAnswerCorrect
  }

  return true
}
