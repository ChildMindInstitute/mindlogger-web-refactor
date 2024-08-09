import { ConditionalLogicValidator } from './ConditionalLogicValidator';

import { appletModel } from '~/entities/applet/';
import { Condition } from '~/shared/api';

type Item = appletModel.ItemRecord;

export type ItemMapByName = Record<string, Item>;

type ProcessResult = {
  visibleItems: Item[];
  hiddenItemIds: Set<string>;
};

interface IConditionalLogicFilter {
  filter: (items: Item[]) => ProcessResult;
}

class ConditionalLogicFilter implements IConditionalLogicFilter {
  private hiddenOrSkippedItemNames: Set<string> = new Set();
  private hiddenOrSkippedItemIds: Set<string> = new Set();

  public filter(items: Item[]): ProcessResult {
    const visibleItems = items.filter((item, index, array) => {
      const isItemVisible = this.conditionalLogicFilter(item, index, array);

      this.handleItemVisibility(item, isItemVisible);

      return isItemVisible;
    });

    return {
      visibleItems,
      hiddenItemIds: this.hiddenOrSkippedItemIds,
    };
  }

  private handleItemVisibility(item: Item, isVisible: boolean) {
    if (isVisible) {
      this.hiddenOrSkippedItemNames.delete(item.name);
      this.hiddenOrSkippedItemIds.delete(item.id);
    } else {
      this.hiddenOrSkippedItemNames.add(item.name);
      this.hiddenOrSkippedItemIds.add(item.id);
    }
  }

  private conditionalLogicFilter(item: Item, index: number, array: Item[]): boolean {
    const { conditionalLogic } = item;

    if (!conditionalLogic) {
      return true;
    }

    const itemMapByName: ItemMapByName = array.reduce<ItemMapByName>((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {});

    const conditionPattern = conditionalLogic.match;
    const conditionRules = conditionalLogic.conditions;

    switch (conditionPattern) {
      case 'all':
        return this.checkAllRules(conditionRules, itemMapByName);

      case 'any':
        return this.checkAnyRules(conditionRules, itemMapByName);

      default:
        return true;
    }
  }

  private checkAllRules(rules: Condition[], itemsMap: ItemMapByName): boolean {
    const checkResult = rules.every((rule) => {
      const item = itemsMap[rule.itemName];

      if (!item.answer.length || this.hiddenOrSkippedItemNames.has(rule.itemName)) {
        return false;
      }

      return this.checkRuleByPattern(rule, item);
    });

    return checkResult;
  }

  private checkAnyRules(rules: Condition[], itemsMap: ItemMapByName): boolean {
    const checkResult = rules.some((rule) => {
      const item = itemsMap[rule.itemName];

      if (!item.answer.length || this.hiddenOrSkippedItemNames.has(rule.itemName)) {
        return false;
      }

      return this.checkRuleByPattern(rule, item);
    });

    return checkResult;
  }

  private checkRuleByPattern(rule: Condition, item: Item): boolean {
    const validator = new ConditionalLogicValidator(item, rule);

    return validator.validate();
  }
}

export const conditionalLogicFilter = new ConditionalLogicFilter();
