import { completedEntitiesSelector } from "../../model/selectors"
import { ActivityEventProgressRecord } from "../../model/types"
import { MarkdownVariableReplacer } from "../markdownVariableReplacer"
import { Answers } from "../types"

import { useAppSelector } from "~/shared/utils"

type UseTextVariablesReplacerProps = {
  items: ActivityEventProgressRecord[]
  answers: Answers
  activityId: string
}

export const useTextVariablesReplacer = ({ items, answers, activityId }: UseTextVariablesReplacerProps) => {
  const completedEntities = useAppSelector(completedEntitiesSelector)

  const completedEntityTime = completedEntities[activityId]

  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const replacer = new MarkdownVariableReplacer(items, answers, completedEntityTime)
      return replacer.process(text)
    }
    return text
  }

  return { replaceTextVariables }
}
