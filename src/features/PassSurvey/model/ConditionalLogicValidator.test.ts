import { ConditionalLogicValidator } from './ConditionalLogicValidator';

import {
  CheckboxItem,
  DateItem,
  RadioItem,
  SelectorItem,
  SliderItem,
  TimeItem,
  TimeRangeItem,
} from '~/entities/activity';
import {
  EqualToOptionCondition,
  NotEqualToOptionCondition,
  IncludesOptionCondition,
  NotIncludesOptionCondition,
  EqualCondition,
  NotEqualCondition,
  GreaterThanCondition,
  LessThanCondition,
  BetweenCondition,
  OutsideOfCondition,
  EqualToDateCondition,
  NotEqualToDateCondition,
  GreaterThanDateCondition,
  LessThanDateCondition,
  BetweenDatesCondition,
  OutsideOfDatesCondition,
  GreaterThanTimeCondition,
  LessThanTimeCondition,
  EqualToTimeCondition,
  NotEqualToTimeCondition,
  BetweenTimesCondition,
  OutsideOfTimesCondition,
  GreaterThanTimeRangeCondition,
  LessThanTimeRangeCondition,
  EqualToTimeRangeCondition,
  NotEqualToTimeRangeCondition,
  BetweenTimeRangeCondition,
  OutsideOfTimeRangeCondition,
} from '~/shared/api';

