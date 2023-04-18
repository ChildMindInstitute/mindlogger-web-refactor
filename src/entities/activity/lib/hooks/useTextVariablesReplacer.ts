import { ActivityEventProgressRecord } from "../../model/types"
import { MarkdownVariableReplacer } from "../markdownVariableReplacer"
import { Answers } from "../types"

type UseTextVariablesReplacerProps = {
  items: ActivityEventProgressRecord[]
  answers: Answers
}

export const useTextVariablesReplacer = ({ items, answers }: UseTextVariablesReplacerProps) => {
  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const replacer = new MarkdownVariableReplacer(items, answers)
      return replacer.process(text)
    }
    return text
  }

  return { replaceTextVariables }
}
