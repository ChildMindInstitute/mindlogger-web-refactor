import { ItemRecord } from "./types"

import { Answer } from "~/abstract/lib"
import { Condition } from "~/shared/api"

export type ItemMapByName = Record<string, ItemRecord>

class ConditionalLogicBuilder {
  private hiddenOrSkippedItemNames: Set<string> = new Set()

  public process(items: ItemRecord[]): ItemRecord[] {
    return items.filter((item, index, array) => {
      const isItemVisible = this.conditionalLogicFilter(item, index, array)

      this.handleItemVisibility(item.name, isItemVisible)

      return isItemVisible
    })
  }

  private handleItemVisibility(itemName: string, isVisible: boolean) {
    if (isVisible) {
      this.hiddenOrSkippedItemNames.delete(itemName)
    } else {
      this.hiddenOrSkippedItemNames.add(itemName)
    }
  }

  private conditionalLogicFilter(item: ItemRecord, index: number, array: ItemRecord[]): boolean {
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

      if (!answer.length || this.hiddenOrSkippedItemNames.has(rule.itemName)) {
        return false
      }

      return this.checkRuleByPattern(rule, answer)
    })

    return checkResult
  }

  private checkAnyRules(rules: Condition[], itemsMap: ItemMapByName): boolean {
    const checkResult = rules.some(rule => {
      const answer = itemsMap[rule.itemName].answer

      if (!answer.length || this.hiddenOrSkippedItemNames.has(rule.itemName)) {
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

  private getOptionIdByValue(item: ItemRecord): string[] {
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
