import { ActivityEventProgressRecord } from "../model/types"
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
      const answer = itemsMap[rule.itemName]?.answer

      if (!answer) {
        return false
      }

      return this.checkRuleByPattern(rule, answer)
    })

    return checkResult
  }

  private checkAnyRules(rules: Condition[], itemsMap: ItemMapByName): boolean {
    const checkResult = rules.some(rule => {
      const answer = itemsMap[rule.itemName]?.answer

      if (!answer) {
        return false
      }

      return this.checkRuleByPattern(rule, answer)
    })

    return checkResult
  }

  private checkRuleByPattern(rule: Condition, answer: Answer): boolean {
    switch (rule.type) {
      case "EQUAL_TO_OPTION":
        return rule.payload.optionId === answer[0]

      case "NOT_EQUAL_TO_OPTION":
        return rule.payload.optionId !== answer[0]

      case "INCLUDES_OPTION":
        return answer.includes(rule.payload.optionId)

      case "NOT_INCLUDES_OPTION":
        return !answer.includes(rule.payload.optionId)

      case "EQUAL":
        return rule.payload.value === Number(answer[0])

      case "NOT_EQUAL":
        return rule.payload.value !== Number(answer[0])

      case "GREATER_THAN":
        return rule.payload.value > Number(answer[0])

      case "LESS_THAN":
        return rule.payload.value < Number(answer[0])

      case "BETWEEN":
        return Number(answer[0]) > rule.payload.minValue && Number(answer[0]) < rule.payload.maxValue

      case "OUTSIDE_OF":
        return Number(answer[0]) < rule.payload.minValue && Number(answer[0]) > rule.payload.maxValue

      default:
        return true
    }
  }
}

export const conditionalLogicBuilder = new ConditionalLogicBuilder()
