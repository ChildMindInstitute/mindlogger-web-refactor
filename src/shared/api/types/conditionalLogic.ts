export type Match = 'any' | 'all';

export type ScoreConditionalLogic = {
  id: string;
  name: string;
  flagScore: boolean;
  match: Match;
  conditions: Array<ReportCondition>;
};

export type ConditionalLogic = {
  match: Match;
  conditions: Array<Condition>;
};

export type Condition =
  | IncludesOptionCondition
  | NotIncludesOptionCondition
  | EqualToOptionCondition
  | NotEqualToOptionCondition
  | GreaterThanCondition
  | LessThanCondition
  | EqualCondition
  | NotEqualCondition
  | BetweenCondition
  | OutsideOfCondition
  | GreaterThanDateCondition
  | LessThanDateCondition
  | EqualToDateCondition
  | NotEqualToDateCondition
  | BetweenDatesCondition
  | OutsideOfDatesCondition
  | GreaterThanTimeCondition
  | LessThanTimeCondition
  | EqualToTimeCondition
  | NotEqualToTimeCondition
  | BetweenTimesCondition
  | OutsideOfTimesCondition
  | GreaterThanTimeRangeCondition
  | LessThanTimeRangeCondition
  | EqualToTimeRangeCondition
  | NotEqualToTimeRangeCondition
  | BetweenTimeRangeCondition
  | OutsideOfTimeRangeCondition
  | GreaterThanSliderRowsCondition
  | LessThanSliderRowsCondition
  | EqualToSliderRowsCondition
  | NotEqualToSliderRowsCondition
  | BetweenSliderRowsCondition
  | OutsideOfSliderRowsCondition
  | EqualToRowOptionCondition
  | NotEqualToRowOptionCondition
  | IncludesRowOptionCondition
  | NotIncludesRowOptionCondition;

export type ReportCondition =
  | GreaterThanCondition
  | LessThanCondition
  | EqualCondition
  | NotEqualCondition
  | BetweenCondition
  | OutsideOfCondition;

export type IncludesOptionCondition = {
  itemName: string;
  type: 'INCLUDES_OPTION';
  payload: {
    optionValue: string;
  };
};

export type NotIncludesOptionCondition = {
  itemName: string;
  type: 'NOT_INCLUDES_OPTION';
  payload: {
    optionValue: string;
  };
};

export type EqualToOptionCondition = {
  itemName: string;
  type: 'EQUAL_TO_OPTION';
  payload: {
    optionValue: string;
  };
};

export type NotEqualToOptionCondition = {
  itemName: string;
  type: 'NOT_EQUAL_TO_OPTION';
  payload: {
    optionValue: string;
  };
};

export type GreaterThanCondition = {
  itemName: string;
  type: 'GREATER_THAN';
  payload: {
    value: number;
  };
};

export type LessThanCondition = {
  itemName: string;
  type: 'LESS_THAN';
  payload: {
    value: number;
  };
};

export type EqualCondition = {
  itemName: string;
  type: 'EQUAL';
  payload: {
    value: number;
  };
};

export type NotEqualCondition = {
  itemName: string;
  type: 'NOT_EQUAL';
  payload: {
    value: number;
  };
};

export type BetweenCondition = {
  itemName: string;
  type: 'BETWEEN';
  payload: {
    minValue: number;
    maxValue: number;
  };
};

export type OutsideOfCondition = {
  itemName: string;
  type: 'OUTSIDE_OF';
  payload: {
    minValue: number;
    maxValue: number;
  };
};

export type GreaterThanDateCondition = {
  itemName: string;
  type: 'GREATER_THAN_DATE';
  payload: {
    date: string; // Date here
  };
};

export type LessThanDateCondition = {
  itemName: string;
  type: 'LESS_THAN_DATE';
  payload: {
    date: string; // Date here
  };
};

export type EqualToDateCondition = {
  itemName: string;
  type: 'EQUAL_TO_DATE';
  payload: {
    date: string; // Date here
  };
};

export type NotEqualToDateCondition = {
  itemName: string;
  type: 'NOT_EQUAL_TO_DATE';
  payload: {
    date: string; // Date here
  };
};

export type BetweenDatesCondition = {
  itemName: string;
  type: 'BETWEEN_DATES';
  payload: {
    minDate: string; // Date here
    maxDate: string; // Date here
  };
};

export type OutsideOfDatesCondition = {
  itemName: string;
  type: 'OUTSIDE_OF_DATES';
  payload: {
    minDate: string; // Date here
    maxDate: string; // Date here
  };
};

