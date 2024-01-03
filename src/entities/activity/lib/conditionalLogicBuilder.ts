import { ActivityEventProgressRecord } from "../../applet/model/types"
import { Answer } from "./types"

import { Condition } from "~/shared/api"

export type ItemMapByName = Record<string, ActivityEventProgressRecord>

class ConditionalLogicBuilder {
  public process(items: ActivityEventProgressRecord[]): ActivityEventProgressRecord[] {
    return items.filter((item, index, array) => this.conditionalLogicFilter(item, index, array))
  }

  private conditionalLogicFilter(
    item: ActivityEventProgressRecord,
    index: number,
    array: ActivityEventProgressRecord[],
  ): boolean {
    const { conditionalLogic } = item

    if (!conditionalLogic) {
      return true
    }

    const itemMapByName: ItemMapByName = array.reduce<ItemMapByName>((acc, item) => {
      acc[item.name] = item
      return acc
    }, {})

    const conditionPattern = conditionalLogic.match
    const conditionRules = conditionalLogic.conditions

    switch (conditionPattern) {
      case "all":
        return this.checkAllRules(conditionRules, itemMapByName)

      case "any":
        return this.checkAnyRules(conditionRules, itemMapByName)

      default:
        return true
    }
  }

  private checkAllRules(rules: Condition[], itemsMap: ItemMapByName): boolean {
    const checkResult = rules.every(rule => {
      const answer = itemsMap[rule.itemName].answer

      if (!answer.length) {
        return false
      }

      return this.checkRuleByPattern(rule, answer)
    })

    return checkResult
  }

  private checkAnyRules(rules: Condition[], itemsMap: ItemMapByName): boolean {
    const checkResult = rules.some(rule => {
      const answer = itemsMap[rule.itemName].answer

      if (!answer.length) {
        return false
      }

      return this.checkRuleByPattern(rule, answer)
    })

    return checkResult
  }

  private checkRuleByPattern(rule: Condition, answer: Answer): boolean {
    switch (rule.type) {
      case "EQUAL_TO_OPTION":
        return rule.payload.optionValue === answer[0]

      case "NOT_EQUAL_TO_OPTION":
        return rule.payload.optionValue !== answer[0]

      case "INCLUDES_OPTION":
        return answer.includes(rule.payload.optionValue)

      case "NOT_INCLUDES_OPTION":
        return !answer.includes(rule.payload.optionValue)

      case "EQUAL":
        return rule.payload.value === Number(answer[0])

      case "NOT_EQUAL":
        return rule.payload.value !== Number(answer[0])

      case "GREATER_THAN":
        return rule.payload.value < Number(answer[0])

      case "LESS_THAN":
        return rule.payload.value > Number(answer[0])

      case "BETWEEN":
        return Number(answer[0]) > rule.payload.minValue && Number(answer[0]) < rule.payload.maxValue

      case "OUTSIDE_OF":
        return Number(answer[0]) < rule.payload.minValue || Number(answer[0]) > rule.payload.maxValue

      default:
        return true
    }
  }

  private getOptionIdByValue(item: ActivityEventProgressRecord): string[] {
    if (item.responseType === "multiSelect" || item.responseType === "singleSelect") {
      const { answer, responseValues } = item
      const optionIds = answer
        .map((value: string) => {
          const option = responseValues.options.find(option => option.value === Number(value))
          return option?.id
        })
        .filter(element => element !== undefined) as Array<string>

      return optionIds
    }

    return item.answer
  }
}

export const conditionalLogicBuilder = new ConditionalLogicBuilder()