describe('ConditionalLogicValidator', () => {
  it('should validate EQUAL_TO_OPTION correctly -> the answers match', () => {
    const optionValue = 'option-value-1';

    const condition: EqualToOptionCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'singleSelect',
      answer: [optionValue],
    } as RadioItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL_TO_OPTION correctly -> the answers don`t match', () => {
    const optionValue = 'option-value-1';

    const condition: EqualToOptionCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'singleSelect',
      answer: ['wrong-answer'],
    } as RadioItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL_TO_OPTION correctly -> the answers don`t match', () => {
    const optionValue = 'option-value-1';

    const condition: NotEqualToOptionCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'singleSelect',
      answer: ['wrong-answer'],
    } as RadioItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL_TO_OPTION correctly -> the answers match', () => {
    const optionValue = 'option-value-1';

    const condition: NotEqualToOptionCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'singleSelect',
      answer: [optionValue],
    } as RadioItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate INCLUDES_OPTION correctly for multiSelect -> the answers includes', () => {
    const optionValue = 'option-value-1';

    const condition: IncludesOptionCondition = {
      itemName: 'random-item-name',
      type: 'INCLUDES_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'multiSelect',
      answer: [optionValue],
    } as CheckboxItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate INCLUDES_OPTION correctly for multiSelect -> the answers don`t includes', () => {
    const optionValue = 'option-value-1';

    const condition: IncludesOptionCondition = {
      itemName: 'random-item-name',
      type: 'INCLUDES_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'multiSelect',
      answer: ['wrong-answer'],
    } as CheckboxItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_INCLUDES_OPTION correctly for multiSelect -> the answers don`t includes', () => {
    const optionValue = 'option-value-1';

    const condition: NotIncludesOptionCondition = {
      itemName: 'random-item-name',
      type: 'NOT_INCLUDES_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'multiSelect',
      answer: ['wrong-answer'],
    } as CheckboxItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_INCLUDES_OPTION correctly for multiSelect -> the answers includes', () => {
    const optionValue = 'option-value-1';

    const condition: NotIncludesOptionCondition = {
      itemName: 'random-item-name',
      type: 'NOT_INCLUDES_OPTION',
      payload: { optionValue },
    };

    const item = {
      responseType: 'multiSelect',
      answer: [optionValue],
    } as CheckboxItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL correctly for numberSelect -> value equal', () => {
    const condition: EqualCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL',
      payload: { value: 25 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['25'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL correctly for numberSelect -> value not equal', () => {
    const condition: EqualCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL',
      payload: { value: 25 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['20'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL correctly for numberSelect - value not equal', () => {
    const condition: NotEqualCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['10'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL correctly for numberSelect - value equal', () => {
    const condition: NotEqualCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['5'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL correctly for slider -> value equal', () => {
    const condition: EqualCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL',
      payload: { value: 25 },
    };

    const item = {
      responseType: 'slider',
      answer: ['25'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL correctly for slider -> value not equal', () => {
    const condition: EqualCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL',
      payload: { value: 25 },
    };

    const item = {
      responseType: 'slider',
      answer: ['20'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL correctly for slider - value not equal', () => {
    const condition: NotEqualCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'slider',
      answer: ['10'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL correctly for slider - value equal', () => {
    const condition: NotEqualCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'slider',
      answer: ['5'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN correctly for numberSelect - value greater', () => {
    const condition: GreaterThanCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['6'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate GREATER_THAN correctly for numberSelect - value not greater', () => {
    const condition: GreaterThanCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['4'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN correctly for numberSelect - value equal', () => {
    const condition: GreaterThanCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['5'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN correctly for slider - value greater', () => {
    const condition: GreaterThanCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'slider',
      answer: ['6'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate GREATER_THAN correctly for slider - value not greater', () => {
    const condition: GreaterThanCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'slider',
      answer: ['4'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN correctly for slider - value equal', () => {
    const condition: GreaterThanCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN',
      payload: { value: 5 },
    };

    const item = {
      responseType: 'slider',
      answer: ['5'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN correctly for numberSelect - value less', () => {
    const condition: LessThanCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN',
      payload: { value: 30 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['5'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate LESS_THAN correctly for numberSelect - value not less', () => {
    const condition: LessThanCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN',
      payload: { value: 30 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['35'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN correctly for numberSelect - value equal', () => {
    const condition: LessThanCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN',
      payload: { value: 30 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['30'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN correctly for slider - value less', () => {
    const condition: LessThanCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN',
      payload: { value: 30 },
    };

    const item = {
      responseType: 'slider',
      answer: ['5'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate LESS_THAN correctly for slider - value not less', () => {
    const condition: LessThanCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN',
      payload: { value: 30 },
    };

    const item = {
      responseType: 'slider',
      answer: ['35'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN correctly for slider - value equal', () => {
    const condition: LessThanCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN',
      payload: { value: 30 },
    };

    const item = {
      responseType: 'slider',
      answer: ['30'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN correctly for numberSelect - value between', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['6'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate BETWEEN correctly for numberSelect - value not between', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['15'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN correctly for numberSelect - value equal to minValue', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['5'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN correctly for numberSelect - value equal to maxValue', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['10'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN correctly for slider - value between', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['6'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate BETWEEN correctly for slider - value not between', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['15'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN correctly for slider - value equal to minValue', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['5'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN correctly for slider - value equal to maxValue', () => {
    const condition: BetweenCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['10'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF correctly for numberSelect - value outside', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['15'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate OUTSIDE_OF correctly for numberSelect - value not outside', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['6'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF correctly for numberSelect - value equal to minValue', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['5'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF correctly for numberSelect - value equal to maxValue', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'numberSelect',
      answer: ['10'],
    } as SelectorItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF correctly for slider - value outside', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['15'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate OUTSIDE_OF correctly for slider - value not outside', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['6'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF correctly for slider - value equal to minValue', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['5'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF correctly for slider - value equal to maxValue', () => {
    const condition: OutsideOfCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF',
      payload: { minValue: 5, maxValue: 10 },
    };

    const item = {
      responseType: 'slider',
      answer: ['10'],
    } as SliderItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL_TO_DATE correctly -> the dates match', () => {
    const date = '2021-01-01';

    const condition: EqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: [date],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL_TO_DATE correctly -> the dates don`t match', () => {
    const date = '2021-01-01';

    const condition: EqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-02'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL_TO_DATE correctly -> the dates don`t match', () => {
    const date = '2021-01-01';

    const condition: NotEqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-02'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL_TO_DATE correctly -> the dates match', () => {
    const date = '2021-01-01';

    const condition: NotEqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: [date],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN_DATE correctly -> the date is greater', () => {
    const date = '2021-01-01';

    const condition: GreaterThanDateCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-02'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate GREATER_THAN_DATE correctly -> the date is equal', () => {
    const date = '2021-01-01';

    const condition: GreaterThanDateCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-01'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN_DATE correctly -> the date is less', () => {
    const date = '2021-01-01';

    const condition: GreaterThanDateCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2020-12-31'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN_DATE correctly -> the date is less', () => {
    const date = '2021-01-01';

    const condition: LessThanDateCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2020-12-31'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate LESS_THAN_DATE correctly -> the date is equal', () => {
    const date = '2021-01-01';

    const condition: LessThanDateCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-01'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN_DATE correctly -> the date is greater', () => {
    const date = '2021-01-01';

    const condition: LessThanDateCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-02'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL_TO_DATE correctly -> the dates match with different formats', () => {
    const date = '2021-01-01';

    const condition: EqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['01/01/2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL_TO_DATE correctly -> the dates don`t match with different formats', () => {
    const date = '2021-01-01';

    const condition: EqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['02/01/2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL_TO_DATE correctly -> the dates match with different formats and separators', () => {
    const date = '2021-01-01';

    const condition: EqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['01.01.2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL_TO_DATE correctly -> the dates don`t match with different formats and separators', () => {
    const date = '2021-01-01';

    const condition: EqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['02.01.2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL_TO_DATE correctly -> the dates don`t match with different formats', () => {
    const date = '2021-01-01';

    const condition: NotEqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['02/01/2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL_TO_DATE correctly -> the dates match with different formats', () => {
    const date = '2021-01-01';

    const condition: NotEqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['01/01/2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL_TO_DATE correctly -> the dates don`t match with different formats and separators', () => {
    const date = '2021-01-01';

    const condition: NotEqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['02.01.2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL_TO_DATE correctly -> the dates match with different formats and separators', () => {
    const date = '2021-01-01';

    const condition: NotEqualToDateCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_DATE',
      payload: { date },
    };

    const item = {
      responseType: 'date',
      answer: ['01.01.2021'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_DATES correctly -> the date is between', () => {
    const condition: BetweenDatesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-05'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate BETWEEN_DATES correctly -> the date is not between', () => {
    const condition: BetweenDatesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-15'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_DATES correctly -> the date is equal to minDate', () => {
    const condition: BetweenDatesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-01'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_DATES correctly -> the date is equal to maxDate', () => {
    const condition: BetweenDatesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-10'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_DATES correctly -> the date is outside', () => {
    const condition: OutsideOfDatesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-15'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate OUTSIDE_OF_DATES correctly -> the date is not outside', () => {
    const condition: OutsideOfDatesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-05'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_DATES correctly -> the date is equal to minDate', () => {
    const condition: OutsideOfDatesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-01'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_DATES correctly -> the date is equal to maxDate', () => {
    const condition: OutsideOfDatesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_DATES',
      payload: { minDate: '2021-01-01', maxDate: '2021-01-10' },
    };

    const item = {
      responseType: 'date',
      answer: ['2021-01-10'],
    } as DateItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL_TO_TIME correctly -> the times match', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: EqualToTimeCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL_TO_TIME correctly -> the times don`t match', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: EqualToTimeCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:31:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL_TO_TIME correctly -> the times don`t match', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: NotEqualToTimeCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:31:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL_TO_TIME correctly -> the times match', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: NotEqualToTimeCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN_TIME correctly -> the time is greater', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: GreaterThanTimeCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:31:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate GREATER_THAN_TIME correctly -> the time is equal', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: GreaterThanTimeCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN_TIME correctly -> the time is less', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: GreaterThanTimeCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:29:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN_TIME correctly -> the time is less', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: LessThanTimeCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:29:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate LESS_THAN_TIME correctly -> the time is equal', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: LessThanTimeCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN_TIME correctly -> the time is greater', () => {
    const time = {
      hours: 10,
      minutes: 30,
    };

    const condition: LessThanTimeCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_TIME',
      payload: { time },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:31:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIMES correctly -> the time is between', () => {
    const condition: BetweenTimesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate BETWEEN_TIMES correctly -> the time is not between', () => {
    const condition: BetweenTimesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIMES correctly -> the time is equal to minTime', () => {
    const condition: BetweenTimesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIMES correctly -> the time is equal to maxTime', () => {
    const condition: BetweenTimesCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIMES correctly -> the time is outside', () => {
    const condition: OutsideOfTimesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate OUTSIDE_OF_TIMES correctly -> the time is not outside', () => {
    const condition: OutsideOfTimesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIMES correctly -> the time is equal to minTime', () => {
    const condition: OutsideOfTimesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIMES correctly -> the time is equal to maxTime', () => {
    const condition: OutsideOfTimesCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIMES',
      payload: { minTime: { hours: 10, minutes: 0 }, maxTime: { hours: 11, minutes: 0 } },
    };

    const item = {
      responseType: 'time',
      answer: ['Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)'],
    } as TimeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL_TO_TIME_RANGE correctly -> the from times match', () => {
    const condition: EqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'from',
        time: { hours: 10, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL_TO_TIME_RANGE correctly -> the from times don`t match', () => {
    const condition: EqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'from',
        time: { hours: 10, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 12:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate EQUAL_TO_TIME_RANGE correctly -> the to times match', () => {
    const condition: EqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'to',
        time: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate EQUAL_TO_TIME_RANGE correctly -> the to times don`t match', () => {
    const condition: EqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'to',
        time: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 12:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL_TO_TIME_RANGE correctly -> the from times don`t match', () => {
    const condition: NotEqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'from',
        time: { hours: 10, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 12:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL_TO_TIME_RANGE correctly -> the from times match', () => {
    const condition: NotEqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'from',
        time: { hours: 10, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate NOT_EQUAL_TO_TIME_RANGE correctly -> the to times don`t match', () => {
    const condition: NotEqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'to',
        time: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 12:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate NOT_EQUAL_TO_TIME_RANGE correctly -> the to times match', () => {
    const condition: NotEqualToTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'NOT_EQUAL_TO_TIME_RANGE',
      payload: {
        fieldName: 'to',
        time: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN_TIME_RANGE correctly -> the from time is greater', () => {
    const condition: GreaterThanTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_TIME_RANGE',
      payload: {
        fieldName: 'from',
        time: { hours: 10, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 12:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate GREATER_THAN_TIME_RANGE correctly -> the from time is equal', () => {
    const condition: GreaterThanTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_TIME_RANGE',
      payload: {
        fieldName: 'from',
        time: { hours: 10, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate GREATER_THAN_TIME_RANGE correctly -> the from time is less', () => {
    const condition: GreaterThanTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'GREATER_THAN_TIME_RANGE',
      payload: {
        fieldName: 'from',
        time: { hours: 10, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 09:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN_TIME_RANGE correctly -> the to time is less', () => {
    const condition: LessThanTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_TIME_RANGE',
      payload: {
        fieldName: 'to',
        time: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate LESS_THAN_TIME_RANGE correctly -> the to time is equal', () => {
    const condition: LessThanTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_TIME_RANGE',
      payload: {
        fieldName: 'to',
        time: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate LESS_THAN_TIME_RANGE correctly -> the to time is greater', () => {
    const condition: LessThanTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'LESS_THAN_TIME_RANGE',
      payload: {
        fieldName: 'to',
        time: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 12:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the time range is between', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the time range is not between', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 09:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the time range is equal to minTime', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the time range is equal to maxTime', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the to time range is between', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 9:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the to time range is not between', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the to time range is equal to minTime', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 30 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate BETWEEN_TIME_RANGES correctly -> the to time range is equal to maxTime', () => {
    const condition: BetweenTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'BETWEEN_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 30 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the from time range is outside', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 09:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the from time range is not outside', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the from time range is equal to minTime', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the from time range is equal to maxTime', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'from',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the to time range is outside', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(true);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the to time range is not outside', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the to time range is equal to minTime', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:00:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });

  it('should validate OUTSIDE_OF_TIME_RANGES correctly -> the to time range is equal to maxTime', () => {
    const condition: OutsideOfTimeRangeCondition = {
      itemName: 'random-item-name',
      type: 'OUTSIDE_OF_TIME_RANGE',
      payload: {
        fieldName: 'to',
        minTime: { hours: 10, minutes: 0 },
        maxTime: { hours: 11, minutes: 0 },
      },
    };

    const item = {
      responseType: 'timeRange',
      answer: [
        'Wed Aug 28 2024 10:30:00 GMT+0200 (Central European Summer Time)',
        'Wed Aug 28 2024 11:00:00 GMT+0200 (Central European Summer Time)',
      ],
    } as TimeRangeItem;

    const validator = new ConditionalLogicValidator(item, condition);
    expect(validator.validate()).toBe(false);
  });
});
