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
  | OutsideOfCondition;

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
    value: number | string;
  };
};

export type LessThanCondition = {
  itemName: string;
  type: 'LESS_THAN';
  payload: {
    value: number | string;
  };
};

export type EqualCondition = {
  itemName: string;
  type: 'EQUAL';
  payload: {
    value: number | string;
  };
};

export type NotEqualCondition = {
  itemName: string;
  type: 'NOT_EQUAL';
  payload: {
    value: number | string;
  };
};

export type BetweenCondition = {
  itemName: string;
  type: 'BETWEEN';
  payload: {
    minValue: number | string;
    maxValue: number | string;
  };
};

export type OutsideOfCondition = {
  itemName: string;
  type: 'OUTSIDE_OF';
  payload: {
    minValue: number | string;
    maxValue: number | string;
  };
};