export type GreaterThanTimeCondition = {
  itemName: string;
  type: 'GREATER_THAN_TIME';
  payload: {
    time: string;
  };
};

export type LessThanTimeCondition = {
  itemName: string;
  type: 'LESS_THAN_TIME';
  payload: {
    time: string;
  };
};

export type EqualToTimeCondition = {
  itemName: string;
  type: 'EQUAL_TO_TIME';
  payload: {
    time: string;
  };
};

export type NotEqualToTimeCondition = {
  itemName: string;
  type: 'NOT_EQUAL_TO_TIME';
  payload: {
    time: string;
  };
};

export type BetweenTimesCondition = {
  itemName: string;
  type: 'BETWEEN_TIMES';
  payload: {
    minTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
    maxTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
  };
};

export type OutsideOfTimesCondition = {
  itemName: string;
  type: 'OUTSIDE_OF_TIMES';
  payload: {
    minTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
    maxTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
  };
};

export type GreaterThanTimeRangeCondition = {
  itemName: string;
  type: 'GREATER_THAN_TIME_RANGE';
  payload: {
    fieldName: 'from' | 'to';
    time: string;
  };
};

export type LessThanTimeRangeCondition = {
  itemName: string;
  type: 'LESS_THAN_TIME_RANGE';
  payload: {
    fieldName: 'from' | 'to';
    time: string;
  };
};

export type EqualToTimeRangeCondition = {
  itemName: string;
  type: 'EQUAL_TO_TIME_RANGE';
  payload: {
    fieldName: 'from' | 'to';
    time: string;
  };
};

export type NotEqualToTimeRangeCondition = {
  itemName: string;
  type: 'NOT_EQUAL_TO_TIME_RANGE';
  payload: {
    fieldName: 'from' | 'to';
    time: string;
  };
};

export type BetweenTimeRangeCondition = {
  itemName: string;
  type: 'BETWEEN_TIMES_RANGE';
  payload: {
    fieldName: 'from' | 'to';
    minTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
    maxTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
  };
};

export type OutsideOfTimeRangeCondition = {
  itemName: string;
  type: 'OUTSIDE_OF_TIMES_RANGE';
  payload: {
    fieldName: 'from' | 'to';
    minTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
    maxTime: {
      hours: number; // 0 - 23
      minutes: number; // 0 - 59
    };
  };
};

export type GreaterThanSliderRowsCondition = {
  itemName: string;
  type: 'GREATER_THAN_SLIDER_ROWS';
  payload: {
    rowIndex: number;
    value: number;
  };
};

export type LessThanSliderRowsCondition = {
  itemName: string;
  type: 'LESS_THAN_SLIDER_ROWS';
  payload: {
    rowIndex: number;
    value: number;
  };
};

export type EqualToSliderRowsCondition = {
  itemName: string;
  type: 'EQUAL_TO_SLIDER_ROWS';
  payload: {
    rowIndex: number;
    value: number;
  };
};

export type NotEqualToSliderRowsCondition = {
  itemName: string;
  type: 'NOT_EQUAL_TO_SLIDER_ROWS';
  payload: {
    rowIndex: number;
    value: number;
  };
};

export type BetweenSliderRowsCondition = {
  itemName: string;
  type: 'BETWEEN_SLIDER_ROWS';
  payload: {
    rowIndex: number;
    minValue: number;
    maxValue: number;
  };
};

export type OutsideOfSliderRowsCondition = {
  itemName: string;
  type: 'OUTSIDE_OF_SLIDER_ROWS';
  payload: {
    rowIndex: number;
    minValue: number;
    maxValue: number;
  };
};

export type EqualToRowOptionCondition = {
  itemName: string;
  type: 'EQUAL_TO_ROW_OPTION';
  payload: {
    rowIndex: number;
    optionValue: string;
  };
};

export type NotEqualToRowOptionCondition = {
  itemName: string;
  type: 'NOT_EQUAL_TO_ROW_OPTION';
  payload: {
    rowIndex: number;
    optionValue: string;
  };
};

export type IncludesRowOptionCondition = {
  itemName: string;
  type: 'INCLUDES_ROW_OPTION';
  payload: {
    rowIndex: number;
    optionValue: string;
  };
};

export type NotIncludesRowOptionCondition = {
  itemName: string;
  type: 'NOT_INCLUDES_ROW_OPTION';
  payload: {
    rowIndex: number;
    optionValue: string;
  };
};
