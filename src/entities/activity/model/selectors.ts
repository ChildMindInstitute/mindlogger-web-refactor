import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "~/shared/utils"

export const actionSelector = (state: RootState) => state.activity
export const actionItemsSelector = createSelector(actionSelector, activity => activity.items)
export const actionItemAnswersSelector = createSelector(actionSelector, activity => activity.itemAnswers)
