import { Condition } from "../../../shared/api"
import { ActivityEventProgressRecord } from "../model/types"
import { Answer } from "./types"

export type ItemMapByName = Record<string, ActivityEventProgressRecord>

class ConditionalLogicBuilder {
  public process(items: ActivityEventProgressRecord[]): ActivityEventProgressRecord[] {
    return items.filter(this.conditionalLogicFilter)
  }

  private conditionalLogicFilter(
    item: ActivityEventProgressRecord,
    index: number,
    array: ActivityEventProgressRecord[],
  ): boolean {
    const condition = item.conditionalLogic

    if (!condition) {
      return true
    }

    const itemMapByName: ItemMapByName = {}

    array.forEach(item => {
      itemMapByName[item.name] = item
    })

    const conditionPattern = condition.match
    const conditionRules = condition.conditions

    switch (conditionPattern) {
      case "ALL":
        return this.checkAllRules(conditionRules, itemMapByName)

      case "Any":
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
        return rule.payload.optiondId === answer[0]

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
