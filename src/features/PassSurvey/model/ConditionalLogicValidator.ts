import { isSameDay } from 'date-fns';

import { ItemRecord } from '~/entities/applet/model/types';
import {
  BetweenCondition,
  BetweenDatesCondition,
  BetweenSliderRowsCondition,
  BetweenTimeRangeCondition,
  BetweenTimesCondition,
  Condition,
  EqualCondition,
  EqualToDateCondition,
  EqualToOptionCondition,
  EqualToRowOptionCondition,
  EqualToSliderRowsCondition,
  EqualToTimeCondition,
  EqualToTimeRangeCondition,
  GreaterThanCondition,
  GreaterThanDateCondition,
  GreaterThanSliderRowsCondition,
  GreaterThanTimeCondition,
  GreaterThanTimeRangeCondition,
  IncludesOptionCondition,
  IncludesRowOptionCondition,
  LessThanCondition,
  LessThanDateCondition,
  LessThanSliderRowsCondition,
  LessThanTimeCondition,
  LessThanTimeRangeCondition,
  NotEqualCondition,
  NotEqualToDateCondition,
  NotEqualToOptionCondition,
  NotEqualToRowOptionCondition,
  NotEqualToSliderRowsCondition,
  NotEqualToTimeCondition,
  NotEqualToTimeRangeCondition,
  NotIncludesOptionCondition,
  NotIncludesRowOptionCondition,
  OutsideOfCondition,
  OutsideOfDatesCondition,
  OutsideOfSliderRowsCondition,
  OutsideOfTimeRangeCondition,
  OutsideOfTimesCondition,
} from '~/shared/api';
import {
  dateStringToHourMinuteRaw,
  isFirstDateEarlier,
  isFirstDateLater,
  isFirstTimeEarlier,
  isFirstTimeLater,
  isTimesEqual,
} from '~/shared/utils';

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

      case 'GREATER_THAN_TIME':
        return this.validateGreaterThanTime(this.rule, this.item);

      case 'LESS_THAN_TIME':
        return this.validateLessThanTime(this.rule, this.item);

      case 'EQUAL_TO_TIME':
        return this.validateEqualToTime(this.rule, this.item);

      case 'NOT_EQUAL_TO_TIME':
        return this.validateNotEqualToTime(this.rule, this.item);

      case 'BETWEEN_TIMES':
        return this.validateBetweenTimes(this.rule, this.item);

      case 'OUTSIDE_OF_TIMES':
        return this.validateOutsideOfTimes(this.rule, this.item);

      case 'GREATER_THAN_TIME_RANGE':
        return this.validateGreaterThanTimeRange(this.rule, this.item);

      case 'LESS_THAN_TIME_RANGE':
        return this.validateLessThanTimeRange(this.rule, this.item);

      case 'EQUAL_TO_TIME_RANGE':
        return this.validateEqualToTimeRange(this.rule, this.item);

      case 'NOT_EQUAL_TO_TIME_RANGE':
        return this.validateNotEqualToTimeRange(this.rule, this.item);

      case 'BETWEEN_TIME_RANGE':
        return this.validateBetweenTimeRange(this.rule, this.item);

      case 'OUTSIDE_OF_TIME_RANGE':
        return this.validateOutsideOfTimeRange(this.rule, this.item);

      case 'GREATER_THAN_SLIDER_ROWS':
        return this.validateGreaterThanSliderRows(this.rule, this.item);

      case 'LESS_THAN_SLIDER_ROWS':
        return this.validateLessThanSliderRows(this.rule, this.item);

      case 'EQUAL_TO_SLIDER_ROWS':
        return this.validateEqualToSliderRows(this.rule, this.item);

      case 'NOT_EQUAL_TO_SLIDER_ROWS':
        return this.validateNotEqualToSliderRows(this.rule, this.item);

      case 'BETWEEN_SLIDER_ROWS':
        return this.validateBetweenSliderRows(this.rule, this.item);

      case 'OUTSIDE_OF_SLIDER_ROWS':
        return this.validateOutsideOfSliderRows(this.rule, this.item);

      case 'EQUAL_TO_ROW_OPTION':
        return this.validateEqualToRowOption(this.rule, this.item);

      case 'NOT_EQUAL_TO_ROW_OPTION':
        return this.validateNotEqualToRowOption(this.rule, this.item);

      case 'INCLUDES_ROW_OPTION':
        return this.validateIncludesRowOption(this.rule, this.item);

      case 'NOT_INCLUDES_ROW_OPTION':
        return this.validateNotIncludesRowOption(this.rule, this.item);

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
        Number(item.answer[0]) < rule.payload.minValue ||
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

  private validateGreaterThanTime(rule: GreaterThanTimeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'time') {
      const time = dateStringToHourMinuteRaw(item.answer[0]);

      return isFirstTimeLater(time, rule.payload.time);
    }

    return true;
  }

  private validateLessThanTime(rule: LessThanTimeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'time') {
      const time = dateStringToHourMinuteRaw(item.answer[0]);

      return isFirstTimeEarlier(time, rule.payload.time);
    }

    return true;
  }

  private validateEqualToTime(rule: EqualToTimeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'time') {
      const time = dateStringToHourMinuteRaw(item.answer[0]);

      return isTimesEqual(rule.payload.time, time);
    }

    return true;
  }

  private validateNotEqualToTime(rule: NotEqualToTimeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'time') {
      const time = dateStringToHourMinuteRaw(item.answer[0]);

      return !isTimesEqual(rule.payload.time, time);
    }

    return true;
  }

  private validateBetweenTimes(rule: BetweenTimesCondition, item: ItemRecord): boolean {
    if (item.responseType === 'time') {
      const time = dateStringToHourMinuteRaw(item.answer[0]);

      return (
        isFirstTimeEarlier(rule.payload.minTime, time) &&
        isFirstTimeLater(rule.payload.maxTime, time)
      );
    }

    return true;
  }

  private validateOutsideOfTimes(rule: OutsideOfTimesCondition, item: ItemRecord): boolean {
    if (item.responseType === 'time') {
      const time = dateStringToHourMinuteRaw(item.answer[0]);

      return (
        isFirstTimeLater(rule.payload.minTime, time) ||
        isFirstTimeEarlier(rule.payload.maxTime, time)
      );
    }

    return true;
  }

  private validateGreaterThanTimeRange(
    rule: GreaterThanTimeRangeCondition,
    item: ItemRecord,
  ): boolean {
    if (item.responseType === 'timeRange') {
      const timeToValidate = rule.payload.fieldName === 'from' ? item.answer[0] : item.answer[1];

      const time = dateStringToHourMinuteRaw(timeToValidate);

      return isFirstTimeLater(time, rule.payload.time);
    }

    return true;
  }

  private validateLessThanTimeRange(rule: LessThanTimeRangeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'timeRange') {
      const timeToValidate = rule.payload.fieldName === 'from' ? item.answer[0] : item.answer[1];

      const time = dateStringToHourMinuteRaw(timeToValidate);

      return isFirstTimeEarlier(time, rule.payload.time);
    }

    return true;
  }

  private validateEqualToTimeRange(rule: EqualToTimeRangeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'timeRange') {
      const timeToValidate = rule.payload.fieldName === 'from' ? item.answer[0] : item.answer[1];

      const time = dateStringToHourMinuteRaw(timeToValidate);

      return isTimesEqual(rule.payload.time, time);
    }

    return true;
  }

  private validateNotEqualToTimeRange(
    rule: NotEqualToTimeRangeCondition,
    item: ItemRecord,
  ): boolean {
    if (item.responseType === 'timeRange') {
      const timeToValidate = rule.payload.fieldName === 'from' ? item.answer[0] : item.answer[1];

      const time = dateStringToHourMinuteRaw(timeToValidate);

      return !isTimesEqual(rule.payload.time, time);
    }

    return true;
  }

  private validateBetweenTimeRange(rule: BetweenTimeRangeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'timeRange') {
      const timeToValidate = rule.payload.fieldName === 'from' ? item.answer[0] : item.answer[1];

      const time = dateStringToHourMinuteRaw(timeToValidate);

      return (
        isFirstTimeEarlier(rule.payload.minTime, time) &&
        isFirstTimeLater(rule.payload.maxTime, time)
      );
    }

    return true;
  }

  private validateOutsideOfTimeRange(rule: OutsideOfTimeRangeCondition, item: ItemRecord): boolean {
    if (item.responseType === 'timeRange') {
      const timeToValidate = rule.payload.fieldName === 'from' ? item.answer[0] : item.answer[1];

      const time = dateStringToHourMinuteRaw(timeToValidate);

      return (
        isFirstTimeLater(rule.payload.minTime, time) ||
        isFirstTimeEarlier(rule.payload.maxTime, time)
      );
    }

    return true;
  }

  private validateGreaterThanSliderRows(
    rule: GreaterThanSliderRowsCondition,
    item: ItemRecord,
  ): boolean {
    if (item.responseType === 'sliderRows') {
      return rule.payload.value < Number(item.answer[rule.payload.rowIndex]);
    }

    return true;
  }

  private validateLessThanSliderRows(rule: LessThanSliderRowsCondition, item: ItemRecord): boolean {
    if (item.responseType === 'sliderRows') {
      return rule.payload.value > Number(item.answer[rule.payload.rowIndex]);
    }

    return true;
  }

  private validateEqualToSliderRows(rule: EqualToSliderRowsCondition, item: ItemRecord): boolean {
    if (item.responseType === 'sliderRows') {
      return rule.payload.value === Number(item.answer[rule.payload.rowIndex]);
    }

    return true;
  }

  private validateNotEqualToSliderRows(
    rule: NotEqualToSliderRowsCondition,
    item: ItemRecord,
  ): boolean {
    if (item.responseType === 'sliderRows') {
      return rule.payload.value !== Number(item.answer[rule.payload.rowIndex]);
    }

    return true;
  }

  private validateBetweenSliderRows(rule: BetweenSliderRowsCondition, item: ItemRecord): boolean {
    if (item.responseType === 'sliderRows') {
      return (
        Number(item.answer[rule.payload.rowIndex]) > rule.payload.minValue &&
        Number(item.answer[rule.payload.rowIndex]) < rule.payload.maxValue
      );
    }

    return true;
  }

  private validateOutsideOfSliderRows(
    rule: OutsideOfSliderRowsCondition,
    item: ItemRecord,
  ): boolean {
    if (item.responseType === 'sliderRows') {
      return (
        Number(item.answer[rule.payload.rowIndex]) < rule.payload.minValue ||
        Number(item.answer[rule.payload.rowIndex]) > rule.payload.maxValue
      );
    }

    return true;
  }

  private validateEqualToRowOption(rule: EqualToRowOptionCondition, item: ItemRecord): boolean {
    if (item.responseType === 'singleSelectRows') {
      return rule.payload.optionValue === item.answer[rule.payload.rowIndex];
    }

    return true;
  }

  private validateNotEqualToRowOption(
    rule: NotEqualToRowOptionCondition,
    item: ItemRecord,
  ): boolean {
    if (item.responseType === 'singleSelectRows') {
      return rule.payload.optionValue !== item.answer[rule.payload.rowIndex];
    }

    return true;
  }

  private validateIncludesRowOption(rule: IncludesRowOptionCondition, item: ItemRecord): boolean {
    if (item.responseType === 'multiSelectRows') {
      return item.answer[rule.payload.rowIndex].includes(rule.payload.optionValue);
    }

    return true;
  }

  private validateNotIncludesRowOption(
    rule: NotIncludesRowOptionCondition,
    item: ItemRecord,
  ): boolean {
    if (item.responseType === 'multiSelectRows') {
      return !item.answer[rule.payload.rowIndex].includes(rule.payload.optionValue);
    }

    return true;
  }
}
