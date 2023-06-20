export type Match = "any" | "all"

export type ConditionalLogic = {
  match: Match
  conditions: Array<Condition>
}

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

export type IncludesOptionCondition = {
  itemName: string
  type: "INCLUDES_OPTION"
  payload: {
    optionValue: string
  }
}

export type NotIncludesOptionCondition = {
  itemName: string
  type: "NOT_INCLUDES_OPTION"
  payload: {
    optionValue: string
  }
}

export type EqualToOptionCondition = {
  itemName: string
  type: "EQUAL_TO_OPTION"
  payload: {
    optionValue: string
  }
}

export type NotEqualToOptionCondition = {
  itemName: string
  type: "NOT_EQUAL_TO_OPTION"
  payload: {
    optionValue: string
  }
}

export type GreaterThanCondition = {
  itemName: string
  type: "GREATER_THAN"
  payload: {
    value: number
  }
}

export type LessThanCondition = {
  itemName: string
  type: "LESS_THAN"
  payload: {
    value: number
  }
}

export type EqualCondition = {
  itemName: string
  type: "EQUAL"
  payload: {
    value: number
  }
}

export type NotEqualCondition = {
  itemName: string
  type: "NOT_EQUAL"
  payload: {
    value: number
  }
}

export type BetweenCondition = {
  itemName: string
  type: "BETWEEN"
  payload: {
    minValue: number
    maxValue: number
  }
}

export type OutsideOfCondition = {
  itemName: string
  type: "OUTSIDE_OF"
  payload: {
    minValue: number
    maxValue: number
  }
}
