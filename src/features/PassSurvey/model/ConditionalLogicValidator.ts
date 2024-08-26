import { isSameDay } from 'date-fns';

import { isFirstDateEarlier, isFirstDateLater } from '../../../shared/utils';

import { ItemRecord } from '~/entities/applet/model/types';
import {
  BetweenCondition,
  BetweenDatesCondition,
  Condition,
  EqualCondition,
  EqualToDateCondition,
  EqualToOptionCondition,
  GreaterThanCondition,
  GreaterThanDateCondition,
  IncludesOptionCondition,
  LessThanCondition,
  LessThanDateCondition,
  NotEqualCondition,
  NotEqualToDateCondition,
  NotEqualToOptionCondition,
  NotIncludesOptionCondition,
  OutsideOfCondition,
  OutsideOfDatesCondition,
} from '~/shared/api';

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

      case 'GREATER_THAN_DATE':
        return this.validateGreaterThanDate(this.rule, this.item);

      case 'LESS_THAN_DATE':
        return this.validateLessThanDate(this.rule, this.item);

      case 'EQUAL_TO_DATE':
        return this.validateEqualToDate(this.rule, this.item);

      case 'NOT_EQUAL_TO_DATE':
        return this.validateNotEqualToDate(this.rule, this.item);

      case 'BETWEEN_DATES':
        return this.validateBetweenDates(this.rule, this.item);

      case 'OUTSIDE_OF_DATES':
        return this.validateOutsideOfDates(this.rule, this.item);

      default:
        return true;
    }
  }

  private validateEqualToOption(rule: EqualToOptionCondition, item: ItemRecord): boolean {
    if (item.responseType === 'singleSelect') {
      return rule.payload.optionValue === item.answer[0];
    }

    return true;
  }

  private validateNotEqualToOption(rule: NotEqualToOptionCondition, item: ItemRecord): boolean {
    if (item.responseType === 'singleSelect') {
      return rule.payload.optionValue !== item.answer[0];
    }

    return true;
  }

  private validateIncludesOption(rule: IncludesOptionCondition, item: ItemRecord): boolean {
    if (item.responseType === 'multiSelect') {
      return item.answer.includes(rule.payload.optionValue);
    }

    return true;
  }

  private validateNotIncludesOption(rule: NotIncludesOptionCondition, item: ItemRecord): boolean {
    if (item.responseType === 'multiSelect') {
      return !item.answer.includes(rule.payload.optionValue);
    }

    return true;
  }

  private validateEqual(rule: EqualCondition, item: ItemRecord): boolean {
    if (item.responseType === 'slider' || item.responseType === 'numberSelect') {
      return rule.payload.value === Number(item.answer[0]);
    }

    return true;
  }

  private validateNotEqual(rule: NotEqualCondition, item: ItemRecord): boolean {
    if (item.responseType === 'slider' || item.responseType === 'numberSelect') {
      return rule.payload.value !== Number(item.answer[0]);
    }

    return true;
  }

  private validateGreaterThan(rule: GreaterThanCondition, item: ItemRecord): boolean {
    if (item.responseType === 'slider' || item.responseType === 'numberSelect') {
      return rule.payload.value < Number(item.answer[0]);
    }

    return true;
  }

  private validateLessThan(rule: LessThanCondition, item: ItemRecord): boolean {
    if (item.responseType === 'slider' || item.responseType === 'numberSelect') {
      return rule.payload.value > Number(item.answer[0]);
    }

    return true;
  }

  private validateBetween(rule: BetweenCondition, item: ItemRecord): boolean {
    if (item.responseType === 'slider' || item.responseType === 'numberSelect') {
      return (
        Number(item.answer[0]) > rule.payload.minValue &&
        Number(item.answer[0]) < rule.payload.maxValue
      );
    }

    return true;
  }

  private validateOutsideOf(rule: OutsideOfCondition, item: ItemRecord): boolean {
    if (item.responseType === 'slider' || item.responseType === 'numberSelect') {
      return (
        Number(item.answer[0]) < rule.payload.minValue &&
        Number(item.answer[0]) > rule.payload.maxValue
      );
    }

    return true;
  }

  private validateGreaterThanDate(rule: GreaterThanDateCondition, item: ItemRecord): boolean {
    if (item.responseType === 'date') {
      return isFirstDateEarlier(new Date(rule.payload.date), new Date(item.answer[0]));
    }

    return true;
  }

  private validateLessThanDate(rule: LessThanDateCondition, item: ItemRecord): boolean {
    if (item.responseType === 'date') {
      return isFirstDateLater(new Date(rule.payload.date), new Date(item.answer[0]));
    }

    return true;
  }

  private validateEqualToDate(rule: EqualToDateCondition, item: ItemRecord): boolean {
    if (item.responseType === 'date') {
      return isSameDay(new Date(rule.payload.date), new Date(item.answer[0]));
    }

    return true;
  }

  private validateNotEqualToDate(rule: NotEqualToDateCondition, item: ItemRecord): boolean {
    if (item.responseType === 'date') {
      return !isSameDay(new Date(rule.payload.date), new Date(item.answer[0]));
    }

    return true;
  }

  private validateBetweenDates(rule: BetweenDatesCondition, item: ItemRecord): boolean {
    if (item.responseType === 'date') {
      return (
        isFirstDateEarlier(new Date(rule.payload.minDate), new Date(item.answer[0])) &&
        isFirstDateLater(new Date(rule.payload.maxDate), new Date(item.answer[0]))
      );
    }

    return true;
  }

  private validateOutsideOfDates(rule: OutsideOfDatesCondition, item: ItemRecord): boolean {
    if (item.responseType === 'date') {
      return (
        isFirstDateLater(new Date(rule.payload.minDate), new Date(item.answer[0])) ||
        isFirstDateEarlier(new Date(rule.payload.maxDate), new Date(item.answer[0]))
      );
    }

    return true;
  }
}
