import { isSameDay } from 'date-fns';

import { DefaultAnswer } from '~/entities/activity';
import { ItemRecord } from '~/entities/applet/model/types';
import {
  BetweenCondition,
  Condition,
  EqualCondition,
  EqualToOptionCondition,
  GreaterThanCondition,
  IncludesOptionCondition,
  LessThanCondition,
  NotEqualCondition,
  NotEqualToOptionCondition,
  NotIncludesOptionCondition,
  OutsideOfCondition,
} from '~/shared/api';
import { isFirstDateEarlier, isFirstDateLater } from '~/shared/utils';

interface IConditionalLogicValidator {
  validate: () => boolean;
}

export class ConditionalLogicValidator implements IConditionalLogicValidator {
  constructor(
    private item: ItemRecord,
    private rule: Condition,
  ) {}

  public validate(): boolean {
    switch (this.rule.type) {
      case 'EQUAL_TO_OPTION':
        return this.validateEqualToOption(this.rule, this.item);

      case 'NOT_EQUAL_TO_OPTION':
        return this.validateNotEqualToOption(this.rule, this.item);

      case 'INCLUDES_OPTION':
        return this.validateIncludesOption(this.rule, this.item);

      case 'NOT_INCLUDES_OPTION':
        return this.validateNotIncludesOption(this.rule, this.item);

      case 'EQUAL':
        return this.validateEqual(this.rule, this.item);

      case 'NOT_EQUAL':
        return this.validateNotEqual(this.rule, this.item);

      case 'GREATER_THAN':
        return this.validateGreaterThan(this.rule, this.item);

      case 'LESS_THAN':
        return this.validateLessThan(this.rule, this.item);

      case 'BETWEEN':
        return this.validateBetween(this.rule, this.item);

      case 'OUTSIDE_OF':
        return this.validateOutsideOf(this.rule, this.item);

      default:
        return true;
    }
  }

  private validateEqualToOption(rule: EqualToOptionCondition, item: ItemRecord): boolean {
    return rule.payload.optionValue === item.answer[0];
  }

  private validateNotEqualToOption(rule: NotEqualToOptionCondition, item: ItemRecord): boolean {
    return rule.payload.optionValue !== item.answer[0];
  }

  private validateIncludesOption(rule: IncludesOptionCondition, item: ItemRecord): boolean {
    return (item.answer as DefaultAnswer).includes(rule.payload.optionValue);
  }

  private validateNotIncludesOption(rule: NotIncludesOptionCondition, item: ItemRecord): boolean {
    return !(item.answer as DefaultAnswer).includes(rule.payload.optionValue);
  }

  private validateEqual(rule: EqualCondition, item: ItemRecord): boolean {
    switch (item.responseType) {
      case 'slider':
      case 'numberSelect':
        return Number(rule.payload.value) === Number(item.answer[0]);

      case 'date':
        return isSameDay(new Date(item.answer[0]), new Date(rule.payload.value));

      default:
        return true;
    }
  }

  private validateNotEqual(rule: NotEqualCondition, item: ItemRecord): boolean {
    switch (item.responseType) {
      case 'slider':
      case 'numberSelect':
        return Number(rule.payload.value) !== Number(item.answer[0]);

      case 'date':
        return !isSameDay(new Date(item.answer[0]), new Date(rule.payload.value));

      default:
        return true;
    }
  }

  private validateGreaterThan(rule: GreaterThanCondition, item: ItemRecord): boolean {
    switch (item.responseType) {
      case 'slider':
      case 'numberSelect':
        return Number(rule.payload.value) < Number(item.answer[0]);

      case 'date':
        return isFirstDateLater(new Date(item.answer[0]), new Date(rule.payload.value));

      default:
        return true;
    }
  }

  private validateLessThan(rule: LessThanCondition, item: ItemRecord): boolean {
    switch (item.responseType) {
      case 'slider':
      case 'numberSelect':
        return Number(rule.payload.value) > Number(item.answer[0]);

      case 'date':
        return isFirstDateEarlier(new Date(item.answer[0]), new Date(rule.payload.value));

      default:
        return true;
    }
  }

  private validateBetween(rule: BetweenCondition, item: ItemRecord): boolean {
    switch (item.responseType) {
      case 'slider':
      case 'numberSelect':
        return (
          Number(item.answer[0]) > Number(rule.payload.minValue) &&
          Number(item.answer[0]) < Number(rule.payload.maxValue)
        );

      case 'date':
        return (
          isFirstDateLater(new Date(item.answer[0]), new Date(rule.payload.minValue)) &&
          isFirstDateEarlier(new Date(item.answer[0]), new Date(rule.payload.maxValue))
        );

      default:
        return true;
    }
  }

  private validateOutsideOf(rule: OutsideOfCondition, item: ItemRecord): boolean {
    switch (item.responseType) {
      case 'slider':
      case 'numberSelect':
        return (
          Number(item.answer[0]) < Number(rule.payload.minValue) ||
          Number(item.answer[0]) > Number(rule.payload.maxValue)
        );

      case 'date':
        return (
          isFirstDateEarlier(new Date(item.answer[0]), new Date(rule.payload.minValue)) ||
          isFirstDateLater(new Date(item.answer[0]), new Date(rule.payload.maxValue))
        );

      default:
        return true;
    }
  }
}
