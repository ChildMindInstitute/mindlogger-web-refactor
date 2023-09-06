import { completedEntitiesSelector } from "../../model/selectors"
import { ActivityEventProgressRecord } from "../../model/types"
import { MarkdownVariableReplacer } from "../markdownVariableReplacer"
import { Answers } from "../types"

import { RespondentMetaDTO } from "~/shared/api"
import { useAppSelector } from "~/shared/utils"

type UseTextVariablesReplacerProps = {
  items: ActivityEventProgressRecord[]
  answers: Answers
  activityId: string
  respondentMeta?: RespondentMetaDTO
}

export const useTextVariablesReplacer = ({
  items,
  answers,
  activityId,
  respondentMeta,
}: UseTextVariablesReplacerProps) => {
  const completedEntities = useAppSelector(completedEntitiesSelector)

  const completedEntityTime = completedEntities[activityId]

  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const nickname = respondentMeta?.nickname

      const replacer = new MarkdownVariableReplacer(items, answers, completedEntityTime, nickname)
      return replacer.process(text)
    }
    return text
  }

  return { replaceTextVariables }
}
